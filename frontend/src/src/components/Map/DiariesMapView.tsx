import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Link } from 'react-router-dom';
import { Diary } from '../../types/diary';
import { DiaryLocation } from '../../types/location';
import {
  MarkerType,
  getColorForDiary,
  createCustomMarker,
  initializeMapStyle,
  setupMap,
} from '../../utils/MapUtils';

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

const DiariesMapView: React.FC<DiariesMapViewProps> = ({
  locations = [],
  diaries = {},
  center,
  zoom,
  height = '500px',
  width = '100%',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const styleElement = useRef<HTMLStyleElement | null>(null);
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

    // スタイルを注入
    styleElement.current = initializeMapStyle();

    // マップを初期化
    map.current = setupMap(mapContainer.current, center, zoom);

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

        // orderIndexでソート
        const sortedLocations = [...diaryLocations].sort((a, b) => a.orderIndex - b.orderIndex);
        const locationCount = sortedLocations.length;

        // この日記の位置情報でバウンズを拡張
        sortedLocations.forEach((location, index) => {
          const lngLat: [number, number] = [location.longitude, location.latitude];

          if (!bounds) {
            bounds = new maplibregl.LngLatBounds(lngLat, lngLat);
          } else {
            bounds.extend(lngLat);
          }

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
          const markerElement = createCustomMarker(markerNumber, color, markerType);

          // マーカーを地図に追加
          const marker = new maplibregl.Marker({
            element: markerElement,
          })
            .setLngLat(lngLat)
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
              <h3>${diary?.title || '無題の日記'}</h3>
              <p>${markerTypeText}: ${location.name || '名称なし'}</p>
              <p>${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}</p>
              <a href="/diary/${diaryId}" target="_blank">詳細を見る</a>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupContent);
          marker.setPopup(popup);
        });

        // 位置情報が2つ以上ある場合はルートを描画
        if (sortedLocations.length >= 2) {
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
