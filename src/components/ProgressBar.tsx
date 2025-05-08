import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  color = "#C75C5C" // 기본 색상은 빨간색 계열
}) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col items-center justify-center mb-1">
      </div>
      <div className="w-full h-2 bg-gray-200 overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;