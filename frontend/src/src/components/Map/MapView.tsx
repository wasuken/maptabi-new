import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DiaryLocation } from '../../types/location';
import { MarkerType, createCustomMarker, initializeMapStyle, setupMap } from '../../utils/MapUtils';

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
  center,
  zoom,
  onMapClick,
  height = '500px',
  width = '100%',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const styleElement = useRef<HTMLStyleElement | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // マップの初期化
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // スタイルを注入
    styleElement.current = initializeMapStyle();

    // マップを初期化
    map.current = setupMap(mapContainer.current, center, zoom);

    // クリックイベント設定（マーカー追加用）
    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick(e.lngLat.lat, e.lngLat.lng);
      });
    }

    // マップのロード完了時の処理
    map.current.on('load', () => {
      setMapInitialized(true);
    });

    // クリーンアップ
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // スタイル要素も削除
      if (styleElement.current) {
        document.head.removeChild(styleElement.current);
        styleElement.current = null;
      }
    };
  }, [center, zoom, onMapClick]);

  // 位置情報のマーカー・ルート表示
  useEffect(() => {
    if (!mapInitialized || !map.current || locations.length === 0) return;

    // スタイルが読み込み済みかどうかをチェック
    const updateMapFeatures = () => {
      // 既存のマーカーとルートを削除
      const existingMarkers = document.querySelectorAll('.maplibregl-marker');
      existingMarkers.forEach((marker) => marker.remove());

      if (map.current?.getSource('route')) {
        map.current.removeLayer('route-line');
        map.current.removeSource('route');
      }

      // orderIndexでソート
      const sortedLocations = [...locations].sort((a, b) => a.orderIndex - b.orderIndex);
      const locationCount = sortedLocations.length;

      // マーカーの追加
      sortedLocations.forEach((location, index) => {
        // マーカータイプを決定
        let markerType: MarkerType;
        if (locationCount === 1) {
          markerType = MarkerType.SINGLE;
        } else if (index === 0) {
          markerType = MarkerType.START;
        } else if (index === locationCount - 1) {
          markerType = MarkerType.END;
        } else {
          markerType = MarkerType.MIDDLE;
        }

        // マーカー番号（1から始まる連番）
        const markerNumber = index + 1;

        // カスタムマーカーを作成
        const markerElement = createCustomMarker(markerNumber, '#3887be', markerType);

        // マーカーを地図に追加
        const marker = new maplibregl.Marker({
          element: markerElement,
        })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current!);

        // ポップアップの追加
        let markerTypeText = '';
        switch (markerType) {
          case MarkerType.START:
            markerTypeText = '開始地点';
            break;
          case MarkerType.END:
            markerTypeText = '終了地点';
            break;
          case MarkerType.SINGLE:
            markerTypeText = '単一地点';
            break;
          default:
            markerTypeText = `地点 ${markerNumber}`;
        }

        const popupContent = `
          <div>
            <h3>${location.name || markerTypeText}</h3>
            <p>${markerTypeText}</p>
            <p>${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}</p>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupContent);
        marker.setPopup(popup);
      });

      // ルートの表示（2つ以上の地点があれば）
      if (sortedLocations.length >= 2) {
        const coordinates = sortedLocations.map((loc) => [loc.longitude, loc.latitude]);

        map.current?.addSource('route', {
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

        map.current?.addLayer({
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

        map.current?.fitBounds(bounds, {
          padding: 50,
        });
      }
    };

    // スタイルが既に読み込まれているかチェック
    if (map.current.isStyleLoaded()) {
      updateMapFeatures();
    } else {
      // スタイルがまだ読み込まれていない場合はイベントリスナーを追加
      const onStyleLoad = () => {
        updateMapFeatures();
        map.current?.off('style.load', onStyleLoad);
      };

      map.current.on('style.load', onStyleLoad);
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
