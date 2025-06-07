# デザインシステム

## 概要
マプタビの統一されたデザイン原則とコンポーネントライブラリです。

## デザイン原則

### 1. シンプルさ
- 直感的なインターフェース
- 最小限の認知負荷
- 明確な情報階層

### 2. 一貫性
- 統一されたパターン
- 予測可能な動作
- 一貫したビジュアル言語

### 3. アクセシビリティ
- WCAG 2.1 AA準拠
- キーボードナビゲーション
- スクリーンリーダー対応

## カラーパレット

### プライマリカラー
```css
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-500: #3b82f6    /* メインブランドカラー */
--primary-600: #2563eb
--primary-900: #1e3a8a
```

### セカンダリカラー
```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-500: #6b7280      /* テキスト */
--gray-900: #111827      /* 見出し */
```

### ステータスカラー
```css
--success: #10b981       /* 成功 */
--warning: #f59e0b       /* 警告 */
--error: #ef4444         /* エラー */
--info: #3b82f6          /* 情報 */
```

## タイポグラフィ

### フォントファミリー
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### フォントサイズ
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
```

### 見出しスタイル
- **H1**: text-3xl, font-bold, text-gray-900
- **H2**: text-2xl, font-semibold, text-gray-900
- **H3**: text-xl, font-medium, text-gray-900
- **H4**: text-lg, font-medium, text-gray-800

## スペーシング

### マージン・パディング
```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-12: 3rem      /* 48px */
```

## コンポーネント

### ボタン
```jsx
// Primary Button
<Button variant="primary" size="md">
  保存する
</Button>

// Secondary Button  
<Button variant="secondary" size="md">
  キャンセル
</Button>

// Danger Button
<Button variant="danger" size="md">
  削除する
</Button>
```

### 入力フィールド
```jsx
// Text Input
<Input 
  type="text" 
  placeholder="タイトルを入力"
  error="タイトルは必須です"
/>

// Textarea
<Textarea 
  placeholder="内容を入力してください"
  rows={4}
/>
```

### カード
```jsx
<Card>
  <CardHeader>
    <CardTitle>日記タイトル</CardTitle>
  </CardHeader>
  <CardContent>
    日記の内容...
  </CardContent>
</Card>
```

## アイコン

### アイコンライブラリ
- **Lucide React**: メインアイコンセット
- **サイズ**: 16px, 20px, 24px
- **ストローク**: 1.5px～2px

### よく使用するアイコン
- MapPin: 位置情報
- BookOpen: 日記
- User: ユーザー
- Settings: 設定
- Search: 検索

## レイアウト

### グリッドシステム
```css
/* コンテナ */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* レスポンシブグリッド */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### ブレークポイント
```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
```

## 状態・インタラクション

### ホバー
```css
/* ボタンホバー */
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

### フォーカス
```css
/* フォーカス状態 */
.interactive:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### ローディング
```css
/* スピナー */
.spinner {
  animation: spin 1s linear infinite;
}
```

## ダークモード

### カラー変数
```css
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #1f2937;
    --gray-900: #f9fafb;
    --background: #111827;
    --surface: #1f2937;
  }
}
```
