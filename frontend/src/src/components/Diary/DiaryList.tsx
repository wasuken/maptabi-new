import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Diary } from '../../types/diary';
import * as diaryService from '../../services/diary';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MapPin, Edit, Eye, ArrowRight, Calendar } from 'lucide-react';

const DiaryList: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await diaryService.getAllDiaries();
        setDiaries(data);
      } catch (err: unknown) {
        setError('日記の取得に失敗しました');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">エラー: {error}</p>
        </div>
      </div>
    </div>
  );
  
  if (diaries.length === 0) return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-700">日記がありません。新しい日記を作成しましょう！</p>
          <div className="mt-3">
            <Link 
              to="/diary/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>新しい日記を作成</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {diaries.map((diary) => (
        <div key={diary.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                <Link to={`/diary/${diary.id}`} className="hover:text-blue-600">
                  {diary.title}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="flex-shrink-0 h-4 w-4 mr-1" />
                <span>{format(new Date(diary.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}</span>
              </div>
            </div>
            {diary.isPublic && (
              <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                公開
              </span>
            )}
          </div>
          <div className="px-4 py-4 sm:px-6">
            <p className="text-gray-700 text-sm line-clamp-3">
              {diary.content.length > 200 ? `${diary.content.substring(0, 200)}...` : diary.content}
            </p>
          </div>
          <div className="px-4 py-4 sm:px-6 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="flex-shrink-0 h-4 w-4 mr-1" />
              <span>位置情報</span>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/diary/${diary.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Eye className="h-4 w-4 mr-1" />
                <span>詳細</span>
              </Link>
              <Link
                to={`/diary/edit/${diary.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>編集</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
