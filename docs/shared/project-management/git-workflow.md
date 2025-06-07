# Git ワークフロー

## 概要
マプタビプロジェクトのGit運用方針とブランチ戦略です。

## ブランチ戦略

### メインブランチ
- **main**: 本番環境デプロイ用
- **develop**: 開発統合ブランチ

### 作業ブランチ
- **feature/[機能名]**: 新機能開発
- **bugfix/[修正内容]**: バグ修正
- **hotfix/[緊急修正]**: 本番緊急対応
- **docs/[ドキュメント]**: ドキュメント更新

## 基本ワークフロー

### 1. 新機能開発
```bash
# develop から feature ブランチ作成
git checkout develop
git pull origin develop
git checkout -b feature/diary-search

# 開発・コミット
git add .
git commit -m "feat: 日記検索機能を追加"

# プッシュ・PR作成
git push origin feature/diary-search
```

### 2. プルリクエスト
- ベースブランチ: develop
- レビュアー: 最低1名指定
- CI/CDパス必須
- コンフリクト解決必須

### 3. マージ後
```bash
# ローカルブランチ削除
git checkout develop
git pull origin develop
git branch -d feature/diary-search
```

## コミットメッセージ規約

### 形式
```
type(scope): subject

body

footer
```

### タイプ
- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメント
- **style**: コードスタイル
- **refactor**: リファクタリング
- **test**: テスト追加・修正
- **chore**: ビルド・設定変更

### 例
```bash
feat(auth): JWT認証機能を追加

ユーザーログイン・ログアウト機能を実装
- JWT トークン生成・検証
- パスワードハッシュ化
- セッション管理

Closes #123
```

## PR テンプレート

```markdown
## 変更内容
- 機能Aを追加
- バグBを修正

## テスト
- [ ] 単体テスト追加
- [ ] E2Eテスト確認
- [ ] 手動テスト実行

## チェックリスト
- [ ] ESLint エラーなし
- [ ] ビルド成功
- [ ] 関連ドキュメント更新
```

## リリースフロー

### 1. リリース準備
```bash
git checkout develop
git checkout -b release/v1.2.0
# バージョン更新・最終調整
```

### 2. 本番デプロイ
```bash
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags
```

### 3. 開発ブランチ同期
```bash
git checkout develop
git merge release/v1.2.0
```

## 緊急修正フロー

```bash
# main から hotfix ブランチ
git checkout main
git checkout -b hotfix/security-fix

# 修正・テスト
git commit -m "fix: セキュリティ脆弱性修正"

# main と develop にマージ
git checkout main
git merge hotfix/security-fix
git checkout develop
git merge hotfix/security-fix
```

## 禁止事項
- main への直接プッシュ
- force push (main/develop)
- マージコミット以外のdevelop直接コミット
- 未レビューコードのマージ
