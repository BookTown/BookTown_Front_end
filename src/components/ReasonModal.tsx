import React from 'react';
import { X } from 'lucide-react';

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  reason: string;
}

const ReasonModal: React.FC<ReasonModalProps> = ({ isOpen, onClose, title, reason }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 배경 딤처리 - 클릭 시 모달 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10 max-h-[90vh] overflow-y-auto">
        {/* 헤더: 책 제목 및 닫기 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">승인 거부 사유</h2>
            <p className="text-sm text-gray-500">
              책: {title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 거부 사유 표시 영역 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <p className="text-[#C75C5C] font-medium mb-2">거부 사유:</p>
          <p className="text-gray-700">{reason}</p>
        </div>
        
        {/* 확인 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#C75C5C] text-white rounded-lg hover:bg-[#B04A4A] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;