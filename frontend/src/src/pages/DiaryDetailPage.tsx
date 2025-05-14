import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as diaryService from '../services/diary';
import { DiaryWithLocations } from '../types/diary';
import { ApiError } from '../types/error';
import MapView from '../components/Map/MapView';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, MapPin, Edit, Trash2, ArrowLeft, Lock, Globe } from 'lucide-react';

const DiaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryWithLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchDiary = async () => {
      if (!id) return;

      try {
        const diaryData = await diaryService.getDiaryById(parseInt(id));

        // 位置情報がない場合は、ロケーションデータも取得
        if (!diaryData.locations || diaryData.locations.length === 0) {
          try {
            const locationData = await diaryService.getDiaryLocations(parseInt(id));
            diaryData.locations = locationData;
          } catch (err) {
            console.error('位置情報の取得に失敗しました:', err);
          }
        }

        setDiary(diaryData);
      } catch (err: ApiError | unknown) {
        const error = err as ApiError;
        setError(error.response?.data?.message || error.message || '日記の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [id]);

  const handleDelete = async () => {
    if (!diary) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await diaryService.deleteDiary(diary.id);
      navigate('/');
    } catch (err: ApiError | unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || '日記の削除に失敗しました');
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
 
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
      <div className="flex">
	<div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
	</div>
	<div className="ml-3">
          <p className="text-sm text-red-700">エラー: {error}</p>
	</div>
      </div>
    </div>
  );
 
  if (!diary) return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
      <div className="flex">
	<div className="ml-3">
          <p className="text-sm text-yellow-700">日記が見つかりませんでした</p>
          <div className="mt-2">
            <Link 
              to="/"
              className="inline-flex items-center text-sm text-yellow-700 underline hover:text-yellow-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              ホームに戻る
            </Link>
          </div>
	</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* コンテンツヘッダー */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
	<div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 break-words">{diary.title}</h1>
              <div className="mt-2 flex items-center text-sm text-gray-500">
		<Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
		<span>{format(new Date(diary.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}</span>
		<span className="ml-4 flex items-center">
                  {diary.isPublic ? (
                    <>
                      <Globe className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                      <span className="text-green-600">公開</span>
                    </>
                  ) : (
                    <>
                      <Lock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>非公開</span>
                    </>
                  )}
		</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
		to={`/diary/edit/${diary.id}`}
		className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
		<Edit className="h-4 w-4 mr-1" />
		編集
              </Link>
              <button
		onClick={handleDelete}
		className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
		<Trash2 className="h-4 w-4 mr-1" />
		削除
              </button>
            </div>
          </div>
	</div>
       
	{/* 削除確認 */}
	{confirmDelete && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-red-50">
            <div className="text-sm text-red-700">
              <p className="font-medium">削除を確認</p>
              <p className="mt-1">この日記を削除してもよろしいですか？この操作は取り消せません。</p>
              <div className="mt-3 flex space-x-3">
		<button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
		>
                  削除する
		</button>
		<button
                  onClick={handleCancelDelete}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
		>
                  キャンセル
		</button>
              </div>
            </div>
          </div>
	)}
       
	{/* 地図 */}
	{diary.locations && diary.locations.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="h-80">
              <MapView locations={diary.locations} height="100%" />
            </div>
            <div className="px-4 py-3 sm:px-6 bg-gray-50 flex items-center text-sm text-gray-600">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{diary.locations.length}箇所の位置情報</span>
            </div>
          </div>
	)}
       
	{/* 本文 */}
	<div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none text-gray-900">
            {diary.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
	</div>
      </div>
     
      {/* アクションボタン */}
      <div className="flex justify-between">
	<Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
	>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
	</Link>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
