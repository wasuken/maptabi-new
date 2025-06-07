# Issue 管理

## 概要
GitHub Issues を使用した課題管理・プロジェクト進行方針です。

## Issue テンプレート

### バグ報告
```markdown
## 🐛 バグ内容
簡潔な説明

## 📋 再現手順
1. XXページにアクセス
2. XXボタンをクリック
3. エラーが発生

## 💭 期待する動作
正常に動作すること

## 📱 環境
- OS: Windows/Mac/Linux
- ブラウザ: Chrome v100
- 画面サイズ: 1920x1080

## 📎 追加情報
スクリーンショット・ログ等
```

### 機能要求
```markdown
## 🚀 機能概要
新機能の簡潔な説明

## 📖 詳細
- 背景・目的
- ユーザーストーリー
- 受け入れ条件

## 💡 実装案
技術的なアプローチ案

## 📋 タスク
- [ ] 設計
- [ ] 実装
- [ ] テスト
- [ ] ドキュメント更新
```

## ラベル体系

### 種別
- `bug`: バグ報告
- `enhancement`: 機能改善
- `feature`: 新機能
- `documentation`: ドキュメント
- `question`: 質問・相談

### 優先度
- `priority: high`: 緊急対応
- `priority: medium`: 通常対応
- `priority: low`: 低優先度

### 担当領域
- `frontend`: フロントエンド
- `backend`: バックエンド
- `database`: データベース
- `infrastructure`: インフラ
- `design`: デザイン

### ステータス
- `status: blocked`: ブロック中
- `status: in-progress`: 対応中
- `status: review`: レビュー待ち
- `good first issue`: 初心者向け

## Issue ライフサイクル

### 1. 作成
- 適切なテンプレート使用
- 必要ラベル付与
- アサイン（可能であれば）

### 2. トリアージ
- 週次レビュー
- 優先度設定
- マイルストーン割り当て

### 3. 対応
- ブランチ作成
- 進捗更新
- PR リンク

### 4. 完了
- PR マージ後クローズ
- 振り返りコメント

## プロジェクトボード

### カラム構成
1. **Backlog**: 未対応
2. **Todo**: 対応予定
3. **In Progress**: 対応中
4. **Review**: レビュー中
5. **Done**: 完了

### カード移動ルール
- 作業開始時: Todo → In Progress
- PR作成時: In Progress → Review
- マージ時: Review → Done

## マイルストーン管理

### 設定方針
- スプリント単位（2週間）
- リリース単位（月次）
- 四半期目標

### 例
- `Sprint 2025-06-A`: 6月前半スプリント
- `Release v1.2.0`: バージョンリリース
- `Q2 2025`: 第2四半期目標

## 自動化

### GitHub Actions連携
```yaml
# .github/workflows/issue-automation.yml
name: Issue Automation
on:
  issues:
    types: [opened, closed]
jobs:
  auto-assign:
    runs-on: ubuntu-latest
    steps:
      - name: Auto assign
        if: github.event.action == 'opened'
        run: |
          # 自動アサインロジック
```

### ラベル自動付与
- タイトルキーワードでラベル推定
- PR作成時にIssueラベル同期
