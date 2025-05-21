import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import { formatDate } from "../utils/dateUtils";

interface QuizHistoryItem {
  id: number;
  bookId: number;
  bookTitle: string;
  score: number;
  submittedAt: string;
  groupIndex: number;
  correctCount?: number; // 맞은 문제 개수 (있을 경우)
}

interface QuizHistorySelectModalProps {
  bookTitle: string;
  histories: QuizHistoryItem[];
  onClose: () => void;
  onSelectHistory: (bookId: number, groupIndex: number) => void;
}

const QuizHistoryListModal: React.FC<QuizHistorySelectModalProps> = ({
  bookTitle,
  histories,
  onClose,
  onSelectHistory
}) => {
  // 현재 선택된 필터 (전체, 객관식, 주관식, O/X)
  const [filter, setFilter] = useState<string>("전체");
  
  // 빈 히스토리 처리
  if (!histories || histories.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium">{bookTitle}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-5 border border-black/20 text-center">
            <p className="text-sm mb-3">퀴즈 기록이 없습니다.</p>
            <Button size="md" color="pink" onClick={onClose} className="w-full">
              닫기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 배경 딤처리 - 클릭 시 모달 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10 max-h-[90vh] overflow-y-auto">
        {/* 헤더: 책 제목 및 닫기 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium">{bookTitle}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* 필터 버튼 영역 */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
          {["전체", "객관식", "주관식", "O/X"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
                filter === option 
                  ? "bg-[#C75C5C] text-white" 
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* 퀴즈 히스토리 목록 */}
        <div className="space-y-4">
          {histories.map((history) => {
            const date = new Date(history.submittedAt);
            const formattedDate = formatDate(date);
            
            // 정답 수로 색상 결정 (점수는 큰 의미가 없음)
            // 정답 수가 명시적으로 제공되지 않으면 점수를 기반으로 추정
            // 문제 당 10점 만점이라고 가정하고 계산하나, 이상적으로는 API에서 correctCount를 제공해야 함
            const estimatedCorrectCount = Math.floor(history.score / 10);
            const correctCount = history.correctCount !== undefined ? history.correctCount : estimatedCorrectCount;
            
            // 6개 이상 맞으면 초록색, 5개 이하면 빨간색
            const scoreColor = correctCount >= 6 ? "text-[#7BC8A0]" : "text-[#EB645F]";
            
            return (
              <div 
                key={history.id} 
                className="bg-gray-50 rounded-lg p-4 border border-black/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">객관식</p>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                  <button 
                    className="text-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 삭제 로직 구현 필요
                      console.log("삭제 버튼 클릭:", history.id);
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className={`text-2xl font-bold ${scoreColor}`}>
                    {history.score}/10
                  </div>
                  <Button 
                    size="sm" 
                    color="pink"
                    onClick={() => onSelectHistory(history.bookId, history.groupIndex)}
                  >
                    결과보기
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 푸터 영역: 페이지네이션 및 버튼들 */}
        <div className="flex justify-between mt-6">
          <Button 
            size="md" 
            color="white"
            onClick={onClose}
          >
            이전
          </Button>
          <Button 
            size="md" 
            color="pink"
            onClick={onClose}
          >
            다음
          </Button>
        </div>
        
        {/* 페이지네이션 인디케이터 */}
        <div className="mt-2 text-center text-sm text-gray-500">
          1 / 2
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryListModal;