# バックエンド ドキュメント

Node.js + Express で構築されたマプタビサーバーサイドアプリケーションの開発・運用に関するドキュメントです。

## 📚 ドキュメント一覧

### 🏗 [アーキテクチャ](./architecture/)
- [概要](./architecture/overview.md) - システム設計・構成
- [システム設計](./architecture/system-design.md) - 全体アーキテクチャ
- [データフロー](./architecture/data-flow.md) - リクエスト・レスポンス流れ
- [スケーラビリティ](./architecture/scalability.md) - 拡張性設計
- [パターン](./architecture/patterns.md) - 採用設計パターン

### 🌐 [API](./api/)
- [設計原則](./api/design-principles.md) - REST API 設計方針
- [エンドポイント](./api/endpoints.md) - API 仕様・使用例
- [認証](./api/authentication.md) - JWT 認証・認可
- [エラーハンドリング](./api/error-handling.md) - エラーレスポンス設計
- [バージョニング](./api/versioning.md) - API バージョン管理
- [ドキュメント](./api/documentation.md) - API ドキュメント生成

### 🗄 [データベース](./database/)
- [スキーマ設計](./database/schema-design.md) - テーブル設計・関係
- [マイグレーション](./database/migrations.md) - DB スキーマ変更管理
- [クエリ](./database/queries.md) - 効率的なクエリ・最適化
- [パフォーマンス](./database/performance.md) - インデックス・調整
- [バックアップ](./database/backup.md) - バックアップ・復旧戦略
- [メンテナンス](./database/maintenance.md) - 定期保守・監視

### 🔐 [認証](./authentication/)
- [戦略](./authentication/strategy.md) - 認証・認可方針
- [JWT 実装](./authentication/jwt-implementation.md) - JWT トークン実装
- [認可](./authentication/authorization.md) - 権限制御・ロール管理
- [セキュリティベストプラクティス](./authentication/security-best-practices.md)
- [セッション管理](./authentication/session-management.md) - セッション・状態管理

### ⚙️ [サービス](./services/)
- [ビジネスロジック](./services/business-logic.md) - ドメインロジック設計
- [位置情報サービス](./services/location-services.md) - 地理空間データ処理
- [日記サービス](./services/diary-services.md) - 日記 CRUD・検索
- [ユーザーサービス](./services/user-services.md) - ユーザー管理・プロファイル
- [外部連携](./services/external-integrations.md) - 外部 API・サービス連携

### 🚀 [デプロイ](./deployment/)
- [インフラ](./deployment/infrastructure.md) - サーバー・クラウド構成
- [Docker](./deployment/docker.md) - コンテナ化・オーケストレーション
- [CI/CD](./deployment/ci-cd.md) - 継続的インテグレーション・デプロイ
- [環境管理](./deployment/environments.md) - dev・staging・prod 環境
- [スケーリング](./deployment/scaling.md) - 水平・垂直スケーリング
- [監視](./deployment/monitoring.md) - インフラ監視・アラート

### 🧪 [テスト](./testing/)
- [戦略](./testing/strategy.md) - テスト全体戦略・方針
- [単体テスト](./testing/unit-testing.md) - Jest・モック・カバレッジ
- [結合テスト](./testing/integration-testing.md) - API・DB 結合テスト
- [API テスト](./testing/api-testing.md) - エンドポイントテスト
- [負荷テスト](./testing/load-testing.md) - パフォーマンス・ストレステスト

### 📊 [監視](./monitoring/)
- [ログ](./monitoring/logging.md) - 構造化ログ・集約
- [メトリクス](./monitoring/metrics.md) - パフォーマンス指標・収集
- [アラート](./monitoring/alerting.md) - 障害検知・通知
- [パフォーマンス監視](./monitoring/performance-monitoring.md) - APM・分析
- [エラー追跡](./monitoring/error-tracking.md) - エラー監視・分析

### 🔧 [トラブルシューティング](./troubleshooting/)
- [よくある問題](./troubleshooting/common-issues.md) - 頻出問題と解決方法
- [デバッグ](./troubleshooting/debugging.md) - 効率的なデバッグ手法
- [パフォーマンス問題](./troubleshooting/performance-issues.md) - 性能問題の特定・改善
- [データベース問題](./troubleshooting/database-issues.md) - DB 関連トラブル対応
- [FAQ](./troubleshooting/faq.md) - よくある質問と回答

## 🎯 対象読者別ガイド

### 新規参加開発者
1. [システム設計概要](./architecture/overview.md)
2. [API 設計原則](./api/design-principles.md)
3. [データベーススキーマ](./database/schema-design.md)
4. [開発環境構築](./deployment/docker.md)

### バックエンド開発者
1. [ビジネスロジック実装](./services/business-logic.md)
2. [API エンドポイント実装](./api/endpoints.md)
3. [データベース操作](./database/queries.md)
4. [テスト実装](./testing/)

### DevOps・インフラエンジニア
1. [インフラ設計](./deployment/infrastructure.md)
2. [CI/CD パイプライン](./deployment/ci-cd.md)
3. [監視・ログ設定](./monitoring/)
4. [スケーリング戦略](./deployment/scaling.md)

### 運用・保守担当者
1. [監視ダッシュボード](./monitoring/metrics.md)
2. [トラブルシューティング](./troubleshooting/)
3. [パフォーマンス分析](./monitoring/performance-monitoring.md)
4. [データベース保守](./database/maintenance.md)

---

*バックエンド固有の内容は、このセクションで管理しています。*
*横断的な内容は [共通ドキュメント](../shared/) をご参照ください。*
