import React, { useState } from "react";
import Button from "./Button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { QuizHistoryDetail } from "../interfaces/quizInterface";

interface QuizOption {
  id: number;
  text: string;
  index: number;
}
interface QuizModalProps {
  bookTitle: string;
  score: number;
  quizNumber: number;
  question: string;
  options: QuizOption[];
  correctAnswerIndex: number;
  selectedAnswerIndex?: number;
  explanation?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastQuestion?: boolean;
  isFirstQuestion?: boolean;
  // history prop 추가
  historyData?: QuizHistoryDetail;
}
const QuizModal: React.FC<QuizModalProps> = ({
  bookTitle,
  score,
  quizNumber,
  question,
  options,
  correctAnswerIndex,
  selectedAnswerIndex,
  explanation = "이 문제에 대한 해설이 제공되지 않았습니다.",
  onClose,
  onNext,
  onPrev,
  isLastQuestion = false,
  isFirstQuestion = false,
  historyData
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  // 현재 보고 있는 문제의 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // API 데이터가 있는지 확인
  const hasApiData = !!historyData && historyData.submissions.length > 0;
  // 현재 문제 데이터
  const currentSubmission = hasApiData ? historyData!.submissions[currentIndex] : null;
  // API 데이터 사용 시 총 문제 수
  const totalQuestions = hasApiData ? historyData!.submissions.length : 0;

  // 다음 문제로 이동
  const handleNext = () => {
    if (hasApiData && currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (onNext) {
      onNext();
    }
  };

  // 이전 문제로 이동
  const handlePrev = () => {
    if (hasApiData && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (onPrev) {
      onPrev();
    }
  };

  // 선택지 옵션의 상태 결정 함수 (기존 데이터용)
  const getOptionStatus = (index: number) => {
    if (selectedAnswerIndex === undefined) return "default";
    if (index === correctAnswerIndex) return "correct";
    if (index === selectedAnswerIndex && index !== correctAnswerIndex) return "wrong";
    return "default";
  };

  // 스타일 선택 함수
  const getOptionStyle = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-[#B2EBF2] border-[1.5px] border-[#4B8E96] text-black";
      case "wrong":
        return "bg-[#FFEBEE] border-[1.5px] border-[#C75C5C] text-black";
      default:
        return "bg-white border border-black/20 text-black";
    }
  };

  // OX 퀴즈인지 확인 (TRUE/FALSE 형태)
  const isOxQuiz = (answer: string) => {
    return answer === "TRUE" || answer === "FALSE";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* dim 배경 바깥 클릭 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10 max-h-[90vh] overflow-y-auto">
        {/* 헤더: 책 제목 및 닫기 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-medium">{historyData?.bookTitle || bookTitle}</h2>
            {hasApiData ? (
              <p className="text-sm text-gray-500">총점: {historyData!.totalScore}점</p>
            ) : (
              <p className="text-sm text-gray-500">점수: {score}점</p>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* 퀴즈 내용 - API 데이터 있을 때 */}
        {hasApiData && currentSubmission && (
          <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-black/20">
            {/* 문제 번호 및 정답 여부 */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Quiz {currentIndex + 1}</h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                currentSubmission.correct 
                  ? 'bg-[#B2EBF2] text-[#4B8E96]' 
                  : 'bg-[#FFEBEE] text-[#C75C5C]'
              }`}>
                {currentSubmission.correct ? '정답' : '오답'}
              </span>
            </div>

            {/* 문제 내용 */}
            <p className="mb-5 text-sm">{currentSubmission.question}</p>
            
            {/* OX 퀴즈인 경우 */}
            {isOxQuiz(currentSubmission.correctAnswer) && (
              <div className="mb-4">
                {currentSubmission.correct ? (
                  // 정답인 경우: 정답만 표시
                  <div className="flex flex-col justify-center">
                    <div className="text-xs text-gray-500 mb-1 text-center">사용자 답변:</div>
                    <div className={`relative p-12 rounded-lg flex items-center justify-center w-full ${
                      currentSubmission.correctAnswer === "TRUE" 
                        ? 'bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]' 
                        : 'bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]'
                    }`}>
                      <span className="text-6xl font-bold">
                        {currentSubmission.correctAnswer === "TRUE" ? "O" : "X"}
                      </span>
                      <span className="absolute right-2 top-2 bg-[#4B8E96] text-white text-xs px-2 py-0.5 rounded-md">
                        정답
                      </span>
                    </div>
                  </div>
                ) : (
                  // 오답인 경우: OX 두 개 표시
                  <div>
                    <div className="text-xs text-gray-500 mb-1">선택지:</div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* O 선택지 */}
                      <div className={`relative p-12 rounded-lg flex items-center justify-center ${
                        currentSubmission.correctAnswer === "TRUE" 
                          ? 'bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]' 
                          : (currentSubmission.userAnswer === "TRUE" 
                            ? 'bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]' 
                            : 'bg-white border border-black/20')
                      }`}>
                        <span className="text-6xl font-bold">O</span>
                        {currentSubmission.correctAnswer === "TRUE" && (
                          <span className="absolute right-2 top-2 bg-[#4B8E96] text-white text-xs px-2 py-0.5 rounded-md">
                            정답
                          </span>
                        )}
                        {currentSubmission.userAnswer === "TRUE" && (
                          <span className="absolute left-2 top-2 text-xs px-2 py-0.5 rounded-md">
                            사용자 답변
                          </span>
                        )}
                      </div>
                      
                      {/* X 선택지 */}
                      <div className={`relative p-12 rounded-lg flex items-center justify-center ${
                        currentSubmission.correctAnswer === "FALSE" 
                          ? 'bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]' 
                          : (currentSubmission.userAnswer === "FALSE" 
                            ? 'bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]' 
                            : 'bg-white border border-black/20')
                      }`}>
                        <span className="text-6xl font-bold">X</span>
                        {currentSubmission.correctAnswer === "FALSE" && (
                          <span className="absolute right-2 top-2 bg-[#4B8E96] text-white text-xs px-2 py-0.5 rounded-md">
                            정답
                          </span>
                        )}
                        {currentSubmission.userAnswer === "FALSE" && (
                          <span className="absolute left-2 top-2 text-xs px-2 py-0.5 rounded-md">
                            사용자 답변
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* 일반 텍스트 답변인 경우 */}
            {!isOxQuiz(currentSubmission.correctAnswer) && (
              <div className="space-y-3 mb-4">
                {/* 사용자 답변 */}
                <div className={`relative p-3 rounded-lg ${
                  currentSubmission.correct 
                    ? getOptionStyle("correct") 
                    : getOptionStyle("wrong")
                }`}>
                  <div className="text-xs text-gray-500 mb-1">사용자 답변:</div>
                  <div>{currentSubmission.userAnswer}</div>
                </div>
                  
                {/* 오답인 경우에만 정답 표시 */}
                {!currentSubmission.correct && (
                  <div className={`relative p-3 rounded-lg ${getOptionStyle("correct")}`}>
                    <div className="text-xs text-gray-500 mb-1">정답:</div>
                    <div>{currentSubmission.correctAnswer}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 퀴즈 내용 - 기존 데이터 사용 시 */}
        {!hasApiData && question && options && (
          <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-black/20">
            <h3 className="font-medium mb-3">Quiz {quizNumber}</h3>
            <p className="mb-5 text-sm">{question}</p>

            {/* 선택지 옵션 */}
            <div className="space-y-3 mb-4">
              {options.map((option) => {
                const status = getOptionStatus(option.index);
                return (
                  <div
                    key={option.id}
                    className={`relative p-3 rounded-lg ${getOptionStyle(status)}`}
                  >
                    {option.index === 0 && 'A. '}
                    {option.index === 1 && 'B. '}
                    {option.index === 2 && 'C. '}
                    {option.index === 3 && 'D. '}
                    {option.text}
                    {status === "correct" && (
                      <span className="absolute right-2 top-0 -translate-y-1/2 bg-[#4B8E96] text-white text-xs px-2 py-0.5 rounded-md z-10">
                        정답
                      </span>
                    )}
                    {status === "wrong" && (
                      <span className="absolute right-2 top-0 -translate-y-1/2 bg-[#C75C5C] text-white text-xs px-2 py-0.5 rounded-md z-10">
                        오답
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 해설보기 아코디언 */}
            <div className="border-[1.5px] border-black rounded-lg overflow-hidden">
              <button
                className="w-full p-3 flex items-center justify-center relative bg-white"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <span className="text-center">해설보기</span>
                <span className="absolute right-4">
                  {showExplanation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              {showExplanation && (
                <div className="p-6 border-t border-black/20 bg-gray-50 text-center">
                  <p className="text-sm">{explanation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 이전/다음 버튼 */}
        <div className="flex justify-center gap-2">
          {/* API 데이터일 경우 */}
          {hasApiData ? (
            <>
              <Button 
                size="md" 
                color="white" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className={`w-[48%] ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                이전
              </Button>
              <Button 
                size="md" 
                color="pink" 
                onClick={currentIndex === totalQuestions - 1 ? onClose : handleNext} 
                className="w-[48%]"
              >
                {currentIndex === totalQuestions - 1 ? "완료" : "다음"}
              </Button>
            </>
          ) : (
            /* 기존 데이터일 경우 */
            <>
              {!isFirstQuestion && (
                <Button size="md" color="white" onClick={onPrev} className="w-[48%]">
                  이전
                </Button>
              )}
              <Button 
                size="md" 
                color="pink" 
                onClick={isLastQuestion ? onClose : onNext} 
                className={!isFirstQuestion ? "w-[48%]" : "w-full"}
              >
                {isLastQuestion ? "완료" : "다음"}
              </Button>
            </>
          )}
        </div>

        {/* 퀴즈 진행 상황 표시 */}
        {hasApiData && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {currentIndex + 1} / {totalQuestions}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;