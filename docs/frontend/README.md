# フロントエンド ドキュメント

React + TypeScript で構築されたマプタビクライアントアプリケーションの開発・運用に関するドキュメントです。

## 📚 ドキュメント一覧

### 🏗 [アーキテクチャ](./architecture/)
- [概要](./architecture/overview.md) - システム全体の設計思想
- [ディレクトリ構成](./architecture/directory-structure.md) - ファイル構成・関心事分離
- [設計パターン](./architecture/design-patterns.md) - 採用している設計パターン
- [状態管理](./architecture/state-management.md) - Context API・カスタムフック
- [ルーティング](./architecture/routing.md) - React Router 設計

### 🧩 [コンポーネント](./components/)
- [デザインシステム](./components/design-system.md) - 統一されたデザイン原則
- [UI コンポーネント](./components/ui-components.md) - 基盤コンポーネント設計
- [フォーム](./components/forms.md) - フォーム設計・バリデーション
- [ナビゲーション](./components/navigation.md) - ヘッダー・メニュー設計
- [レイアウト](./components/layout.md) - ページレイアウト設計
- [再利用性](./components/reusability.md) - コンポーネント再利用戦略

### 💻 [開発](./development/)
- [環境セットアップ](./development/environment-setup.md) - 開発環境構築手順
- [コーディング規約](./development/coding-standards.md) - TypeScript・React 規約
- [ワークフロー](./development/workflow.md) - 開発プロセス・Git 運用
- [デバッグ](./development/debugging.md) - デバッグ手法・ツール
- [ツール](./development/tools.md) - 開発支援ツール・設定

### ⚡ [機能](./features/)
- [日記管理](./features/diary-management.md) - 日記 CRUD 実装
- [地図可視化](./features/map-visualization.md) - MapLibre GL 統合
- [ユーザー認証](./features/user-authentication.md) - ログイン・認証実装
- [位置情報サービス](./features/location-services.md) - 位置情報取得・管理
- [公開・共有](./features/public-sharing.md) - 日記公開・共有機能

### 🚀 [デプロイ](./deployment/)
- [ビルドプロセス](./deployment/build-process.md) - Vite ビルド・最適化
- [CI/CD](./deployment/ci-cd.md) - GitHub Actions・自動デプロイ
- [環境管理](./deployment/environments.md) - dev・staging・prod 環境
- [最適化](./deployment/optimization.md) - パフォーマンス最適化
- [監視](./deployment/monitoring.md) - フロントエンド監視

### 🧪 [テスト](./testing/)
- [戦略](./testing/strategy.md) - テスト全体戦略・方針
- [単体テスト](./testing/unit-testing.md) - Jest・React Testing Library
- [結合テスト](./testing/integration-testing.md) - コンポーネント結合テスト
- [E2E テスト](./testing/e2e-testing.md) - Cypress 自動テスト
- [テスト自動化](./testing/test-automation.md) - CI での自動実行

### ⚡ [パフォーマンス](./performance/)
- [最適化](./performance/optimization.md) - React・Vite 最適化手法
- [監視](./performance/monitoring.md) - パフォーマンス計測・分析
- [ベストプラクティス](./performance/best-practices.md) - 実装時の注意点
- [プロファイリング](./performance/profiling.md) - パフォーマンス調査手法
- [メトリクス](./performance/metrics.md) - Core Web Vitals・指標

### 🔧 [トラブルシューティング](./troubleshooting/)
- [よくある問題](./troubleshooting/common-issues.md) - 頻出問題と解決方法
- [デバッグガイド](./troubleshooting/debugging-guide.md) - 効率的なデバッグ方法
- [エラーハンドリング](./troubleshooting/error-handling.md) - エラー対応・回復処理
- [FAQ](./troubleshooting/faq.md) - よくある質問と回答

## 🎯 対象読者別ガイド

### 新規参加開発者
1. [環境セットアップ](./development/environment-setup.md)
2. [アーキテクチャ概要](./architecture/overview.md)
3. [コーディング規約](./development/coding-standards.md)
4. [開発ワークフロー](./development/workflow.md)

### 既存開発者
1. [機能実装ガイド](./features/)
2. [コンポーネント設計](./components/)
3. [テスト実装](./testing/)
4. [パフォーマンス最適化](./performance/)

### レビュアー・シニア開発者
1. [設計パターン](./architecture/design-patterns.md)
2. [ベストプラクティス](./performance/best-practices.md)
3. [テスト戦略](./testing/strategy.md)
4. [トラブルシューティング](./troubleshooting/)

---

*フロントエンド固有の内容は、このセクションで管理しています。*
*横断的な内容は [共通ドキュメント](../shared/) をご参照ください。*
