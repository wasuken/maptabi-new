import React, { useState } from 'react';
import { PublicMapView } from '../components/Map';
import MarkerLegend from '../components/Map/MarkerLegend';
import * as diaryService from '../services/diary';
import { DiaryLocation } from '../types/location';
import { ApiError } from '../types/error';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapPin, Search, Globe, AlertCircle, Compass } from 'lucide-react';

const PublicMapPage: React.FC = () => {
  const [locations, setLocations] = useState<DiaryLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const geolocation = useGeolocation();

  // 検索座標の状態
  const [searchLat, setSearchLat] = useState<string>('');
  const [searchLng, setSearchLng] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRadiusKm(Number(e.target.value));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSearchLat(lat.toString());
    setSearchLng(lng.toString());
  };

  const useCurrentLocation = () => {
    if (geolocation.latitude && geolocation.longitude) {
      setSearchLat(geolocation.latitude.toString());
      setSearchLng(geolocation.longitude.toString());
      setMapCenter([geolocation.longitude, geolocation.latitude]);
    } else {
      setError('現在地を取得できません。ブラウザの位置情報設定を確認してください。');
    }
  };

  const handleSearch = async () => {
    if (!searchLat || !searchLng) {
      setError('緯度・経度を入力してください');
      return;
    }

    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(lat) || isNaN(lng)) {
      setError('有効な緯度・経度を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMapCenter([lng, lat]);

      const nearbyLocations = await diaryService.getNearbyPublicLocations(lat, lng, radiusKm);

      setLocations(nearbyLocations);
      setHasSearched(true);
    } catch (err: ApiError | unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'データの取得に失敗しました');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">公開日記マップ</h1>
        <p className="text-gray-600">近くの公開されている日記を探索しましょう</p>
      </div>

      {/* 検索パネル */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">検索条件</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                緯度
              </label>
              <input
                id="latitude"
                type="text"
                value={searchLat}
                onChange={(e) => setSearchLat(e.target.value)}
                placeholder="35.6812"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                経度
              </label>
              <input
                id="longitude"
                type="text"
                value={searchLng}
                onChange={(e) => setSearchLng(e.target.value)}
                placeholder="139.7671"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                検索範囲
              </label>
              <select
                id="radius"
                value={radiusKm}
                onChange={handleRadiusChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="1">1km</option>
                <option value="3">3km</option>
                <option value="5">5km</option>
                <option value="10">10km</option>
                <option value="20">20km</option>
                <option value="50">50km</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  検索中...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  検索する
                </>
              )}
            </button>
            
            <button
              onClick={useCurrentLocation}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Compass className="h-4 w-4 mr-2" />
              現在地を使用
            </button>
          </div>
          
          <p className="mt-3 text-sm text-gray-500 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            マップをクリックして位置を選択することもできます
          </p>
        </div>
      </div>
      
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* マップ表示 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-[500px]">
          <PublicMapView
            locations={locations}
            height="100%"
            center={mapCenter}
            onMapClick={handleMapClick}
          />
        </div>
      </div>
      
      {/* 検索結果情報 */}
      {hasSearched && (
        <div className={locations.length === 0 ? "bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md" : "bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md"}>
          <div className="flex">
            <div className="flex-shrink-0">
              {locations.length === 0 ? (
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              ) : (
                <Globe className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3">
              {locations.length === 0 ? (
                <p className="text-sm text-yellow-700">
                  指定した位置周辺 {radiusKm}km 以内に公開されている日記はありません。
                </p>
              ) : (
                <p className="text-sm text-blue-700">
                  {locations.length}件の位置情報が見つかりました。マーカーをクリックすると詳細が表示されます。
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* マップ凡例 */}
      <MarkerLegend />
    </div>
  );
};

export default PublicMapPage;
