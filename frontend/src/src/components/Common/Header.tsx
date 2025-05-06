import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">地図×日記アプリ</Link>
        </div>

        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            <li>
              <Link to="/map">地図</Link>
            </li>
            <li>
              <Link to="/diary/new">新規作成</Link>
            </li>
          </ul>
        </nav>

        <div className="user-menu">
          {user ? (
            <>
              <span className="user-name">{user.displayName}</span>
              <button onClick={handleLogout} className="btn-logout">
                ログアウト
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
