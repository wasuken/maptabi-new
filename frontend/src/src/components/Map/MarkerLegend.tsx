import React from 'react';
import './MarkerLegend.css';

interface MarkerLegendProps {
  className?: string;
}

const MarkerLegend: React.FC<MarkerLegendProps> = ({ className = '' }) => {
  return (
    <div className={`marker-legend ${className}`}>
      <h3>マーカーの説明</h3>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-marker start-marker"></div>
          <div className="legend-text">開始地点：経路の最初の地点</div>
        </div>
        <div className="legend-item">
          <div className="legend-marker circle-marker">2</div>
          <div className="legend-text">中間地点：経路の途中の地点</div>
        </div>
        <div className="legend-item">
          <div className="legend-marker end-marker"></div>
          <div className="legend-text">終了地点：経路の最後の地点</div>
        </div>
        <div className="legend-item">
          <div className="legend-marker single-marker">★</div>
          <div className="legend-text">単一地点：単独の位置情報</div>
        </div>
      </div>
      <p>※同じ色のマーカーと線は同じ日記に属する位置情報です</p>
    </div>
  );
};

export default MarkerLegend;
