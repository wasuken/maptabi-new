import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as diaryService from '../../services/diary';
import { DiaryInput } from '../../types/diary';
import { useGeolocation } from '../../hooks/useGeolocation';
import MapView from '../Map/MapView';
import { LocationInput } from '../../types/location';

interface DiaryFormProps {
  isEditing?: boolean;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const diaryId = id ? parseInt(id) : undefined;

  const [formData, setFormData] = useState<DiaryInput>({
    title: '',
    content: '',
    isPublic: false,
  });

  const [locations, setLocations] = useState<LocationInput[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  const geolocation = useGeolocation();

  // 編集モードの場合、既存のデータをロード
  useEffect(() => {
    const fetchDiary = async () => {
      if (isEditing && diaryId) {
        try {
          const diary = await diaryService.getDiaryById(diaryId);
          setFormData({
            title: diary.title,
            content: diary.content,
            isPublic: diary.isPublic,
          });

          // 位置情報の取得
          const locationData = await diaryService.getDiaryLocations(diaryId);
          setLocations(
            locationData.map((loc: any) => ({
              name: loc.name,
              latitude: loc.latitude,
              longitude: loc.longitude,
              altitude: loc.altitude,
              recordedAt: loc.recordedAt,
              orderIndex: loc.orderIndex,
            }))
          );
        } catch (err: any) {
          setError(err.message || '日記データの取得に失敗しました');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDiary();
  }, [isEditing, diaryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddCurrentLocation = () => {
    if (geolocation.latitude && geolocation.longitude) {
      setLocations([
        ...locations,
        {
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
          altitude: geolocation.altitude || undefined,
          recordedAt: new Date().toISOString(),
          orderIndex: locations.length,
        },
      ]);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocations([
      ...locations,
      {
        latitude: lat,
        longitude: lng,
        recordedAt: new Date().toISOString(),
        orderIndex: locations.length,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing && diaryId) {
        await diaryService.updateDiary(diaryId, formData);
        // 位置情報の更新（実際のAPIに合わせて調整が必要）
        // このサンプルでは、位置情報の更新APIは未実装
      } else {
        const newDiary = await diaryService.createDiary(formData);

        // 位置情報の追加
        if (locations.length > 0 && newDiary.id) {
          for (const location of locations) {
            await diaryService.addLocation(newDiary.id, location);
          }
        }
      }

      navigate('/diaries');
    } catch (err: any) {
      setError(err.message || '日記の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div>読み込み中...</div>;

  return (
    <div className="diary-form-container">
      <h2>{isEditing ? '日記を編集' : '新しい日記を作成'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="diary-form">
        <div className="form-group">
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">本文</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            required
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
            />
            公開する
          </label>
        </div>

        <div className="form-group">
          <h3>位置情報</h3>
          <button
            type="button"
            className="btn btn-location"
            onClick={handleAddCurrentLocation}
            disabled={!geolocation.latitude || !geolocation.longitude}
          >
            現在地を追加
          </button>

          <div className="location-map-container">
            <MapView
              locations={locations.map((loc, index) => ({
                id: index,
                diaryId: diaryId || 0,
                latitude: loc.latitude,
                longitude: loc.longitude,
                name: loc.name,
                altitude: loc.altitude,
                recordedAt: loc.recordedAt,
                orderIndex: loc.orderIndex || index,
                createdAt: new Date().toISOString(),
              }))}
              onMapClick={handleMapClick}
              height="300px"
            />
          </div>

          {locations.length > 0 && (
            <div className="location-list">
              <h4>追加された場所 ({locations.length})</h4>
              <ul>
                {locations.map((loc, index) => (
                  <li key={index}>
                    {loc.name || `地点 ${index + 1}`}: {loc.latitude.toFixed(6)},{' '}
                    {loc.longitude.toFixed(6)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '保存中...' : '保存する'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/diaries')}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryForm;
