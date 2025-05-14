import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DiaryList from '../components/Diary/DiaryList';
import { useAuth } from '../hooks/useAuth';
import { MapPin, PlusCircle, Map, Calendar, BookOpen } from 'lucide-react';
import * as diaryService from '../services/diary';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDiaries: 0,
    totalLocations: 0,
    latestDiary: null as { id: number; title: string; date: string } | null,
  });
  const [loading, setLoading] = useState(true);

  // 統計データの取得（実際にAPIがある場合）
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // 実際のプロジェクトでは、この部分を適切なAPIコールに置き換える
        const diaries = await diaryService.getAllDiaries();

        // ダミー処理としてデータから統計情報を生成
        let totalLocations = 0;
        let latestDiary = null;
        let latestDate = new Date(0);

        diaries.forEach((diary) => {
          // 最新の日記を見つける
          const diaryDate = new Date(diary.createdAt);
          if (diaryDate > latestDate) {
            latestDate = diaryDate;
            latestDiary = {
              id: diary.id,
              title: diary.title,
              date: format(diaryDate, 'yyyy年MM月dd日', { locale: ja }),
            };
          }

          // ここではロケーション数は取得できないのでダミーデータを使用
          // 実際のアプリケーションでは適切なAPIを呼び出す
          totalLocations += Math.floor(Math.random() * 5) + 1;
        });

        setStats({
          totalDiaries: diaries.length,
          totalLocations,
          latestDiary,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* ウェルカムヒーロー */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-12 sm:px-12">
          <h1 className="text-3xl font-bold text-white mb-2">ようこそ、{user?.displayName}さん</h1>
          <p className="text-blue-100 mb-6 max-w-2xl">
            マプタビで思い出を地図と一緒に記録しましょう。日記を書いて、位置情報を残すことで、あなたの体験はもっと色鮮やかに蘇ります。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/diary/new"
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-medium shadow-sm transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>新しい日記を作成</span>
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center px-4 py-2 bg-blue-800 text-white hover:bg-blue-900 rounded-md font-medium shadow-sm transition-colors"
            >
              <Map className="w-5 h-5 mr-2" />
              <span>地図を見る</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 統計ダッシュボード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? '読み込み中...' : stats.totalDiaries}
            </h3>
            <p className="text-sm text-gray-500">記録した日記</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? '読み込み中...' : stats.totalLocations}
            </h3>
            <p className="text-sm text-gray-500">マークした場所</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            {stats.latestDiary ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">
                  <Link to={`/diary/${stats.latestDiary.id}`} className="hover:text-blue-600">
                    {stats.latestDiary.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">最近の日記: {stats.latestDiary.date}</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  {loading ? '読み込み中...' : 'なし'}
                </h3>
                <p className="text-sm text-gray-500">最近の日記</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">最近の日記</h2>
        </div>
        <div className="p-6">
          <DiaryList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
