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
    <div className="w-full space-y-2 mb-6">
      {/* 책 아이콘과 진행도 텍스트 */}
      <div className="relative w-full h-14 mb-1">
        <div 
          className="absolute flex flex-col items-center"
          style={{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            transition: 'left 0.3s ease'
          }}
        >
          <p className="text-lg font-medium text-[#C75C5C] mb-1">
            {current}/{total}
          </p>
          <img 
            src="/images/book-icon.png" 
            alt="책 아이콘" 
            className="w-8 h-8"
          />
        </div>
      </div>
      
      {/* 프로그레스 바 */}
      <div className="w-full h-3 bg-gray-200 rounded-md overflow-hidden">
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