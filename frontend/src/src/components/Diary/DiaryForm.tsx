import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as diaryService from '../../services/diary';
import { DiaryInput } from '../../types/diary';
import { useGeolocation } from '../../hooks/useGeolocation';
import MapView from '../Map/MapView';
import { LocationInput, DiaryLocation } from '../../types/location';
import { removeItemBySplice } from '../../utils/ArrayHelper';
import { MapPin, Save, X, Plus, Trash2 } from 'lucide-react';

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
            locationData.map((loc: DiaryLocation) => ({
              name: loc.name,
              latitude: loc.latitude,
              longitude: loc.longitude,
              altitude: loc.altitude,
              recordedAt: loc.recordedAt,
              orderIndex: loc.orderIndex,
            }))
          );
        } catch (err: unknown | Error) {
          if (err instanceof Error) {
            setError(err.message || '日記データの取得に失敗しました');
          }
          setError('日記データの取得に失敗しました');
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

  const handleLocationDelete = (index: number) => {
    const newlocs = [...locations];
    setLocations(removeItemBySplice(newlocs, index));
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
        // 位置情報の更新
        if (locations.length > 0) {
          await diaryService.addLocations(diaryId, locations);
        }
      } else {
        const newDiary = await diaryService.createDiary(formData);
        // 位置情報の追加
        if (locations.length > 0 && newDiary.id) {
          await diaryService.addLocations(newDiary.id, locations);
        }
      }

      navigate('/diaries');
    } catch (err: unknown | Error) {
      if (err instanceof Error) {
        setError(err.message || '日記の保存に失敗しました');
      }
      setError('日記の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? '日記を編集' : '新しい日記を作成'}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">あなたの記録を残しましょう</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              本文
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              公開する
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium text-gray-900">位置情報</h4>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddCurrentLocation}
                disabled={!geolocation.latitude || !geolocation.longitude}
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span>現在地を追加</span>
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
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
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">追加された場所 ({locations.length})</h5>
                <ul className="divide-y divide-gray-200">
                  {locations.map((loc, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{loc.name || `地点 ${index + 1}`}</p>
                          <p className="text-xs text-gray-500">{loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLocationDelete(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label="削除"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/diaries')}
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-1" />
            {loading ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryForm;
