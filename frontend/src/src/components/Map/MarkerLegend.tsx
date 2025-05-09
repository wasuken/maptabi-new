import React from 'react';

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
      <style tsx="true">{`
        .marker-legend {
          background-color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 1rem 0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          min-width: 200px;
        }

        .legend-marker {
          width: 24px;
          height: 24px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .start-marker {
          background-color: #3887be;
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
        }

        .circle-marker {
          background-color: #3887be;
          border-radius: 50%;
          font-size: 12px;
        }

        .end-marker {
          background-color: #3887be;
          border-radius: 4px;
          position: relative;
        }

        .end-marker:after {
          content: 'E';
          position: absolute;
          font-size: 12px;
        }

        .single-marker {
          background-color: #3887be;
          border-radius: 4px;
          transform: rotate(45deg);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default MarkerLegend;
