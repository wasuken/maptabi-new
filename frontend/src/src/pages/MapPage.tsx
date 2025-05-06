import React, { useState, useEffect } from 'react';
import MapView from '../components/Map/MapView';
import * as diaryService from '../services/diary';
import { Location } from '../types/location';
import { Diary } from '../types/diary';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [diaries, setDiaries] = useState<{ [key: number]: Diary }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // すべての日記を取得
        const diaryData = await diaryService.getAllDiaries();

        // 日記IDをキーとしたオブジェクトに変換
        const diaryMap: { [key: number]: Diary } = {};
        diaryData.forEach((diary) => {
          diaryMap[diary.id] = diary;
        });
        setDiaries(diaryMap);

        // すべての位置情報を取得（このAPIはバックエンドで実装する必要があります）
        // ここでは簡略化のため、各日記の位置情報を個別に取得しています
        const allLocations: Location[] = [];

        for (const diary of diaryData) {
          try {
            const diaryLocations = await diaryService.getDiaryLocations(diary.id);
            allLocations.push(...diaryLocations);
          } catch (err) {
            console.error(`日記ID ${diary.id} の位置情報取得エラー:`, err);
          }
        }

        setLocations(allLocations);
      } catch (err: any) {
        setError(err.message || 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>地図データを読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="map-page">
      <h1>あなたの思い出マップ</h1>
      <div className="map-container" style={{ height: '70vh' }}>
        <MapView locations={locations} diaries={diaries} height="100%" />
      </div>
      <div className="map-legend">
        <h3>凡例</h3>
        <p>マーカーをクリックすると、その場所に関連する日記の詳細が表示されます。</p>
        <p>現在地を表示するには、地図右上のボタンをクリックしてください。</p>
      </div>
    </div>
  );
};

export default MapPage;
