// src/pages/PublicMapPage.tsx
import React, { useState } from 'react';
import { PublicMapView } from '../components/Map';
import MarkerLegend from '../components/Map/MarkerLegend';
import * as diaryService from '../services/diary';
import { DiaryLocation } from '../types/location';
import { useGeolocation } from '../hooks/useGeolocation';

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
    } catch (err: ApiError | unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'データの取得に失敗しました');
      setLocations([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-map-page">
      <h1>公開日記マップ</h1>

      <div className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">緯度:</label>
            <input
              id="latitude"
              type="text"
              value={searchLat}
              onChange={(e) => setSearchLat(e.target.value)}
              placeholder="例: 35.6812"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">経度:</label>
            <input
              id="longitude"
              type="text"
              value={searchLng}
              onChange={(e) => setSearchLng(e.target.value)}
              placeholder="例: 139.7671"
            />
          </div>

          <div className="form-group">
            <label htmlFor="radius">範囲:</label>
            <select id="radius" value={radiusKm} onChange={handleRadiusChange}>
              <option value="1">1km</option>
              <option value="3">3km</option>
              <option value="5">5km</option>
              <option value="10">10km</option>
              <option value="20">20km</option>
              <option value="50">50km</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
            {loading ? '検索中...' : '検索する'}
          </button>
          <button onClick={useCurrentLocation} className="btn btn-secondary">
            現在地を使用
          </button>
        </div>

        <p className="help-text">マップをクリックして位置を選択することもできます。</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="map-container" style={{ height: '60vh', marginTop: '20px' }}>
        <PublicMapView
          locations={locations}
          height="100%"
          center={mapCenter}
          onMapClick={handleMapClick}
        />
      </div>

      {!loading && locations.length === 0 && (
        <p className="no-results">
          指定した位置周辺 {radiusKm}km 以内に公開されている日記はありません。
        </p>
      )}

      {!loading && locations.length > 0 && (
        <div className="results-info">
          <p>
            {locations.length}
            件の位置情報が見つかりました。マーカーをクリックすると詳細が表示されます。
          </p>
        </div>
      )}

      <MarkerLegend />

      <div className="map-description">
        <p>
          選択した位置の周辺にある公開日記の位置情報を表示しています。緯度・経度を入力して検索するか、マップをクリックして位置を指定できます。
        </p>
      </div>

      <style jsx>{`
        .search-form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .form-row {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-group {
          flex: 1;
          min-width: 150px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .help-text {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .no-results {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin-top: 20px;
        }

        .results-info {
          background-color: #e3f2fd;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default PublicMapPage;
