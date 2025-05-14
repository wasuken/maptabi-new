import React from 'react';
import { MapPin, CircleHelp } from 'lucide-react';

interface MarkerLegendProps {
  className?: string;
}

const MarkerLegend: React.FC<MarkerLegendProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <MapPin className="h-4 w-4 mr-1 text-gray-700" />
        マーカーの説明
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 transform rotate-180 mr-3 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-gray-800">開始地点</p>
            <p className="text-xs text-gray-500">経路の最初の地点</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
          <div>
            <p className="text-sm font-medium text-gray-800">中間地点</p>
            <p className="text-xs text-gray-500">経路の途中の地点</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-sm mr-3 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">E</div>
          <div>
            <p className="text-sm font-medium text-gray-800">終了地点</p>
            <p className="text-xs text-gray-500">経路の最後の地点</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded transform rotate-45 mr-3 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold transform -rotate-45">★</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">単一地点</p>
            <p className="text-xs text-gray-500">単独の位置情報</p>
          </div>
        </div>
      </div>
      
      <div className="mt-3 border-t border-gray-200 pt-3">
        <p className="text-xs text-gray-600 flex items-center">
          <CircleHelp className="h-3 w-3 mr-1 text-gray-500" />
          同じ色のマーカーと線は同じ日記に属する位置情報です
        </p>
      </div>
    </div>
  );
};

export default MarkerLegend;
