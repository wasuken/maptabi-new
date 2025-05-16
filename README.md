# マプタビ（MapTabi）

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

マプタビは、旅の思い出や日常の出来事を地図と一緒に記録できるオンライン日記サービスです。位置情報と文章を組み合わせることで、思い出をより鮮やかに残すことができます。

## 📝 機能概要

- **地図連携日記作成**: 場所の記録と一緒に日記を書くことができます
- **自動位置情報取得**: 現在地を自動で日記に記録できます
- **経路記録**: 複数の場所を巡った旅行記録も簡単に作成可能
- **公開/非公開設定**: 日記ごとに公開範囲を選べます
- **公開マップ探索**: 他のユーザーが公開している場所の日記を探索できます

## 🛠 技術スタック

### フロントエンド
- React + TypeScript
- React Router
- MapLibre GL
- Tailwind CSS
- Lucide Icons
- Axios

### バックエンド
- Node.js + Express
- TypeScript
- PostgreSQL + PostGIS（地理空間データ対応）
- JWT認証
- Winston（ロギング）

### インフラ・開発環境
- Docker + Docker Compose
- GitHub Actions（CI/CD）
- ESLint + Prettier
- Jest + Cypress（テスト）

## 🚀 開発環境のセットアップ

### 前提条件
- Docker と Docker Compose がインストールされていること
- Node.js v18以上（ローカル開発用）
- npm v8以上

### 環境構築手順

1. リポジトリをクローン:
```bash
git clone https://github.com/wasuken/maptabi-new.git
cd maptabi

### frontend

cp .env.sample -> .env

.envを編集
