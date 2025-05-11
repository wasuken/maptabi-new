import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../types/error';

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err: ApiError | unknown) {
      const error = err as ApiError;
      setLocalError(error.response?.data?.message || error.message || 'ログインに失敗しました');
      throw err;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>ログイン</h1>

        {(error || localError) && <div className="error-message">{error || localError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            アカウントをお持ちでない方は
            <Link to="/register">新規登録</Link>
            してください
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
