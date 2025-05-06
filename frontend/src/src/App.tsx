import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// ページコンポーネント
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DiaryFormPage from './pages/DiaryFormPage';
import DiaryDetailPage from './pages/DiaryDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// レイアウトコンポーネント
import Layout from './components/Common/Layout';

// 認証が必要なルートのラッパー
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>読み込み中...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="diary/new" element={<DiaryFormPage />} />
            <Route path="diary/edit/:id" element={<DiaryFormPage isEditing />} />
            <Route path="diary/:id" element={<DiaryDetailPage />} />
            <Route path="diaries" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
