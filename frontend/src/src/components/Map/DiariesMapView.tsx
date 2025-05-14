import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Diary } from '../../types/diary';
import { DiaryLocation } from '../../types/location';
import { MapPin, Filter, X } from 'lucide-react';

// 既存のユーティリティ関数を再利用
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

interface DiariesMapViewProps {
  // 全ての位置情報
  locations: DiaryLocation[];
  // 日記ID -> 日記オブジェクトのマッピング
  diaries?: { [key: number]: Diary };
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
}

const DiariesMapView: React.FC<DiariesMapViewProps> = ({
  locations = [],
  diaries = {},
  center = [139.6917, 35.6895], // デフォルトは東京
  zoom = 10,
  height = '500px',
  width = '100%',
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const styleElement = useRef<HTMLStyleElement | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
    if (map.current || !mapContainer.current) return;

    // スタイルを注入
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
      
    .marker-label {
    position: absolute;
    white-space: nowrap;
    background: white;
    color: #333;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 10px;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    }
      
    .custom-marker:hover .marker-label {
    opacity: 1;
    }
    `;
    document.head.appendChild(styleElement.current);

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

        // フィルターが適用されている場合はスキップ
        if (selectedDiaryId !== null && selectedDiaryId !== diaryId) {
          return;
        }

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

          // マーカースタイルとコンテンツを設定
          let markerStyle = '';
          let markerContent = '';

          switch (markerType) {
            case MarkerType.START:
              markerStyle = `
            width: 32px;
            height: 32px;
            background-color: ${color};
            clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
            display: flex;
            align-items: center;
            justify-content: center;
              `;
              markerContent = 'S';
              break;
            case MarkerType.END:
              markerStyle = `
            width: 32px;
            height: 32px;
            background-color: ${color};
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
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
            display: flex;
            align-items: center;
            justify-content: center;
              `;
              markerContent = `<div style="transform: rotate(-45deg);">★</div>`;
              break;
            default:
              markerStyle = `
            width: 32px;
            height: 32px;
            background-color: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
              `;
              markerContent = `${markerNumber}`;
          }

          // カスタムマーカーを作成
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.innerHTML = `
          <div class="marker-container" style="${markerStyle}">
          <div class="marker-content">${markerContent}</div>
          </div>
          <div class="marker-label">${diary?.title || '無題の日記'}</div>
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

          const popupContent = `
          <div class="p-3">
          <h3 class="text-base font-medium text-gray-900 mb-1">${diary?.title || '無題の日記'}</h3>
          <div class="text-sm text-gray-700 mb-2">
          <div class="flex items-center">
          <span class="font-medium mr-1">${markerTypeText}:</span>
                  ${location.name || '名称なし'}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                  ${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}
                  </div>
		  </div>
		  <a href="/diary/${diaryId}" class="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center" target="_blank">
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
  }, [locations, diaries, locationsByDiary, mapInitialized, selectedDiaryId]);

  // 日記フィルターの処理
  const handleDiaryFilter = (diaryId: number | null) => {
    setSelectedDiaryId(diaryId);
  };

  // フィルターの表示/非表示を切り替え
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden shadow-lg" />

      {/* マップコントロール・フィルターパネル */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={toggleFilters}
            className="flex items-center justify-center w-10 h-10 focus:outline-none hover:bg-gray-100"
            title="日記フィルター"
          >
            <Filter className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-2 bg-white rounded-lg shadow-lg p-3 w-64">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 text-sm">日記フィルター</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3">
              <button
                onClick={() => handleDiaryFilter(null)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                  selectedDiaryId === null
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                すべての日記を表示
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {Object.entries(diaries).map(([idStr, diary]) => {
                const id = parseInt(idStr);
                const color = getColorForDiary(id);
                return (
                  <button
                    key={id}
                    onClick={() => handleDiaryFilter(id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 flex items-center ${
                      selectedDiaryId === id
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="truncate">{diary.title || `日記 ${id}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* レジェンド */}
      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 rounded-lg shadow-lg p-3 text-sm">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center text-xs">
          <MapPin className="h-3 w-3 mr-1 text-gray-700" />
          マーカーの説明
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 transform rotate-180 mr-2"></div>
            <span className="text-xs text-gray-700">開始地点</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">
              2
            </div>
            <span className="text-xs text-gray-700">中間地点</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-sm mr-2 flex items-center justify-center text-white text-xs">
              E
            </div>
            <span className="text-xs text-gray-700">終了地点</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded transform rotate-45 mr-2 flex items-center justify-center">
              <span className="text-white text-xs transform -rotate-45">★</span>
            </div>
            <span className="text-xs text-gray-700">単一地点</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiariesMapView;
