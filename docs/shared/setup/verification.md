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
