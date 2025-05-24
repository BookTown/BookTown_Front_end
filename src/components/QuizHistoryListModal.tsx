import React, { useState, useEffect } from "react";
import { X, Trash2Icon } from "lucide-react";
import Button from "./Button";
import { formatDate } from "../utils/dateUtils";
import { deleteBookQuizHistory, fetchUserProfile } from "../api/user";

interface QuizHistoryItem {
  id: number;
  bookId: number;
  bookTitle: string;
  bookImageUrl?: string;
  groupIndex: number;
  quizType: string;
  submittedAt: string;
  score: number;
}

interface QuizHistorySelectModalProps {
  bookTitle: string;
  histories: QuizHistoryItem[];
  onClose: () => void;
  onSelectHistory: (bookId: number, groupIndex: number) => void;
  onHistoryDeleted?: (bookId: number, groupIndex: number) => void; // 매개변수 수정
}

const QuizHistoryListModal: React.FC<QuizHistorySelectModalProps> = ({
  bookTitle,
  histories,
  onClose,
  onSelectHistory,
  onHistoryDeleted
}) => {
  // 현재 선택된 필터 (전체, 객관식, 주관식, O/X)
  const [filter, setFilter] = useState<string>("전체");
  // 페이지네이션을 위한 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredHistories, setFilteredHistories] = useState<QuizHistoryItem[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const itemsPerPage = 2; // 페이지당 표시할 항목 수
  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  
  // 사용자 ID 가져오기
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUserId(userProfile.id);
      } catch (error) {
        console.error("사용자 프로필을 불러오는데 실패했습니다:", error);
      }
    };
    
    getUserId();
  }, []);
  
  // 필터에 따라 히스토리 필터링
  useEffect(() => {
    let result = [...histories];
    
    // 필터 적용
    if (filter !== "전체") {
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
  
  // 히스토리 삭제 함수
  const handleDeleteHistory = async (e: React.MouseEvent, history: QuizHistoryItem) => {
    e.stopPropagation();
    
    if (!userId) {
      alert("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
      return;
    }
    
    // 삭제 확인
    if (!window.confirm("이 퀴즈 기록을 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      setIsDeleting(history.id);
      
      // API 호출하여 히스토리 삭제
      await deleteBookQuizHistory(userId, history.bookId, history.groupIndex);
      
      // 성공적으로 삭제된 후, 로컬 상태 업데이트
      const updatedHistories = filteredHistories.filter(item => item.id !== history.id);
      setFilteredHistories(updatedHistories);
      
      // 부모 컴포넌트에 삭제 알림 (수정된 부분)
      if (onHistoryDeleted) {
        onHistoryDeleted(history.bookId, history.groupIndex);
      }

       // 모든 히스토리가 삭제되었는지 확인
      if (updatedHistories.length === 0) {
        // 모든 히스토리가 삭제되었으면 모달 닫기
        onClose();
        return; // 모달 닫기
      }
      
      // 페이지 조정 (현재 페이지의 모든 항목이 삭제된 경우 이전 페이지로)
      if (currentPage > 0 && currentPage >= Math.ceil(updatedHistories.length / itemsPerPage)) {
        setCurrentPage(currentPage - 1);
      }
      
    } catch (error) {
      console.error("퀴즈 히스토리 삭제 중 오류가 발생했습니다:", error);
      alert("퀴즈 히스토리 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(null);
    }
  };
  
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
          onClick={isLast ? onClose : handleNextPage}
          className="!w-[12.25rem] !h-[2.25rem]"
        >
          {isLast ? "닫기" : "다음"}
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
        <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-black/20 h-[18.75rem]">
          {noFilteredResults ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl text-[#9CAAB9]">선택한 유형의 퀴즈 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((history) => {
                const date = new Date(history.submittedAt);
                const formattedDate = formatDate(date);
                
                // quizType 직접 사용
                const quizTypeText = history.quizType || "퀴즈";
                
                return (
                  <div 
                    key={history.id} 
                    className="bg-white rounded-lg px-4 py-2 border border-black/10"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-3xl">{quizTypeText}</p>
                        <p className="text-sm text-[#9CAAB9]">생성일: {formattedDate}</p>
                      </div>
                      <button 
                        className={`text-[#9CAAB9] hover:text-[#C75C5C] transition-colors ${isDeleting === history.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => handleDeleteHistory(e, history)}
                        disabled={isDeleting !== null}
                      >
                        <Trash2Icon size={20} />
                        {isDeleting === history.id && <span className="sr-only">삭제 중...</span>}
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className={`text-5xl text-[#C75C5C]`}>
                          {history.score}점
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        color="pink"
                        onClick={() => onSelectHistory(history.bookId, history.groupIndex)}
                        className="!w-[7.5rem] !h-[2.25rem] !rounded-[0.5rem] !text-xl"
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
        <div className="flex justify-center gap-2 mt-4 mb-2">
          {renderNavigationButtons()}
        </div>

        
        {/* 페이지네이션 인디케이터 */}
        <div className="mt-2 text-center text-sm text-gray-500">
          {currentPage + 1} / {totalPages || 1}
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryListModal;