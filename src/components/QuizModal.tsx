import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { ChevronDown, X } from "lucide-react";
import { QuizHistoryDetail, QuizSubmission, QuizType, determineQuizType } from "../interfaces/quizInterface";
import OxQuizOptions from "./OxQuizOptions";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import ShortAnswerOptions from "./ShortAnswerOptions";

interface QuizModalProps {
  onClose: () => void;
  historyData?: QuizHistoryDetail;
  // 이전 호환성을 위한 props 추가
  bookTitle?: string;
  score?: number;
  quizNumber?: number;
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
  onNext?: () => void;
  onPrev?: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({
  onClose,
  historyData,
  bookTitle, // 추가
  // 다른 props는 사용하지 않음
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [explanationHeight, setExplanationHeight] = useState(0);
  const explanationRef = useRef<HTMLDivElement>(null);
  
  // API 데이터 존재 여부 확인
  const hasApiData = !!historyData && historyData.submissions.length > 0;
  
  // 현재 문제 데이터
  const currentSubmission = hasApiData ? historyData!.submissions[currentIndex] : null;
  
  // 총 문제 수
  const totalQuestions = hasApiData ? historyData!.submissions.length : 0;

  // 해설 박스의 실제 높이를 측정
  useEffect(() => {
    if (explanationRef.current) {
      if (showExplanation) {
        setExplanationHeight(explanationRef.current.scrollHeight);
      } else {
        setExplanationHeight(0);
      }
    }
  }, [showExplanation, currentSubmission]);

  // 다음 문제로 이동
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    }
  };

  // 이전 문제로 이동
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowExplanation(false);
    }
  };

  // 에러 상태 렌더링 (API 데이터 없을 때)
  const renderErrorState = () => (
    <div className="bg-gray-50 rounded-lg p-6 mb-5 border border-black/20 text-center">
      <p className="text-sm mb-3">데이터를 불러올 수 없습니다.</p>
      <Button size="md" color="pink" onClick={onClose} className="w-full">
        닫기
      </Button>
    </div>
  );

  // 해설 토글 핸들러
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  // 퀴즈 렌더링
  const renderQuiz = (submission: QuizSubmission) => {
    const quizType = determineQuizType(submission);
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-black/20">
        {/* 문제 번호 및 정답 여부 */}
        <div className="flex items-center mb-3">
          <div className="relative mr-2">
            <h3 className="font-medium flex items-center">
              <span>Quiz</span>
              <span className="relative inline-block ml-1">
                {currentIndex + 1}
                {submission.correct ? (
                  // 정답 표시 - 빨간색 동그라미
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" 
                    className="absolute -top-[2px] -left-[6px]">
                    <circle cx="20" cy="20" r="18" stroke="#FF0000" strokeWidth="4" />
                  </svg>
                ) : (
                  // 오답 표시 - 빨간색 슬래시
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" 
                    className="absolute -top-[2px] -left-[6px]">
                    <line x1="10" y1="30" x2="30" y2="10" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </h3>
          </div>
        </div>

        {/* 문제 내용 */}
        <p className="mb-5 text-sm">{submission.question}</p>
        
        {/* 퀴즈 유형에 따른 컴포넌트 렌더링 */}
        {quizType === QuizType.TRUE_FALSE && (
          <OxQuizOptions currentSubmission={submission} />
        )}
        
        {quizType === QuizType.MULTIPLE_CHOICE && (
          <MultipleChoiceOptions currentSubmission={submission} />
        )}
        
        {quizType === QuizType.SHORT_ANSWER && (
          <ShortAnswerOptions currentSubmission={submission} />
        )}

        {/* 해설 섹션 */}
        <div className="mt-4 border-[1.5px] border-black rounded-lg overflow-hidden">
          <button
            className="w-full p-1 h-8 flex items-center justify-center relative bg-white"
            onClick={toggleExplanation}
          >
            <span className="text-center">{showExplanation ? "해설닫기" : "해설보기"}</span>
            <span className={`absolute right-4 transition-transform duration-300 ease-in-out ${showExplanation ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown size={18} />
            </span>
          </button>
          <div 
            style={{ height: `${explanationHeight}px` }}
            className="transition-all duration-300 ease-in-out border-t border-black/20 bg-gray-50 overflow-hidden"
          >
            <div ref={explanationRef} className="p-6 text-center">
              <p className="text-sm">
                {submission.explanation ? submission.explanation : "해설이 없습니다."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 네비게이션 버튼 렌더링
  const renderNavigationButtons = () => {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;
    
    return (
      <>
        <Button 
          size="md" 
          color="white" 
          onClick={handlePrev} 
          disabled={isFirst}
          className={`w-[48%] ${isFirst ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          이전
        </Button>
        <Button 
          size="md" 
          color="pink" 
          onClick={isLast ? onClose : handleNext} 
          className="w-[48%]"
        >
          {isLast ? "완료" : "다음"}
        </Button>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 배경 딤처리 - 클릭 시 모달 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />
      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10 max-h-[90vh] overflow-y-auto">
        {/* 헤더: 책 제목 및 닫기 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-medium">{historyData?.bookTitle || bookTitle || "퀴즈 결과"}</h2>
            {hasApiData && (
              <p className="text-sm text-gray-500">총점: {historyData!.totalScore}점</p>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        {/* 퀴즈 컨텐츠 또는 에러 상태 */}
        {currentSubmission ? renderQuiz(currentSubmission) : renderErrorState()}
        {/* 이전/다음 버튼 - 항상 렌더링하지만 상태에 따라 높이와 투명도 조절 */}
        <div 
          className={`flex justify-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
            currentSubmission && !showExplanation
              ? 'max-h-20 opacity-100 mt-4 mb-2' 
              : 'max-h-0 opacity-0 mt-0 mb-0'
          }`}
        >
          {renderNavigationButtons()}
        </div>
        {/* 퀴즈 진행 상황 표시 */}
        {hasApiData && (
          <div className="mt-2 text-center text-sm text-gray-500">
            {currentIndex + 1} / {totalQuestions}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;