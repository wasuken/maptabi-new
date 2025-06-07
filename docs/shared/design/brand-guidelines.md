# ブランドガイドライン

## 概要
マプタビのブランドアイデンティティとビジュアル表現ガイドです。

## ブランドコンセプト

### ブランドビジョン
思い出を地図に刻み、人生の軌跡を美しく記録する

### ブランドミッション
位置情報と日記を融合させ、より豊かな記録体験を提供する

### ブランド価値
- **発見**: 新しい場所との出会い
- **記録**: 大切な瞬間の保存
- **共有**: 体験の分かち合い
- **成長**: 振り返りからの学び

## ロゴデザイン

### プライマリロゴ
```
マプタビ
```

### ロゴ使用ルール
- 最小サイズ: 16px（ウェブ）, 10mm（印刷）
- 余白: ロゴ高さの50%以上確保
- 改変禁止: 比率・色・フォント変更不可

### ロゴカラーバリエーション
```css
/* プライマリ */
.logo-primary { color: #3b82f6; }

/* ホワイト */
.logo-white { color: #ffffff; }

/* ダーク */
.logo-dark { color: #1e293b; }

/* モノクロ */
.logo-mono { color: #6b7280; }
```

## カラーパレット

### ブランドカラー
```css
/* メインブルー */
--brand-primary: #3b82f6;
--brand-primary-light: #60a5fa;
--brand-primary-dark: #2563eb;

/* アクセントカラー */
--brand-accent: #10b981;    /* 成功・自然 */
--brand-secondary: #f59e0b; /* 注意・暖かさ */
```

### カラー意味
- **ブルー**: 信頼性・安定性・空の広がり
- **グリーン**: 成長・自然・新鮮さ
- **オレンジ**: 活力・創造性・親しみやすさ

### 使用ガイドライン
```css
/* 主要アクション */
.primary-action {
  background: var(--brand-primary);
  color: white;
}

/* 成功状態 */
.success-state {
  color: var(--brand-accent);
}

/* 注意・警告 */
.warning-state {
  color: var(--brand-secondary);
}
```

## タイポグラフィ

### ブランドフォント
```css
/* メインフォント */
--font-primary: 'Inter', 'Noto Sans JP', sans-serif;

/* 見出しフォント */
--font-heading: 'Inter', 'Noto Sans JP', sans-serif;

/* 等幅フォント */
--font-mono: 'JetBrains Mono', 'Source Code Pro', monospace;
```

### フォント階層
```css
/* ブランドタイトル */
.brand-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* 見出し */
.heading-large {
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.2;
}

/* 本文 */
.body-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
}

/* キャプション */
.caption {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-600);
}
```

## アイコンシステム

### アイコンスタイル
- **スタイル**: アウトライン（ストローク）
- **太さ**: 1.5px～2px
- **角の丸み**: 2px
- **サイズ**: 16px, 20px, 24px

### 主要アイコン
```jsx
// 地図・位置
<MapPin className="h-5 w-5" />
<Map className="h-5 w-5" />
<Navigation className="h-5 w-5" />

// 日記・記録
<BookOpen className="h-5 w-5" />
<Edit className="h-5 w-5" />
<FileText className="h-5 w-5" />

// ユーザー・アカウント
<User className="h-5 w-5" />
<Settings className="h-5 w-5" />
<Heart className="h-5 w-5" />

// アクション
<Plus className="h-5 w-5" />
<Search className="h-5 w-5" />
<Share className="h-5 w-5" />
```

### カスタムアイコン
```jsx
// マプタビロゴアイコン
const MapTabiIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path 
      d="M12 2L2 7v10c0 5.55 3.84 7.74 9 9 5.16-1.26 9-3.45 9-9V7l-10-5z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={1.5}
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" strokeWidth={1.5} />
  </svg>
);
```

## 画像・写真ガイドライン

### 写真スタイル
- **明度**: 明るく、自然な光
- **彩度**: やや高めの鮮やかさ
- **構図**: 開放感のある広角
- **被写体**: 風景・建物・人物との自然な関わり

### 色調整
```css
/* 写真フィルター */
.brand-photo-filter {
  filter: 
    brightness(1.05)
    contrast(1.1)
    saturate(1.15);
}
```

### 画像比率
- **ヒーロー画像**: 16:9
- **カード画像**: 4:3
- **プロフィール画像**: 1:1
- **サムネイル**: 3:2

## 音声・サウンド

### ブランドサウンド
- **成功音**: 明るく軽やかなチャイム
- **エラー音**: 控えめで優しい警告音
- **通知音**: 自然で心地よいトーン

### 音声ガイドライン
```javascript
// 成功時
const successSound = new Audio('/sounds/success-chime.mp3');
successSound.volume = 0.3;

// エラー時
const errorSound = new Audio('/sounds/gentle-error.mp3');
errorSound.volume = 0.2;
```

## アニメーション・モーション

### モーションプリンシプル
- **自然さ**: 現実の物理法則に従う動き
- **目的性**: 機能を支援する動き
- **一貫性**: 統一されたタイミング

### イージング
```css
/* ブランドイージング */
:root {
  --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --easing-sharp: cubic-bezier(0.4, 0, 0.6, 1);
}

/* 基本トランジション */
.transition-brand {
  transition: all 0.2s var(--easing-smooth);
}

/* ホバーエフェクト */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.15);
}
```

## 禁止事項

### ロゴ使用禁止
- ロゴの変形・回転
- 承認されていない色での使用
- 可読性を損なう背景での使用
- 他のグラフィック要素との結合

### カラー使用禁止
- ブランドカラーの無断変更
- 低コントラスト組み合わせ
- 競合サービスを連想させる色使用

### フォント使用禁止
- 指定外フォントの使用
- 過度な装飾・エフェクト
- 可読性を損なう文字間隔

## ブランド表現例

### Webサイト
```jsx
// ヒーローセクション
<section className="bg-gradient-to-b from-blue-50 to-white">
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">
      思い出を地図に刻もう
    </h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      マプタビは、あなたの旅と日常を美しく記録する
      新しい日記アプリです
    </p>
    <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg">
      今すぐ始める
    </button>
  </div>
</section>
```

### SNS投稿
```
🗺️ 新しい場所、新しい思い出

マプタビで記録した今日の一歩。
何気ない日常も、地図で振り返ると
特別な物語になります。

#マプタビ #日記 #思い出 #地図
```

## 他ブランドとの関係

### パートナーブランド
- OpenStreetMap: データ提供パートナー
- MapLibre: 技術パートナー

### クレジット表記
```
Powered by OpenStreetMap contributors
Built with MapLibre GL JS
```
