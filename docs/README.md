# マプタビ ドキュメント

マプタビ（MapTabi）は、旅の思い出や日常の出来事を地図と一緒に記録できるオンライン日記サービスです。このドキュメントでは、開発・運用・利用に関する全ての情報を提供します。

## 🎯 ドキュメント構成

### 📱 [フロントエンド](./frontend/)
React + TypeScript で構築されたクライアントアプリケーションに関するドキュメント

- **[アーキテクチャ](./frontend/architecture/)** - 設計思想・構造・パターン
- **[コンポーネント](./frontend/components/)** - UI コンポーネント設計・実装
- **[開発](./frontend/development/)** - 開発環境・ワークフロー・標準
- **[機能](./frontend/features/)** - 機能別実装ガイド
- **[デプロイ](./frontend/deployment/)** - ビルド・CI/CD・環境管理
- **[テスト](./frontend/testing/)** - テスト戦略・実装・自動化
- **[パフォーマンス](./frontend/performance/)** - 最適化・監視・ベストプラクティス
- **[トラブルシューティング](./frontend/troubleshooting/)** - 問題解決・FAQ

### 🔧 [バックエンド](./backend/)
Node.js + Express で構築されたサーバーサイドアプリケーションに関するドキュメント

- **[アーキテクチャ](./backend/architecture/)** - システム設計・データフロー・スケーラビリティ
- **[API](./backend/api/)** - REST API 設計・仕様・ドキュメント
- **[データベース](./backend/database/)** - スキーマ設計・運用・保守
- **[認証](./backend/authentication/)** - 認証・認可・セキュリティ
- **[サービス](./backend/services/)** - ビジネスロジック・外部連携
- **[デプロイ](./backend/deployment/)** - インフラ・デプロイ・運用
- **[テスト](./backend/testing/)** - テスト戦略・API テスト・負荷テスト
- **[監視](./backend/monitoring/)** - ログ・メトリクス・アラート
- **[トラブルシューティング](./backend/troubleshooting/)** - 問題解決・デバッグ・FAQ

### 🤝 [共通](./shared/)
フロントエンド・バックエンド横断的な関心事に関するドキュメント

- **[セットアップ](./shared/setup/)** - 初期環境構築・インストール
- **[プロジェクト管理](./shared/project-management/)** - Git ワークフロー・チーム運用
- **[デザイン](./shared/design/)** - デザインシステム・UI/UX ガイドライン
- **[コンプライアンス](./shared/compliance/)** - 法的要件・プライバシー・規約
- **[セキュリティ](./shared/security/)** - セキュリティポリシー・脆弱性対応
- **[連携](./shared/integration/)** - 外部 API・システム間連携
- **[移行](./shared/migration/)** - アップグレード・データ移行
- **[参考資料](./shared/references/)** - 用語集・学習リソース・ツール

## 🚀 クイックスタート

### 開発者向け
1. **[環境構築](./shared/setup/installation.md)** - 開発環境のセットアップ
2. **[フロントエンド開始](./frontend/development/environment-setup.md)** - フロントエンド開発環境
3. **[バックエンド開始](./backend/deployment/docker.md)** - バックエンド開発環境

### 運用者向け
1. **[デプロイ手順](./backend/deployment/infrastructure.md)** - 本番環境構築
2. **[監視設定](./backend/monitoring/logging.md)** - 監視・アラート設定
3. **[セキュリティ設定](./shared/security/security-policy.md)** - セキュリティ対策

## 📋 よく参照されるドキュメント

### 開発関連
- [Git ワークフロー](./shared/project-management/git-workflow.md)
- [コーディング規約](./frontend/development/coding-standards.md)
- [API 仕様](./backend/api/endpoints.md)
- [データベーススキーマ](./backend/database/schema-design.md)

### 運用関連
- [デプロイガイド](./backend/deployment/ci-cd.md)
- [トラブルシューティング](./frontend/troubleshooting/common-issues.md)
- [パフォーマンス監視](./backend/monitoring/performance-monitoring.md)
- [セキュリティ対応](./shared/security/incident-response.md)

## 🔍 ドキュメント検索・ナビゲーション

### 技術別
- **React/TypeScript**: [フロントエンド](./frontend/) セクション
- **Node.js/Express**: [バックエンド](./backend/) セクション
- **PostgreSQL**: [データベース](./backend/database/) セクション
- **MapLibre GL**: [地図機能](./frontend/features/map-visualization.md)

### 作業別
- **新機能開発**: [開発ワークフロー](./frontend/development/workflow.md)
- **バグ修正**: [トラブルシューティング](./frontend/troubleshooting/)
- **パフォーマンス改善**: [最適化ガイド](./frontend/performance/)
- **セキュリティ対応**: [セキュリティ](./shared/security/)

## 📝 ドキュメント貢献

ドキュメントの改善にご協力ください：

1. **誤字・脱字の修正**
2. **情報の追加・更新**
3. **新しいガイドの作成**
4. **構造の改善提案**

詳細は [貢献ガイド](./shared/project-management/team-guidelines.md) をご覧ください。

## 📞 サポート

- **技術的質問**: GitHub Issues
- **ドキュメント改善**: Pull Request
- **一般的な質問**: GitHub Discussions

---

*最終更新: 2025年6月7日*
