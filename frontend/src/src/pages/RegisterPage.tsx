import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('パスワードが一致しません');
      return;
    }

    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err: any) {
      // エラーはuseAuth内で処理されるため、ここでは特に何もしない
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>アカウント登録</h1>

        {(error || localError) && <div className="error-message">{error || localError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="displayName">ユーザー名</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">パスワード（確認）</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            すでにアカウントをお持ちの方は
            <Link to="/login">ログイン</Link>
            してください
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
