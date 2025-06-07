# 環境設定

## 概要
マプタビの環境変数、設定ファイル、各種設定の詳細説明です。

## 環境変数設定

### フロントエンド環境変数 (`frontend/src/.env`)

```env
# API接続設定
VITE_API_URL=http://localhost:3334

# サポート・お問い合わせ情報
VITE_SUPPORT_EMAIL=support@maptabi.example.com
VITE_PRIVACY_EMAIL=privacy@maptabi.example.com
VITE_CONTACT_FORM_URL=https://maptabi.example.com/contact

# 運営者情報
VITE_MANAGEMENT=マプタビ運営委員会

# 開発モード設定
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true

# 地図設定
VITE_DEFAULT_LAT=35.6812
VITE_DEFAULT_LNG=139.7671
VITE_DEFAULT_ZOOM=13

# 分析・監視（本番環境）
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### バックエンド環境変数 (`backend/.env`)

```env
# サーバー設定
NODE_ENV=development
PORT=3334
HOST=localhost

# データベース設定
DATABASE_URL=postgresql://maptabi:password@localhost:5432/maptabi
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maptabi
DB_USER=maptabi
DB_PASSWORD=password

# JWT認証設定
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS設定
CORS_ORIGIN=http://localhost:3333
CORS_CREDENTIALS=true

# ログ設定
LOG_LEVEL=info
LOG_FORMAT=combined

# セキュリティ設定
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 外部サービス設定
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@maptabi.example.com
SMTP_PASS=your-smtp-password

# 地図・地理空間設定
MAX_LOCATION_RADIUS_KM=100
DEFAULT_SEARCH_RADIUS_KM=5
GEOCODING_API_KEY=your-geocoding-api-key

# ファイルアップロード設定
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# 監視・分析
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ENABLED=false
```

### Docker環境変数 (`docker-compose.yml`)

```yaml
environment:
  # PostgreSQL設定
  POSTGRES_DB: maptabi
  POSTGRES_USER: maptabi
  POSTGRES_PASSWORD: password

  # Redis設定（将来使用予定）
  REDIS_URL: redis://redis:6379

  # 本番環境設定
  NODE_ENV: production
  DATABASE_URL: postgresql://maptabi:password@postgres:5432/maptabi
```

## 設定ファイル詳細

### TypeScript設定

#### フロントエンド (`frontend/src/tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react-jsx"
  }
}
```

#### バックエンド (`backend/tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### ESLint設定 (`frontend/src/.eslintrc.js`)

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
```

## 環境別設定

### 開発環境 (development)
- **フロントエンド**: `localhost:3333`
- **バックエンド**: `localhost:3334`
- **データベース**: `localhost:5432`
- **ログレベル**: `debug`
- **ホットリロード**: 有効
- **ソースマップ**: 有効

### ステージング環境 (staging)
- **フロントエンド**: `https://staging.maptabi.example.com`
- **バックエンド**: `https://api-staging.maptabi.example.com`
- **データベース**: 専用RDSインスタンス
- **ログレベル**: `info`
- **監視**: 有効
- **SSL**: 必須

### 本番環境 (production)
- **フロントエンド**: `https://maptabi.example.com`
- **バックエンド**: `https://api.maptabi.example.com`
- **データベース**: 高可用性RDS構成
- **ログレベル**: `warn`
- **監視・アラート**: 完全有効
- **SSL**: 必須
- **CDN**: 有効

## セキュリティ設定

### JWT設定
```env
# 本番環境では必ず変更
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
```

### CORS設定
```env
# 開発環境
CORS_ORIGIN=http://localhost:3333

# 本番環境
CORS_ORIGIN=https://maptabi.example.com
```

### レート制限設定
```env
# API レート制限（15分間で100リクエスト）
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ログイン試行制限（1時間で5回）
LOGIN_RATE_LIMIT_WINDOW_MS=3600000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5
```

## 関連ドキュメント
- [システム要件](./requirements.md)
- [インストール手順](./installation.md)
- [検証手順](./verification.md)
- [セキュリティ設定](../security/security-policy.md)

---
最終更新: 2025年6月7日
```

---

### `docs/shared/setup/verification.md`

```markdown
# セットアップ完了確認

## 概要
マプタビの環境構築が正常に完了しているかを確認する手順です。

## 1. システム基盤確認

### 1.1 Node.js環境確認
```bash
# Node.jsバージョン確認
node --version
# 期待値: v18.0.0 以上

# npm バージョン確認
npm --version
# 期待値: v8.0.0 以上

# グローバルパッケージ確認
npm list -g --depth=0
```

### 1.2 Docker環境確認
```bash
# Docker バージョン確認
docker --version
# 期待値: Docker version 20.10.0 以上

# Docker Compose バージョン確認
docker compose version
# 期待値: v2.0.0 以上

# Docker 起動状況確認
docker ps
```

### 1.3 Git環境確認
```bash
# Git バージョン確認
git --version
# 期待値: git version 2.30.0 以上

# リポジトリ状況確認
git status
git remote -v
```

## 2. データベース確認

### 2.1 PostgreSQL接続確認
```bash
# データベース接続テスト
psql -h localhost -p 5432 -U maptabi -d maptabi -c "SELECT version();"

# PostGIS拡張確認
psql -h localhost -p 5432 -U maptabi -d maptabi -c "SELECT PostGIS_Version();"

# テーブル存在確認
psql -h localhost -p 5432 -U maptabi -d maptabi -c "\dt"
```

