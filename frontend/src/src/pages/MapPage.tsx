import React, { useState, useEffect } from 'react';
import { DiariesMapView } from '../components/Map';
import MarkerLegend from '../components/Map/MarkerLegend';
import * as diaryService from '../services/diary';
import { DiaryLocation } from '../types/location';
import { Diary } from '../types/diary';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<DiaryLocation[]>([]);
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
        <DiariesMapView locations={locations} diaries={diaries} height="100%" />
      </div>

      <MarkerLegend />

      <div className="map-description">
        <p>
          マーカーをクリックすると、その場所に関連する日記の詳細が表示されます。現在地を表示するには、地図右上のボタンをクリックしてください。
        </p>
        <p>
          マップ上では、訪問した場所の順序が番号付きで表示されます。また、経路の始点と終点は形状が異なるマーカーで表示されています。
        </p>
      </div>
    </div>
  );
};

export default MapPage;
