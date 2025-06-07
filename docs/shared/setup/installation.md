# インストール手順

## 概要
マプタビの開発環境を構築するための詳細なインストール手順です。

## 前提条件確認
[システム要件](./requirements.md)を事前に確認してください。

## 1. リポジトリのクローン

```bash
# GitHubからクローン
git clone https://github.com/wasuken/maptabi-new.git
cd maptabi-new

# ブランチ確認
git branch -a
git checkout main
```

## 2. Docker環境でのセットアップ（推奨）

### 2.1 Docker Composeによる一括構築
```bash
# サービス起動（初回は時間がかかります）
docker compose up -d

# ログ確認
docker compose logs -f

# 起動確認
docker compose ps
```

### 2.2 サービス確認
```bash
# フロントエンド確認
curl http://localhost:3333

# バックエンドAPI確認
curl http://localhost:3334/api/health

# データベース確認
docker compose exec postgres psql -U maptabi -d maptabi -c "\dt"
```

## 3. ローカル環境でのセットアップ

### 3.1 Node.js依存関係のインストール

#### フロントエンド
```bash
cd frontend/src
npm install

# 環境変数設定
cp .env.example .env
# .envファイルを適切に編集
```

#### バックエンド
```bash
cd backend
npm install

# 環境変数設定
cp .env.example .env
# .envファイルを適切に編集
```

### 3.2 PostgreSQLデータベース設定

#### PostgreSQL + PostGISのインストール
```bash
# macOS (Homebrew)
brew install postgresql postgis

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql-14 postgresql-14-postgis-3

# Windows
# PostgreSQL公式インストーラーを使用
# PostGIS拡張を含むバージョンを選択
```

#### データベース初期化
```bash
# PostgreSQL起動
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# データベース作成
createdb maptabi
psql maptabi -c "CREATE EXTENSION postgis;"

# 初期スキーマ適用
psql maptabi < create.sql
```

### 3.3 開発サーバー起動

#### フロントエンド起動
```bash
cd frontend/src
npm run dev
# http://localhost:3333 でアクセス可能
```

#### バックエンド起動
```bash
cd backend
npm run dev
# http://localhost:3334 でAPI起動
```

## 4. 開発ツールのセットアップ

### 4.1 Visual Studio Code拡張
```bash
# 推奨拡張機能リスト（.vscode/extensions.json参照）
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json
```

### 4.2 Git設定
```bash
# Git hooks設定（オプション）
cd .git/hooks
ln -s ../../scripts/pre-commit.sh pre-commit
chmod +x pre-commit
```

## 5. 初期データのセットアップ

### 5.1 サンプルデータ投入
```bash
# 開発用サンプルデータ
npm run seed:dev

# テスト用ユーザー作成
npm run create-test-user
```

## 6. セットアップ検証

### 6.1 基本動作確認
```bash
# ヘルスチェック実行
npm run health-check

# テスト実行
npm test

# フロントエンドビルド確認
cd frontend/src && npm run build
```

### 6.2 ブラウザでの確認
1. http://localhost:3333 にアクセス
2. ユーザー登録・ログイン機能の確認
3. 地図表示の確認
4. 日記作成機能の確認

## トラブルシューティング

### よくある問題

#### Node.jsバージョンエラー
```bash
# Node.jsバージョン確認
node --version

# nvmを使用してバージョン切り替え
nvm use 18
```

#### PostgreSQL接続エラー
```bash
# PostgreSQL起動状況確認
sudo systemctl status postgresql

# ポート確認
sudo netstat -tulpn | grep 5432

# データベース接続テスト
psql -h localhost -p 5432 -U maptabi -d maptabi
```

#### Docker関連エラー
```bash
# Docker起動確認
sudo systemctl status docker

# コンテナ再構築
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 関連ドキュメント
- [システム要件](./requirements.md)
- [環境設定](./configuration.md)
- [検証手順](./verification.md)
- [トラブルシューティング](../../frontend/troubleshooting/common-issues.md)
