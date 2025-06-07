# レスポンシブデザイン

## 概要
マルチデバイス対応のレスポンシブデザイン実装ガイドです。

## ブレークポイント戦略

### 定義
```css
:root {
  --breakpoint-xs: 475px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### デバイス対応
- **XS (～475px)**: 小型スマートフォン
- **SM (475px～640px)**: スマートフォン
- **MD (640px～768px)**: 大型スマートフォン・小型タブレット
- **LG (768px～1024px)**: タブレット
- **XL (1024px～)**: デスクトップ

## モバイルファースト設計

### CSS記述方針
```css
/* ベース: モバイル */
.container {
  padding: 1rem;
  max-width: 100%;
}

/* タブレット以上 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* デスクトップ以上 */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 3rem;
  }
}
```

### Tailwind CSS対応
```jsx
<div className="
  px-4 py-2          // モバイル
  md:px-6 md:py-4    // タブレット
  lg:px-8 lg:py-6    // デスクトップ
">
  コンテンツ
</div>
```

## レイアウトパターン

### グリッドレイアウト
```css
/* 自動調整グリッド */
.responsive-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* ブレークポイント別グリッド */
.custom-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* モバイル: 1列 */
}

@media (min-width: 768px) {
  .custom-grid {
    grid-template-columns: 1fr 1fr; /* タブレット: 2列 */
  }
}

@media (min-width: 1024px) {
  .custom-grid {
    grid-template-columns: 1fr 1fr 1fr; /* デスクトップ: 3列 */
  }
}
```

### フレックスボックス
```css
.responsive-flex {
  display: flex;
  flex-direction: column; /* モバイル: 縦並び */
  gap: 1rem;
}

@media (min-width: 768px) {
  .responsive-flex {
    flex-direction: row; /* タブレット以上: 横並び */
  }
}
```

## コンポーネント対応

### ナビゲーション
```jsx
// モバイル: ハンバーガーメニュー
// デスクトップ: 横並びメニュー
<nav className="relative">
  {/* デスクトップナビ */}
  <div className="hidden lg:flex space-x-6">
    <NavLink href="/">ホーム</NavLink>
    <NavLink href="/map">地図</NavLink>
    <NavLink href="/diary/new">新規作成</NavLink>
  </div>
  
  {/* モバイルメニューボタン */}
  <button className="lg:hidden" onClick={toggleMenu}>
    <Menu className="h-6 w-6" />
  </button>
  
  {/* モバイルメニュー */}
  <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
    <NavLink href="/">ホーム</NavLink>
    <NavLink href="/map">地図</NavLink>
    <NavLink href="/diary/new">新規作成</NavLink>
  </div>
</nav>
```

### カードレイアウト
```jsx
<div className="
  grid 
  grid-cols-1      // モバイル: 1列
  md:grid-cols-2   // タブレット: 2列  
  lg:grid-cols-3   // デスクトップ: 3列
  gap-4
">
  {diaries.map(diary => (
    <DiaryCard key={diary.id} diary={diary} />
  ))}
</div>
```

### フォーム
```jsx
<form className="space-y-4">
  <div className="
    grid 
    grid-cols-1 
    md:grid-cols-2 
    gap-4
  ">
    <FormField>
      <Label>タイトル</Label>
      <Input className="w-full" />
    </FormField>
    
    <FormField>
      <Label>カテゴリ</Label>
      <Select className="w-full" />
    </FormField>
  </div>
  
  <FormField>
    <Label>内容</Label>
    <Textarea className="w-full h-32 md:h-48" />
  </FormField>
</form>
```

## 画像・メディア対応

### レスポンシブ画像
```jsx
// srcset対応
<img 
  src="image-800.jpg"
  srcSet="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="説明"
/>

// picture要素
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="mobile.jpg"
  />
  <source 
    media="(max-width: 1024px)" 
    srcSet="tablet.jpg"
  />
  <img src="desktop.jpg" alt="説明" />
</picture>
```

### 動画対応
```jsx
<video 
  className="w-full h-auto max-w-2xl mx-auto"
  controls
  poster="thumbnail.jpg"
>
  <source src="video.mp4" type="video/mp4" />
</video>
```

## 地図コンポーネント対応

### サイズ調整
```jsx
const MapView = () => {
  const [mapHeight, setMapHeight] = useState('400px');
  
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 768) {
        setMapHeight('300px'); // モバイル
      } else if (window.innerWidth < 1024) {
        setMapHeight('400px'); // タブレット
      } else {
        setMapHeight('500px'); // デスクトップ
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  return (
    <div 
      style={{ height: mapHeight }}
      className="w-full rounded-lg overflow-hidden"
    >
      {/* 地図コンポーネント */}
    </div>
  );
};
```

### コントロール配置
```jsx
<div className="relative">
  {/* 地図 */}
  <MapLibreMap />
  
  {/* コントロール */}
  <div className="
    absolute 
    top-4 right-4      // デスクトップ: 右上
    md:top-4 md:left-4 // モバイル: 左上
  ">
    <MapControls />
  </div>
</div>
```

## パフォーマンス考慮

### 条件付きレンダリング
```jsx
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// 使用例
const Component = () => {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};
```

### 遅延読み込み
```jsx
// 大きなコンポーネントの遅延読み込み
const LazyMapView = lazy(() => import('./MapView'));

const Page = () => {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {/* モバイルでは地図を遅延読み込み */}
      {isMobile ? (
        <Suspense fallback={<MapSkeleton />}>
          <LazyMapView />
        </Suspense>
      ) : (
        <MapView />
      )}
    </div>
  );
};
```

## テスト戦略

### ブレークポイントテスト
```bash
# デバイス別テスト
npm run cy:run -- --spec "cypress/e2e/responsive.cy.ts"

# ビューポートサイズ指定
cypress run --config viewportWidth=375,viewportHeight=667  # iPhone SE
cypress run --config viewportWidth=768,viewportHeight=1024 # iPad
cypress run --config viewportWidth=1920,viewportHeight=1080 # Desktop
```

### 手動テスト
- Chrome DevTools でデバイス切り替え
- 実機での確認（iOS・Android）
- 横向き・縦向き切り替え確認
- ブラウザズーム（50%～200%）確認
