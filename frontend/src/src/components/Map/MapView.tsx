import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DiaryLocation } from '../../types/location';
import CommentList from '../Comments/CommentList';

// マーカータイプの列挙型（既存のものを使用）
enum MarkerType {
  START,
  MIDDLE,
  END,
  SINGLE,
}

interface MapViewProps {
  locations?: DiaryLocation[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
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
  const [selectedLocation, setSelectedLocation] = useState<DiaryLocation | null>(null);
  const [showComments, setShowComments] = useState(false);

  // マーカークリックハンドラを追加
  const handleMarkerClick = (location: DiaryLocation) => {
    setSelectedLocation(location);
    setShowComments(true);
  };

  // マップの初期化
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // スタイルを注入
    styleElement.current = document.createElement('style');
    styleElement.current.innerHTML = `
      .custom-marker {
        cursor: pointer;
      }

      .marker-start, .marker-end, .marker-circle, .marker-single {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      }
      
      .marker-start:hover, 
      .marker-end:hover, 
      .marker-circle:hover, 
      .marker-single:hover {
        transform: scale(1.2);
        z-index: 10;
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
      center: center,
      zoom: zoom,
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
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';

        // マーカースタイル
        let markerStyle = '';
        let markerContent = '';
        const color = '#3887be'; // デフォルトカラー

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

        markerElement.innerHTML = `
          <div class="marker-${markerType === MarkerType.START ? 'start' : markerType === MarkerType.END ? 'end' : markerType === MarkerType.SINGLE ? 'single' : 'circle'}" style="${markerStyle}">
            <div class="marker-content">${markerContent}</div>
          </div>
        `;

	// markerの作成で、クリックイベントを追加
	const marker = new maplibregl.Marker({
	  element: markerElement,
	})
	  .setLngLat([location.longitude, location.latitude])
	  .addTo(map.current!)
	  .on('click', () => {
	    handleMarkerClick(location);
	  });

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
          <div class="p-2">
            <h3 class="font-bold text-sm">${location.name || markerTypeText}</h3>
            <p class="text-xs text-gray-600">${markerTypeText}</p>
            <p class="text-xs text-gray-600">${location.recordedAt ? new Date(location.recordedAt).toLocaleString() : '日時不明'}</p>
            <p class="text-xs text-gray-600">緯度: ${location.latitude.toFixed(6)}<br>経度: ${location.longitude.toFixed(6)}</p>
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
            'line-width': 4,
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
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height, width }}>
  <div ref={mapContainer} className="w-full h-full" />

      {/* マップ上の追加UI要素（オプション） */}
      {onMapClick && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-75 p-2 rounded-md shadow text-xs text-gray-700">
          <p>地図をクリックして位置を追加</p>
        </div>
      )}

    {/* コメントサイドパネル */}
    {showComments && selectedLocation && (
      <div className="absolute top-0 right-0 h-full bg-white shadow-lg w-80 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-medium text-gray-900">
            {selectedLocation.name || `地点 ${selectedLocation.id}`}
          </h3>
          <button 
            onClick={() => setShowComments(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-600">
            緯度: {selectedLocation.latitude.toFixed(6)}
            <br />
            経度: {selectedLocation.longitude.toFixed(6)}
          </p>
          {selectedLocation.recordedAt && (
            <p className="text-xs text-gray-600 mt-1">
              記録日時: {new Date(selectedLocation.recordedAt).toLocaleString()}
            </p>
          )}
        </div>

        <CommentList locationId={selectedLocation.id} />
      </div>
    )}
  </div>
  );
};

export default MapView;
