import maplibregl from 'maplibre-gl';

// マーカータイプの列挙型
export enum MarkerType {
  START, // 経路の開始地点
  MIDDLE, // 経路の中間地点
  END, // 経路の終了地点
  SINGLE, // 単一の位置情報
}

// マップのデフォルト設定
export const DEFAULT_MAP_CENTER: [number, number] = [139.6917, 35.6895]; // 東京
export const DEFAULT_MAP_ZOOM = 13;

// 日記ごとに一貫した色を割り当てるヘルパー関数
export const getColorForDiary = (diaryId: number): string => {
  // 日記IDを基にしたシンプルなハッシュ
  const hash = diaryId % 360;
  // HSLカラーで彩度と明度を固定し、色相だけを変える
  return `hsl(${hash}, 70%, 50%)`;
};

// カスタムHTMLマーカーを作成する関数
export const createCustomMarker = (
  number: number,
  color: string = '#3887be',
  type: MarkerType
): HTMLElement => {
  const element = document.createElement('div');
  element.className = 'custom-marker';

  // マーカーに共通のスタイル
  const baseStyles = `
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    transition: transform 0.2s;
    width: 32px;
    height: 32px;
    background-color: ${color};
    text-align: center;
    font-size: 14px;
  `;

  // マーカータイプによってスタイルを変える
  switch (type) {
    case MarkerType.START:
      // スタートマーカー（三角形）
      element.innerHTML = `
        <div class="marker-start" style="${baseStyles} clip-path: polygon(50% 0%, 100% 100%, 0% 100%);">
          <div class="marker-content">S</div>
        </div>
      `;
      break;

    case MarkerType.END:
      // エンドマーカー（四角形）
      element.innerHTML = `
        <div class="marker-end" style="${baseStyles} border-radius: 4px;">
          <div class="marker-content">E</div>
        </div>
      `;
      break;

    case MarkerType.SINGLE:
      // 単一位置情報マーカー（星形）- CSSでの星形は複雑なので、文字で代用
      element.innerHTML = `
        <div class="marker-single" style="${baseStyles} border-radius: 4px; transform: rotate(45deg);">
          <div class="marker-content" style="transform: rotate(-45deg);">★</div>
        </div>
      `;
      break;

    default:
      // 通常の丸いマーカー
      element.innerHTML = `
        <div class="marker-circle" style="${baseStyles} border-radius: 50%;">
          <div class="marker-content">${number}</div>
        </div>
      `;
  }

  // ホバーエフェクトのためのCSSクラスを追加
  element.addEventListener('mouseenter', () => {
    element.firstElementChild?.classList.add('hover');
  });

  element.addEventListener('mouseleave', () => {
    element.firstElementChild?.classList.remove('hover');
  });

  return element;
};

// マップスタイルの初期化
export const initializeMapStyle = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .custom-marker {
      cursor: pointer;
    }
    
    .marker-start, .marker-end, .marker-circle, .marker-single {
      position: relative;
    }
    
    .marker-start.hover, 
    .marker-end.hover, 
    .marker-circle.hover, 
    .marker-single.hover {
      transform: scale(1.2);
      z-index: 10;
    }
    
    .marker-content {
      position: relative;
      z-index: 2;
    }
  `;
  document.head.appendChild(style);

  return style;
};

// マップ共通設定
export const setupMap = (
  container: HTMLDivElement,
  center: [number, number] = DEFAULT_MAP_CENTER,
  zoom: number = DEFAULT_MAP_ZOOM
): maplibregl.Map => {
  const map = new maplibregl.Map({
    container,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap Contributors',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    },
    center,
    zoom,
  });

  // コントロールの追加
  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  return map;
};
