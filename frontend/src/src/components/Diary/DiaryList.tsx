import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Diary } from '../../types/diary';
import * as diaryService from '../../services/diary';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const DiaryList: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await diaryService.getAllDiaries();
        setDiaries(data);
      } catch (err: Error) {
        setError(err.message || '日記の取得に失敗しました');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (diaries.length === 0) return <div>日記がありません。新しい日記を作成しましょう！</div>;

  return (
    <div className="diary-list">
      {diaries.map((diary) => (
        <div key={diary.id} className="diary-item">
          <h3>
            <Link to={`/diary/${diary.id}`}>{diary.title}</Link>
          </h3>
          <p className="diary-date">
            {format(new Date(diary.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
          </p>
          <p className="diary-content">
            {diary.content.length > 150 ? `${diary.content.substring(0, 150)}...` : diary.content}
          </p>
          <div className="diary-actions">
            <Link to={`/diary/${diary.id}`} className="btn btn-view">
              詳細を見る
            </Link>
            <Link to={`/diary/edit/${diary.id}`} className="btn btn-edit">
              編集
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
