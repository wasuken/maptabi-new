import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DiaryLocation } from '../../types/location';

interface MapViewProps {
  locations?: DiaryLocation[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
}

const MapView: React.FC<MapViewProps> = ({
  locations = [],
  center = [139.6917, 35.6895], // デフォルト: 東京（注意: MapLibreはlng, latの順）
  zoom = 13,
  onMapClick,
  height = '500px',
  width = '100%',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // マップの初期化
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center: center,
      zoom: zoom,
    });

    // マップのロード完了時の処理
    map.current.on('load', () => {
      if (map.current) {
        // クリックイベント設定
        if (onMapClick) {
          map.current.on('click', (e) => {
            onMapClick(e.lngLat.lat, e.lngLat.lng);
          });
        }

        // コントロールの追加
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        map.current.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          })
        );

        setMapInitialized(true);
      }
    });

    // クリーンアップ
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, onMapClick]);

  // 位置情報のマーカー・ルート表示
  useEffect(() => {
    if (!mapInitialized || !map.current || locations.length === 0) return;

    // 既存のマーカーとルートを削除
    const existingMarkers = document.querySelectorAll('.maplibregl-marker');
    existingMarkers.forEach((marker) => marker.remove());

    if (map.current.getSource('route')) {
      map.current.removeLayer('route-line');
      map.current.removeSource('route');
    }

    // マーカーの追加
    locations.forEach((location) => {
      const marker = new maplibregl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      // ポップアップの追加
      if (location.name) {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`<h3>${location.name}</h3>
          <p>${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}</p>`);

        marker.setPopup(popup);
      }
    });

    // ルートの表示（3つ以上の地点があれば）
    if (locations.length >= 2) {
      const sortedLocations = [...locations].sort((a, b) => a.orderIndex - b.orderIndex);
      const coordinates = sortedLocations.map((loc) => [loc.longitude, loc.latitude]);

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });

      // マップの表示範囲をルートに合わせる
      const bounds = coordinates.reduce(
        (bounds, coord) => {
          return bounds.extend(coord as [number, number]);
        },
        new maplibregl.LngLatBounds(
          coordinates[0] as [number, number],
          coordinates[0] as [number, number]
        )
      );

      map.current.fitBounds(bounds, {
        padding: 50,
      });
    }
  }, [locations, mapInitialized]);

  return (
    <div
      ref={mapContainer}
      style={{
        width,
        height,
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    />
  );
};

export default MapView;
