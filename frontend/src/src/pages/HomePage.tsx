import React from 'react';
import { Link } from 'react-router-dom';
import DiaryList from '../components/Diary/DiaryList';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>ようこそ、{user?.displayName}さん</h1>
        <p>あなたの思い出を地図と一緒に記録しましょう。</p>
        <div className="action-buttons">
          <Link to="/diary/new" className="btn btn-primary">
            新しい日記を作成
          </Link>
          <Link to="/map" className="btn btn-secondary">
            地図を見る
          </Link>
        </div>
      </div>

      <div className="diary-list-section">
        <h2>最近の日記</h2>
        <DiaryList />
      </div>
    </div>
  );
};

export default HomePage;
