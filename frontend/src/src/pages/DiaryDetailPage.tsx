import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as diaryService from '../services/diary';
import { DiaryWithLocations } from '../types/diary';
import MapView from '../components/Map/MapView';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const DiaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryWithLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message || '日記の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [id]);

  const handleDelete = async () => {
    if (!diary || !window.confirm('この日記を削除してもよろしいですか？')) {
      return;
    }

    try {
      await diaryService.deleteDiary(diary.id);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '日記の削除に失敗しました');
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!diary) return <div>日記が見つかりませんでした</div>;

  return (
    <div className="diary-detail-page">
      <div className="diary-header">
        <h1>{diary.title}</h1>
        <p className="diary-date">
          {format(new Date(diary.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
        </p>
      </div>

      {diary.locations && diary.locations.length > 0 && (
        <div className="diary-map">
          <MapView locations={diary.locations} height="300px" />
        </div>
      )}

      <div className="diary-content">
        {diary.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="diary-actions">
        <Link to={`/diary/edit/${diary.id}`} className="btn btn-edit">
          編集
        </Link>
        <button onClick={handleDelete} className="btn btn-delete">
          削除
        </button>
        <Link to="/" className="btn btn-back">
          戻る
        </Link>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
