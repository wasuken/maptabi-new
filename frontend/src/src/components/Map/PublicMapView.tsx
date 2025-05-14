import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DiaryLocation } from '../../types/location';
import { MapPin, Search, Layers, Compass } from 'lucide-react';

// マーカータイプの列挙型 (既存のものを使用)
enum MarkerType {
  START,
  MIDDLE,
  END,
  SINGLE,
}

// 日記ごとに一貫した色を割り当てるヘルパー関数
const getColorForDiary = (diaryId: number): string => {
  // 日記IDを基にしたシンプルなハッシュ
  const hash = diaryId % 360;
  // HSLカラーで彩度と明度を固定し、色相だけを変える
  return `hsl(${hash}, 70%, 50%)`;
};

interface PublicMapViewProps {
  locations: DiaryLocation[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
  className?: string;
}

const PublicMapView: React.FC<PublicMapViewProps> = ({
  locations = [],
  center = [139.6917, 35.6895], // デフォルトは東京
  zoom = 13,
  onMapClick,
  height = '500px',
  width = '100%',
  className = '',
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
      styleElement.current = document.createElement('style');
      styleElement.current.innerHTML = `
        .custom-marker {
          cursor: pointer;
        }
        
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        }
        
        .marker-container:hover {
          transform: scale(1.2);
          z-index: 10;
        }
        
        .maplibregl-popup {
          max-width: 250px !important;
        }
        
        .public-diary-popup h3 {
          font-weight: 600;
          margin-bottom: 5px;
          color: #333;
        }
        
        .public-diary-popup p {
          margin: 3px 0;
          color: #666;
          font-size: 12px;
        }
        
        .public-diary-popup a {
          color: #3b82f6;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
        }
        
        .public-diary-popup a:hover {
          text-decoration: underline;
        }
      `;
      document.head.appendChild(styleElement.current);
    }

    // マップを初期化
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
      center,
      zoom,
    });

    // コントロールの追加
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        visualizePitch: true,
      }),
      'top-right'
    );
    
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left'
    );
    
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'top-right'
    );

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

        // マーカースタイル
        let markerStyle = '';
        let markerContent = '';

        switch (markerType) {
          case MarkerType.START:
            markerStyle = `
              width: 32px;
              height: 32px;
              background-color: ${color};
              clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
            `;
            markerContent = 'S';
            break;
          case MarkerType.END:
            markerStyle = `
              width: 32px;
              height: 32px;
              background-color: ${color};
              border-radius: 4px;
            `;
            markerContent = 'E';
            break;
          case MarkerType.SINGLE:
            markerStyle = `
              width: 32px;
              height: 32px;
              background-color: ${color};
              border-radius: 4px;
              transform: rotate(45deg);
            `;
            markerContent = `<div style="transform: rotate(-45deg);">★</div>`;
            break;
          default:
            markerStyle = `
              width: 32px;
              height: 32px;
              background-color: ${color};
              border-radius: 50%;
            `;
            markerContent = `${markerNumber}`;
        }

        // カスタムマーカーを作成
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div class="marker-container" style="${markerStyle}">
            <div class="marker-content" style="display: flex; align-items: center; justify-content: center;">${markerContent}</div>
          </div>
        `;

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

        // 日記タイトルとポップアップコンテンツ
        const popupContent = `
          <div class="public-diary-popup p-3">
            <h3 class="text-base font-medium">公開日記</h3>
            <p class="flex items-center mb-1">
              <span class="font-medium mr-1">${markerTypeText}:</span>
              ${location.name || '名称なし'}
            </p>
            <p class="text-xs text-gray-500 mb-2">
              ${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}
            </p>
            <a href="/diary/${diaryId}" class="text-sm text-blue-600 hover:text-blue-800 flex items-center" target="_blank">
              詳細を見る
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
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
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`} style={{ height, width }}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* マップ上の追加UI要素（オプション） */}
      {onMapClick && (
        <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-75 p-2 rounded-md shadow text-xs text-gray-700">
          <p className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            地図をクリックして検索位置を選択
          </p>
        </div>
      )}
      
      {/* マップの説明 */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-700 max-w-xs">
        <h4 className="font-medium text-sm mb-1">公開日記マップ</h4>
        <p>近くの公開されている日記を探索できます。マーカーをクリックして詳細を確認しましょう。</p>
      </div>
    </div>
  );
};

export default PublicMapView;
