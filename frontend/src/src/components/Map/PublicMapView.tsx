// src/components/Map/PublicMapView.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DiaryLocation } from '../../types/location';
import {
  MarkerType,
  getColorForDiary,
  createCustomMarker,
  initializeMapStyle,
  setupMap,
} from '../../utils/MapUtils';

interface PublicMapViewProps {
  locations: DiaryLocation[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
}

const PublicMapView: React.FC<PublicMapViewProps> = ({
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

  // 日記ごとにグループ化された位置情報
  const locationsByDiary = useMemo(() => {
    const result: { [key: number]: DiaryLocation[] } = {};

    locations.forEach((location) => {
      if (!result[location.diaryId]) {
        result[location.diaryId] = [];
      }
      result[location.diaryId].push(location);
    });

    return result;
  }, [locations]);

  // マップの初期化
  useEffect(() => {
    if (!mapContainer.current) return;

    // 既存のマップを削除
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // スタイルを注入
    if (!styleElement.current) {
      styleElement.current = initializeMapStyle();
    }

    // マップを初期化
    map.current = setupMap(mapContainer.current, center, zoom);

    // クリックイベント設定
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
    };
  }, [center, zoom, onMapClick]);

  // 各日記の位置情報を表示
  useEffect(() => {
    if (!mapInitialized || !map.current) return;

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

    if (Object.keys(locationsByDiary).length === 0) return;

    // すべての位置情報を含むバウンズを作成
    let bounds: maplibregl.LngLatBounds | null = null;

    // 日記ごとにマーカーとルートを追加
    Object.entries(locationsByDiary).forEach(([diaryIdStr, diaryLocations]) => {
      const diaryId = parseInt(diaryIdStr);
      const color = getColorForDiary(diaryId);

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

        // TODO 日記タイトルを
        const popupContent = `
          <div>
            <h3>${'無題の日記'}</h3>
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
    if (bounds) {
      const boundsObj = bounds as unknown;
      if (boundsObj instanceof maplibregl.LngLatBounds && !boundsObj.isEmpty()) {
        map.current?.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    }
  }, [locations, locationsByDiary, mapInitialized]);

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

export default PublicMapView;
