# UI ガイドライン

## 概要
マプタビのユーザーインターフェース設計指針と実装ガイドです。

## レイアウト原則

### 情報階層
1. **プライマリ情報**: ページの主要コンテンツ
2. **セカンダリ情報**: 補助的な情報・ナビゲーション
3. **ターシャリ情報**: フッター・メタ情報

### 視覚的重み
- **太字**: 重要な見出し・ラベル
- **カラー**: ブランドカラーは重要な要素のみ
- **サイズ**: 重要度に応じたフォントサイズ

## インタラクション設計

### ボタン設計
```jsx
// 主要アクション - Primary
<Button variant="primary">日記を保存</Button>

// 副次アクション - Secondary  
<Button variant="secondary">下書き保存</Button>

// 危険なアクション - Danger
<Button variant="danger">削除</Button>

// テキストアクション - Ghost
<Button variant="ghost">キャンセル</Button>
```

### フォーム設計
```jsx
<Form>
  <FormField>
    <Label required>タイトル</Label>
    <Input placeholder="タイトルを入力してください" />
    <FieldError>タイトルは必須項目です</FieldError>
  </FormField>
  
  <FormField>
    <Label>内容</Label>
    <Textarea placeholder="日記の内容を入力..." />
    <FieldHint>最大1000文字まで入力できます</FieldHint>
  </FormField>
</Form>
```

### ナビゲーション
```jsx
// メインナビゲーション
<Navigation>
  <NavItem href="/" active>ホーム</NavItem>
  <NavItem href="/map">地図</NavItem>
  <NavItem href="/diary/new">新規作成</NavItem>
</Navigation>

// パンくずナビ
<Breadcrumb>
  <BreadcrumbItem href="/">ホーム</BreadcrumbItem>
  <BreadcrumbItem href="/diary">日記</BreadcrumbItem>
  <BreadcrumbItem active>日記作成</BreadcrumbItem>
</Breadcrumb>
```

## フィードバック・状態表示

### 成功・エラー表示
```jsx
// 成功メッセージ
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  日記が正常に保存されました
</Alert>

// エラーメッセージ
<Alert variant="error">
  <AlertCircle className="h-4 w-4" />
  保存に失敗しました。再度お試しください
</Alert>

// 警告メッセージ
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  未保存の変更があります
</Alert>
```

### ローディング状態
```jsx
// ボタンローディング
<Button loading>保存中...</Button>

// ページローディング
<div className="flex justify-center py-8">
  <Spinner size="lg" />
  <span>読み込み中...</span>
</div>

// スケルトンローディング
<SkeletonCard />
```

## データ表示

### リスト表示
```jsx
<List>
  <ListItem>
    <ListItemIcon><BookOpen /></ListItemIcon>
    <ListItemContent>
      <ListItemTitle>日記タイトル</ListItemTitle>
      <ListItemSubtitle>2025年6月7日</ListItemSubtitle>
    </ListItemContent>
    <ListItemAction>
      <Button variant="ghost" size="sm">編集</Button>
    </ListItemAction>
  </ListItem>
</List>
```

### カード表示
```jsx
<CardGrid>
  <DiaryCard>
    <CardImage src="..." alt="日記画像" />
    <CardContent>
      <CardTitle>旅行の思い出</CardTitle>
      <CardDescription>素晴らしい1日でした...</CardDescription>
      <CardMeta>
        <MapPin className="h-4 w-4" />
        東京タワー
      </CardMeta>
    </CardContent>
  </DiaryCard>
</CardGrid>
```

## モーダル・オーバーレイ

### ダイアログ
```jsx
<Dialog open={isOpen} onClose={setIsOpen}>
  <DialogHeader>
    <DialogTitle>日記を削除</DialogTitle>
  </DialogHeader>
  <DialogContent>
    この操作は取り消せません。本当に削除しますか？
  </DialogContent>
  <DialogActions>
    <Button variant="secondary" onClick={onCancel}>
      キャンセル
    </Button>
    <Button variant="danger" onClick={onDelete}>
      削除する
    </Button>
  </DialogActions>
</Dialog>
```

### ドロップダウン
```jsx
<Dropdown>
  <DropdownTrigger>
    <Button variant="secondary">
      メニュー <ChevronDown className="h-4 w-4" />
    </Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem>編集</DropdownItem>
    <DropdownItem>共有</DropdownItem>
    <DropdownDivider />
    <DropdownItem variant="danger">削除</DropdownItem>
  </DropdownContent>
</Dropdown>
```

## レスポンシブデザイン

### ブレークポイント戦略
```css
/* Mobile First */
.component {
  /* Base: Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### モバイル最適化
- タッチターゲット: 最小44px
- フォントサイズ: 最小16px
- マージン: 十分なタッチ余白
- スクロール: 自然なスクロール体験

## パフォーマンス考慮

### 画像最適化
```jsx
// 遅延読み込み
<Image 
  src="image.jpg" 
  alt="説明"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// WebP対応
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="説明" />
</picture>
```

### アニメーション
```css
/* パフォーマンス重視 */
.animation {
  transform: translateX(0);
  transition: transform 0.2s ease;
}

/* GPU加速 */
.gpu-animation {
  will-change: transform;
  transform: translateZ(0);
}
```