### 2.2 データベーススキーマ確認
```sql
-- 主要テーブル存在確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 期待されるテーブル:
-- - users
-- - diaries  
-- - locations
-- - sessions (将来実装予定)
```

## 3. アプリケーション動作確認

### 3.1 バックエンドAPI確認

#### ヘルスチェック
```bash
# API サーバー起動確認
curl -X GET http://localhost:3334/api/health
# 期待レスポンス: {"status": "OK", "timestamp": "..."}

# データベース接続確認
curl -X GET http://localhost:3334/api/health/db
# 期待レスポンス: {"status": "OK", "database": "connected"}
```

#### 認証エンドポイント確認
```bash
# ユーザー登録エンドポイント
curl -X POST http://localhost:3334/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "displayName": "テストユーザー"}'

# ログインエンドポイント
curl -X POST http://localhost:3334/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 3.2 フロントエンド確認

#### アプリケーション起動確認
```bash
# 開発サーバー起動
cd frontend/src
npm run dev

# ブラウザで以下にアクセス
# http://localhost:3333
```

#### ビルド確認
```bash
# 本番ビルド実行
cd frontend/src
npm run build

# ビルド成果物確認
ls -la dist/
```

## 4. 機能別動作確認

### 4.1 ユーザー認証機能
1. **ユーザー登録**
   - ブラウザで `/register` にアクセス
   - 新規ユーザー情報を入力して登録
   - 登録完了後、自動的にダッシュボードに遷移

2. **ログイン・ログアウト**
   - ブラウザで `/login` にアクセス
   - 登録したユーザー情報でログイン
   - ヘッダーからログアウト実行

### 4.2 地図機能
1. **地図表示**
   - ダッシュボードまたは `/map` で地図表示確認
   - ズーム・パン操作確認
   - 現在地ボタン動作確認

2. **位置情報取得**
   - ブラウザが位置情報許可を求める場合は許可
   - 現在地マーカー表示確認

### 4.3 日記機能
1. **日記作成**
   - `/diary/new` で新規日記作成
   - タイトル・本文入力
   - 位置情報追加
   - 公開設定選択
   - 保存実行

2. **日記表示・編集**
   - ダッシュボードで作成した日記確認
   - 日記詳細ページ表示
   - 編集機能動作確認

## 5. パフォーマンス確認

### 5.1 ページ読み込み速度
```bash
# フロントエンドパフォーマンス測定
lighthouse http://localhost:3333 --view

# 期待値:
# - Performance: 80以上
# - Accessibility: 90以上
# - Best Practices: 80以上
# - SEO: 80以上
```

### 5.2 API応答速度
```bash
# API レスポンス時間測定
time curl -X GET http://localhost:3334/api/health

# 期待値: 500ms以内
```

## 6. 自動テスト実行

### 6.1 バックエンドテスト
```bash
cd backend
npm test

# 期待結果: 全テストパス
```

### 6.2 フロントエンドテスト
```bash
cd frontend/src
npm test

# 期待結果: 全テストパス
```

### 6.3 E2Eテスト
```bash
cd frontend/src
npm run cy:run

# 期待結果: 基本シナリオテストパス
```

## 7. セキュリティ基本確認

### 7.1 HTTPS設定確認（本番環境）
```bash
# SSL証明書確認
openssl s_client -connect maptabi.example.com:443 -servername maptabi.example.com

# セキュリティヘッダー確認
curl -I https://maptabi.example.com
```

### 7.2 認証セキュリティ確認
```bash
# 不正なJWTトークンテスト
curl -X GET http://localhost:3334/api/users/me \
  -H "Authorization: Bearer invalid-token"

# 期待レスポンス: 401 Unauthorized
```

## トラブルシューティング

### よくある確認項目

#### ポート競合
```bash
# ポート使用状況確認
netstat -tulpn | grep -E "(3333|3334|5432)"

# プロセス強制終了（必要に応じて）
sudo fuser -k 3333/tcp
sudo fuser -k 3334/tcp
```

#### 環境変数設定確認
```bash
# 環境変数表示
echo $NODE_ENV
echo $DATABASE_URL

# .env ファイル存在確認
ls -la frontend/src/.env
ls -la backend/.env
```

#### キャッシュクリア
```bash
# npm キャッシュクリア
npm cache clean --force

# Docker キャッシュクリア
docker system prune -f
```

## 確認完了チェックリスト

- [ ] Node.js環境（v18以上）
- [ ] Docker環境（v20.10以上）
- [ ] PostgreSQL + PostGIS接続
- [ ] バックエンドAPI起動・応答
- [ ] フロントエンド起動・表示
- [ ] ユーザー認証機能
- [ ] 地図表示機能
- [ ] 日記作成・表示機能
- [ ] 自動テスト実行
- [ ] パフォーマンス基準
- [ ] セキュリティ基本設定

すべてのチェックが完了すれば、セットアップ完了です！

## 関連ドキュメント
- [システム要件](./requirements.md)
- [インストール手順](./installation.md)
- [環境設定](./configuration.md)
- [トラブルシューティング](../../frontend/troubleshooting/common-issues.md)
