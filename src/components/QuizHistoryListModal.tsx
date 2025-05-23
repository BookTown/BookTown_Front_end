import React, { useState, useEffect } from "react";
import { X, Trash2Icon } from "lucide-react";
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
  quizType?: string; // quizType 추가 (questionType 대신)
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
  // 페이지네이션을 위한 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredHistories, setFilteredHistories] = useState<QuizHistoryItem[]>([]);
  const itemsPerPage = 2; // 페이지당 표시할 항목 수
  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  
  // 필터에 따라 히스토리 필터링
  useEffect(() => {
    let result = [...histories];
    
    // 필터 적용
    if (filter !== "전체") {
      // API 응답의 quizType을 직접 사용
      result = histories.filter(history => 
        history.quizType === filter
      );
    }
    
    setFilteredHistories(result);
    setCurrentPage(0); // 필터 변경시 첫 페이지로 이동
  }, [filter, histories]);
  
  // 현재 페이지에 표시할 아이템 계산
  const currentItems = filteredHistories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // 네비게이션 버튼 렌더링
  const renderNavigationButtons = () => {
    const isFirst = currentPage === 0;
    const isLast = currentPage >= totalPages - 1;

    return (
      <>
        <Button
          size="md"
          color="white"
          onClick={handlePrevPage}
          disabled={isFirst}
          className={`!w-[12.25rem] !h-[2.25rem] ${
            isFirst ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          이전
        </Button>
        <Button
          size="md"
          color="pink"
          onClick={handleNextPage}
          disabled={isLast}
          className={`!w-[12.25rem] !h-[2.25rem] ${
            isLast ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          다음
        </Button>
      </>
    );
  };
  
  // 에러 상태 렌더링 (API 데이터 없을 때)
  const renderErrorState = () => (
    <div className="bg-gray-50 rounded-lg p-6 mb-5 border border-black/20 text-center">
      <p className="text-sm mb-3">퀴즈 기록이 없습니다.</p>
      <Button size="md" color="pink" onClick={onClose} className="w-full">
        닫기
      </Button>
    </div>
  );
  
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
          {renderErrorState()}
        </div>
      </div>
    );
  }

  // 필터링된 결과가 없을 때
  const noFilteredResults = filteredHistories.length === 0;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 배경 딤처리 - 클릭 시 모달 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10 max-h-[90vh] overflow-y-auto">
        {/* 헤더: 책 제목 및 닫기 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-medium">{bookTitle}</h2>
            <p className="text-sm text-gray-500">
              퀴즈 기록: {filteredHistories.length}개
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

        {/* 메인 콘텐츠 영역 - 그레이 박스 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-black/20">
          {noFilteredResults ? (
            <div className="text-center p-6">
              <p className="text-sm">선택한 유형의 퀴즈 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((history) => {
                const date = new Date(history.submittedAt);
                const formattedDate = formatDate(date);
                
                // quizType 직접 사용
                const quizTypeText = history.quizType || "퀴즈";
                
                // 정답 수로 색상 결정
                const estimatedCorrectCount = Math.floor(history.score / 10);
                const correctCount = history.correctCount !== undefined 
                  ? history.correctCount 
                  : estimatedCorrectCount;
                
                // 6개 이상 맞으면 초록색, 5개 이하면 빨간색
                const scoreColor = correctCount >= 6 ? "text-[#7BC8A0]" : "text-[#EB645F]";
                
                return (
                  <div 
                    key={history.id} 
                    className="bg-white rounded-lg p-4 border border-black/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">{quizTypeText}</p>
                        <p className="text-sm text-gray-500">생성일: {formattedDate}</p>
                      </div>
                      <button 
                        className="text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 삭제 로직 구현 필요
                          console.log("삭제 버튼 클릭:", history.id);
                        }}
                      >
                        <Trash2Icon size={20} />
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
          )}
        </div>

        {/* 이전/다음 버튼 */}
        {!noFilteredResults && filteredHistories.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-4 mb-2">
            {renderNavigationButtons()}
          </div>
        )}
        
        {/* 페이지네이션 인디케이터 */}
        {!noFilteredResults && filteredHistories.length > 0 && (
          <div className="mt-2 text-center text-sm text-gray-500">
            {currentPage + 1} / {totalPages || 1}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistoryListModal;