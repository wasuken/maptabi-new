# アクセシビリティ

## 概要
WCAG 2.1 AA準拠を目指したアクセシビリティ実装ガイドです。

## 基本原則

### 1. 知覚可能 (Perceivable)
- 十分なカラーコントラスト
- 代替テキスト提供
- 拡大・縮小対応

### 2. 操作可能 (Operable)
- キーボードナビゲーション
- 十分な操作時間
- 発作誘発コンテンツ回避

### 3. 理解可能 (Understandable)
- 明確な言語
- 予測可能な動作
- エラー修正支援

### 4. 堅牢 (Robust)
- スクリーンリーダー対応
- 多様な支援技術対応

## セマンティックHTML

### 適切な要素使用
```html
<!-- 見出し階層 -->
<h1>メインタイトル</h1>
<h2>セクションタイトル</h2>
<h3>サブセクション</h3>

<!-- ナビゲーション -->
<nav aria-label="メインナビゲーション">
  <ul>
    <li><a href="/">ホーム</a></li>
    <li><a href="/map">地図</a></li>
  </ul>
</nav>

<!-- メインコンテンツ -->
<main>
  <article>
    <header>
      <h1>日記タイトル</h1>
      <time datetime="2025-06-07">2025年6月7日</time>
    </header>
    <p>日記の内容...</p>
  </article>
</main>
```

### ランドマーク要素
```html
<header><!-- サイトヘッダー --></header>
<nav><!-- ナビゲーション --></nav>
<main><!-- メインコンテンツ --></main>
<aside><!-- サイドバー --></aside>
<footer><!-- フッター --></footer>
```

## ARIA属性

### よく使用するARIA
```jsx
// ボタン
<button 
  aria-label="日記を削除"
  aria-describedby="delete-help"
>
  <Trash2 className="h-4 w-4" />
</button>
<div id="delete-help">この操作は取り消せません</div>

// フォーム
<input 
  type="text"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="title-error"
/>
{hasError && (
  <div id="title-error" role="alert">
    タイトルは必須です
  </div>
)}

// ダイアログ
<div 
  role="dialog" 
  aria-labelledby="dialog-title"
  aria-describedby="dialog-content"
>
  <h2 id="dialog-title">確認</h2>
  <div id="dialog-content">削除しますか？</div>
</div>
```

### 動的コンテンツ
```jsx
// ライブリージョン
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// 更新通知
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>

// 展開可能コンテンツ
<button 
  aria-expanded={isOpen}
  aria-controls="menu-content"
>
  メニュー
</button>
<div id="menu-content" hidden={!isOpen}>
  <!-- コンテンツ -->
</div>
```

## キーボードナビゲーション

### フォーカス管理
```css
/* フォーカス表示 */
.focusable:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* フォーカストラップ */
.modal {
  focus-trap: auto;
}
```

### キーボードショートカット
```jsx
// エスケープキー
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, []);

// Tabナビゲーション
<div 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  カスタム要素
</div>
```

## カラーアクセシビリティ

### コントラスト比
```css
/* AA準拠（4.5:1以上） */
.text-normal {
  color: #374151; /* gray-700 */
  background: #ffffff;
}

/* AAA準拠（7:1以上） */
.text-high-contrast {
  color: #111827; /* gray-900 */
  background: #ffffff;
}

/* 大きなテキスト（AA: 3:1以上） */
.text-large {
  font-size: 18px;
  color: #4b5563; /* gray-600 */
}
```

### 色以外の情報提供
```jsx
// 成功状態
<div className="success">
  <CheckCircle className="h-4 w-4" />
  <span>保存成功</span>
</div>

// エラー状態
<div className="error">
  <AlertCircle className="h-4 w-4" />
  <span>エラーが発生しました</span>
</div>

// 必須フィールド
<label>
  タイトル <span aria-label="必須">*</span>
</label>
```

## 画像・メディア

### 代替テキスト
```jsx
// 情報的画像
<img 
  src="chart.png" 
  alt="2025年6月の日記投稿数: 15件"
/>

// 装飾的画像
<img 
  src="decoration.png" 
  alt=""
  role="presentation"
/>

// 複雑な画像
<img 
  src="map.png" 
  alt="東京駅周辺の日記投稿マップ"
  aria-describedby="map-description"
/>
<div id="map-description">
  東京駅を中心に半径2km以内に10件の日記が投稿されています
</div>
```

### 動画・音声
```jsx
// 字幕付き動画
<video controls>
  <source src="tutorial.mp4" type="video/mp4" />
  <track 
    kind="subtitles" 
    src="subtitles.vtt" 
    srclang="ja" 
    label="日本語"
  />
</video>

// 自動再生制御
<video 
  controls
  preload="metadata"
  muted // 自動再生時は必須
>
  <source src="intro.mp4" />
</video>
```

## フォームアクセシビリティ

### ラベル関連付け
```jsx
// explicit label
<label htmlFor="title">タイトル</label>
<input id="title" type="text" />

// implicit label
<label>
  タイトル
  <input type="text" />
</label>

// aria-labelledby
<div id="title-label">タイトル</div>
<input aria-labelledby="title-label" />
```

### エラーハンドリング
```jsx
<form noValidate>
  <div className={`field ${errors.title ? 'error' : ''}`}>
    <label htmlFor="title">タイトル</label>
    <input 
      id="title"
      type="text"
      aria-required="true"
      aria-invalid={!!errors.title}
      aria-describedby={errors.title ? 'title-error' : undefined}
    />
    {errors.title && (
      <div id="title-error" role="alert">
        {errors.title}
      </div>
    )}
  </div>
</form>
```

## テスト・検証

### 自動テスト
```bash
# axe-core
npm install @axe-core/react
npm run test:a11y

# lighthouse
lighthouse http://localhost:3333 --only-categories=accessibility
```

### 手動テスト
- キーボードのみでの操作確認
- スクリーンリーダーでの確認
- ブラウザズーム（200%）での確認
- ハイコントラストモードでの確認

### チェックリスト
- [ ] キーボードでの操作可能
- [ ] 適切なフォーカス表示
- [ ] 十分なカラーコントラスト
- [ ] 代替テキスト提供
- [ ] スクリーンリーダー対応
- [ ] エラーメッセージ明確
- [ ] ページタイトル適切
- [ ] 見出し階層正しい
