# クイックスタート

## 概要
マプタビを最短時間で起動するための手順です。開発環境の即座立ち上げに特化しています。

## 前提条件
- Docker + Docker Compose がインストール済み
- Git がインストール済み
- 8GB以上のRAM

## 5分でスタート

### 1. リポジトリクローン（1分）
```bash
git clone https://github.com/wasuken/maptabi-new.git
cd maptabi-new
```

### 2. Docker環境起動（3分）
```bash
# 全サービス一括起動
docker compose up -d

# 起動確認
docker compose ps
```

### 3. 動作確認（1分）
```bash
# バックエンド確認
curl http://localhost:3334/api/health

# フロントエンド確認（ブラウザで開く）
open http://localhost:3333
```

## 基本操作

### ユーザー登録・ログイン
1. http://localhost:3333/register でアカウント作成
2. メールアドレス・パスワード・表示名を入力
3. 自動ログイン後、ダッシュボードに移動

### 初めての日記作成
1. 「新しい日記を作成」ボタンをクリック
2. タイトル・本文を入力
3. 「現在地を追加」で位置情報追加
4. 保存ボタンで完了

### 地図で確認
1. 「地図」メニューをクリック
2. 作成した日記の位置がマーカーで表示
3. マーカーをクリックして詳細確認

## サービス停止・再開

### 停止
```bash
docker compose down
```

### 再開
```bash
docker compose up -d
```

### 完全リセット
```bash
# データベース含む完全削除
docker compose down -v
docker compose up -d
```

## 開発モード起動

### フロントエンド開発
```bash
cd frontend/src
npm install
npm run dev
# http://localhost:3333 でホットリロード開発
```

### バックエンド開発
```bash
cd backend
npm install
npm run dev
# http://localhost:3334 でAPI開発
```

## よく使うコマンド

### ログ確認
```bash
# 全サービスログ
docker compose logs -f

# 特定サービスログ
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f postgres
```

### データベース直接アクセス
```bash
# PostgreSQL接続
docker compose exec postgres psql -U maptabi -d maptabi

# テーブル確認
\dt

# ユーザー一覧
SELECT * FROM users;
```

### コンテナ状況確認
```bash
# 起動中コンテナ
docker compose ps

# リソース使用量
docker stats

# イメージ一覧
docker images
```

## トラブル時の対処

### ポート競合エラー
```bash
# ポート使用確認
sudo netstat -tulpn | grep -E "(3333|3334|5432)"

# 競合プロセス終了
sudo fuser -k 3333/tcp
sudo fuser -k 3334/tcp
sudo fuser -k 5432/tcp
```

### コンテナ起動失敗
```bash
# 強制再構築
docker compose down
docker compose build --no-cache
docker compose up -d
```

### データベース初期化エラー
```bash
# PostgreSQLボリューム削除
docker compose down -v
docker volume rm maptabi-new_postgres_data
docker compose up -d
```

## 次のステップ

### 詳細ドキュメント
- [完全インストール手順](./installation.md)
- [環境設定詳細](./configuration.md)
- [機能詳細](../../frontend/features/)

### 開発参加
- [Git ワークフロー](../project-management/git-workflow.md)
- [コーディング規約](../../frontend/development/coding-standards.md)
- [テスト実行](../../frontend/testing/strategy.md)

### 運用・デプロイ
- [本番環境構築](../../backend/deployment/infrastructure.md)
- [監視設定](../../backend/monitoring/logging.md)
- [セキュリティ設定](../security/security-policy.md)
