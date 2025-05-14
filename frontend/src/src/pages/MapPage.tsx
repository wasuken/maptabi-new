import React, { useState, useEffect } from 'react';
import { DiariesMapView, MarkerLegend } from '../components/Map';
import * as diaryService from '../services/diary';
import { DiaryLocation } from '../types/location';
import { ApiError } from '../types/error';
import { Diary } from '../types/diary';
import { MapPin, Filter, Calendar, Search, ChevronDown, X } from 'lucide-react';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<DiaryLocation[]>([]);
  const [diaries, setDiaries] = useState<{ [key: number]: Diary }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // すべての日記と位置情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // すべての日記を取得
        const diaryData = await diaryService.getAllDiaries();

        // 日記IDをキーとしたオブジェクトに変換
        const diaryMap: { [key: number]: Diary } = {};
        diaryData.forEach((diary) => {
          diaryMap[diary.id] = diary;
        });
        setDiaries(diaryMap);

        // すべての位置情報を取得
        const allLocations: DiaryLocation[] = [];

        for (const diary of diaryData) {
          try {
            const diaryLocations = await diaryService.getDiaryLocations(diary.id);
            allLocations.push(...diaryLocations);
          } catch (err) {
            console.error(`日記ID ${diary.id} の位置情報取得エラー:`, err);
          }
        }

        setLocations(allLocations);
      } catch (err: ApiError | unknown) {
        const error = err as ApiError;
        setError(error.response?.data?.message || error.message || 'データの取得に失敗しました');
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 日記の検索
  const filteredDiaries = () => {
    let filtered = { ...diaries };

    // 検索語でフィルタリング
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(
          ([, diary]) =>
            diary.title.toLowerCase().includes(term) || diary.content.toLowerCase().includes(term)
        )
      );
    }

    // 日付でフィルタリング
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateFilter) {
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([, diary]) => new Date(diary.createdAt) >= cutoffDate)
      );
    }

    return filtered;
  };

  // フィルタリングされた日記に関連する位置情報を取得
  const filteredLocations = () => {
    const filteredDiaryIds = Object.keys(filteredDiaries()).map((id) => parseInt(id));

    return locations.filter((location) => filteredDiaryIds.includes(location.diaryId));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">エラー: {error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">あなたの思い出マップ</h1>
          <p className="text-gray-600">記録した日記と位置情報をマップ上で確認できます</p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <Filter className="mr-2 h-4 w-4" />
          フィルターと検索
          <ChevronDown className={`ml-2 h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">マップフィルター</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                日記を検索
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="タイトルや内容で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                日付で絞り込み
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="date-filter"
                  name="date-filter"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">すべての期間</option>
                  <option value="1month">過去1ヶ月</option>
                  <option value="3months">過去3ヶ月</option>
                  <option value="6months">過去6ヶ月</option>
                  <option value="1year">過去1年</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* マップビュー */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-[70vh]">
          <DiariesMapView
            locations={filteredLocations()}
            diaries={filteredDiaries()}
            height="100%"
          />
        </div>
      </div>

      {/* マップ凡例 */}
      <MarkerLegend />

      {/* 説明文 */}
      <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          マップの使い方
        </h3>
        <p className="text-sm text-blue-700">
          マーカーをクリックすると、その場所に関連する日記の詳細が表示されます。現在地を表示するには、地図右上のボタンをクリックしてください。
          マップ上では、訪問した場所の順序が番号付きで表示されます。また、経路の始点と終点は形状が異なるマーカーで表示されています。
        </p>
      </div>
    </div>
  );
};

export default MapPage;
