# リリースプロセス

## 概要
マプタビの安全で効率的なリリース手順とバージョン管理方針です。

## バージョニング規則

### セマンティックバージョニング
- **MAJOR.MINOR.PATCH** (例: 1.2.3)
- **MAJOR**: 破壊的変更
- **MINOR**: 新機能追加
- **PATCH**: バグ修正

### ブランチ別バージョン
- **main**: 本番リリース版
- **develop**: 開発版 (x.y.z-dev)
- **feature**: 機能開発版 (x.y.z-feature.name)

## リリース種別

### 定期リリース
- **頻度**: 月1回（第1金曜日）
- **内容**: 新機能・改善・バグ修正
- **期間**: 1週間のテスト期間

### ホットフィックス
- **対象**: 緊急バグ・セキュリティ修正
- **即座リリース**: 修正後24時間以内
- **承認**: テックリード必須

### メジャーリリース
- **頻度**: 四半期ごと
- **内容**: 大型機能・アーキテクチャ変更
- **期間**: 2週間のテスト期間

## リリース手順

### 1. リリース準備
```bash
# リリースブランチ作成
git checkout develop
git checkout -b release/v1.2.0

# バージョン更新
npm version minor
git commit -m "chore: bump version to 1.2.0"
```

### 2. テスト実行
```bash
# 全テスト実行
npm run test:all
npm run test:e2e
npm run test:performance

# ビルド確認
npm run build
```

### 3. ステージング デプロイ
```bash
# ステージング環境デプロイ
git push origin release/v1.2.0
# GitHub Actions で自動デプロイ
```

### 4. 本番リリース
```bash
# main ブランチマージ
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

# develop 同期
git checkout develop
git merge release/v1.2.0
```

## チェックリスト

### リリース前
- [ ] 全テストパス
- [ ] パフォーマンステスト
- [ ] セキュリティスキャン
- [ ] ドキュメント更新
- [ ] 変更ログ作成
- [ ] ステークホルダー承認

### リリース時
- [ ] 本番デプロイ成功
- [ ] ヘルスチェック確認
- [ ] 主要機能動作確認
- [ ] ロールバック手順確認

### リリース後
- [ ] 監視メトリクス確認
- [ ] エラーログ確認
- [ ] ユーザーフィードバック収集
- [ ] 次回リリース計画

## 変更ログ形式

```markdown
# Changelog

## [1.2.0] - 2025-06-07

### Added
- 日記検索機能
- 地図フィルター機能
- ダークモード対応

### Changed
- パフォーマンス改善
- UI デザイン更新

### Fixed
- ログイン時のバグ修正
- 地図表示問題解決

### Security
- JWT トークン強化
- SQLインジェクション対策
```

## ロールバック手順

### 即座ロールバック
```bash
# 前バージョンタグにロールバック
git checkout v1.1.9
git checkout -b hotfix/rollback-v1.2.0

# 緊急デプロイ
git push origin hotfix/rollback-v1.2.0
```

### データベースロールバック
```bash
# マイグレーション戻し
npm run db:migrate:down

# バックアップ復元
pg_restore backup_v1.1.9.sql
```

## 通知・コミュニケーション

### ステークホルダー通知
- **リリース1週間前**: 機能概要通知
- **リリース当日**: デプロイ開始・完了通知
- **問題発生時**: 即座報告・対応状況更新

### ユーザー通知
- **新機能**: アプリ内通知・ブログ記事
- **重要変更**: メール通知・警告表示
- **メンテナンス**: 事前アナウンス
