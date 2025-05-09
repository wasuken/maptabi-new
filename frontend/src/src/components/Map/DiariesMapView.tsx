import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Link } from 'react-router-dom';
import { Diary } from '../../types/diary';
import { DiaryLocation } from '../../types/location';

interface DiariesMapViewProps {
  // 全ての位置情報
  locations: DiaryLocation[];
  // 日記ID -> 日記オブジェクトのマッピング
  diaries?: { [key: number]: Diary };
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
}

// 日記ごとにランダム色を割り当てるヘルパー関数
const getColorForDiary = (diaryId: number): string => {
  // 日記IDを基にしたシンプルなハッシュ
  const hash = diaryId % 360;
  // HSLカラーで彩度と明度を固定し、色相だけを変える
  return `hsl(${hash}, 70%, 50%)`;
};

const DiariesMapView: React.FC<DiariesMapViewProps> = ({
  locations = [],
  diaries = {},
  center = [139.6917, 35.6895], // デフォルト: 東京（注意: MapLibreはlng, latの順）
  zoom = 10,
  height = '500px',
  width = '100%',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // 日記ごとにグループ化された位置情報
  const locationsByDiary: { [key: number]: DiaryLocation[] } = {};

  // 位置情報を日記IDごとにグループ化
  locations.forEach((location) => {
    if (!locationsByDiary[location.diaryId]) {
      locationsByDiary[location.diaryId] = [];
    }
    locationsByDiary[location.diaryId].push(location);
  });

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
  }, [center, zoom]);

  // 各日記の位置情報を表示
  useEffect(() => {
    if (!mapInitialized || !map.current || Object.keys(locationsByDiary).length === 0) return;

    // スタイルが読み込み済みかどうかをチェック
    const updateMapFeatures = () => {
      // 既存のマーカーとルートを削除
      const existingMarkers = document.querySelectorAll('.maplibregl-marker');
      existingMarkers.forEach((marker) => marker.remove());

      // 各日記ごとのルートを削除
      Object.keys(locationsByDiary).forEach((diaryId) => {
        const routeId = `route-${diaryId}`;
        if (map.current?.getLayer(routeId)) {
          map.current.removeLayer(routeId);
        }
        if (map.current?.getSource(routeId)) {
          map.current.removeSource(routeId);
        }
      });

      // すべての位置情報を含むバウンズを作成
      let bounds: maplibregl.LngLatBounds | null = null;

      // 日記ごとにマーカーとルートを追加
      Object.entries(locationsByDiary).forEach(([diaryIdStr, diaryLocations]) => {
        const diaryId = parseInt(diaryIdStr);
        const color = getColorForDiary(diaryId);
        const diary = diaries[diaryId];

        // この日記の位置情報でバウンズを拡張
        diaryLocations.forEach((location) => {
          const lngLat: [number, number] = [location.longitude, location.latitude];

          if (!bounds) {
            bounds = new maplibregl.LngLatBounds(lngLat, lngLat);
          } else {
            bounds.extend(lngLat);
          }

          // マーカーの作成
          const marker = new maplibregl.Marker({
            color: color,
          })
            .setLngLat(lngLat)
            .addTo(map.current!);

          // ポップアップの追加
          const popupContent = `
            <div>
              <h3>${diary?.title || '無題の日記'}</h3>
              <p>${location.name || '名称なし'}</p>
              <p>${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}</p>
              <a href="/diary/${diaryId}" target="_blank">詳細を見る</a>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupContent);
          marker.setPopup(popup);
        });

        // 位置情報が2つ以上ある場合はルートを描画
        if (diaryLocations.length >= 2) {
          // orderIndexでソート
          const sortedLocations = [...diaryLocations].sort((a, b) => a.orderIndex - b.orderIndex);
          const coordinates = sortedLocations.map((loc) => [loc.longitude, loc.latitude]);

          const routeId = `route-${diaryId}`;
          map.current?.addSource(routeId, {
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
            id: routeId,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': color,
              'line-width': 3,
              'line-opacity': 0.75,
            },
          });
        }
      });

      // バウンズが設定されていれば、すべてのマーカーが見えるようにマップをフィット
      if (bounds && !bounds.isEmpty()) {
        map.current?.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
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
  }, [locations, diaries, locationsByDiary, mapInitialized]);

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

export default DiariesMapView;
