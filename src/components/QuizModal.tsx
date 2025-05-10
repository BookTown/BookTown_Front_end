import React, { useState } from "react";
import Button from "./Button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface QuizModalProps {
  bookTitle: string;
  score: number;
  quizNumber: number;
  question: string;
  options: {
    id: number;
    text: string;
    index: number;
  }[];
  correctAnswerIndex: number;
  selectedAnswerIndex?: number;
  explanation?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastQuestion?: boolean;
  isFirstQuestion?: boolean;
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
  isFirstQuestion = false
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // 선택지 옵션의 상태 결정 함수
  const getOptionStatus = (index: number) => {
    if (selectedAnswerIndex === undefined) return "default";
    if (index === correctAnswerIndex) return "correct";
    if (index === selectedAnswerIndex && index !== correctAnswerIndex) return "wrong";
    return "default";
  };

  // 선택지 배경색과 테두리 결정
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

  // 정답/오답 표시 배지
  const renderBadge = (status: string) => {
    if (status === "correct") {
      return (
        <span className="absolute right-2 top-0 -translate-y-1/2 bg-[#4B8E96] text-white text-xs px-2 py-0.5 rounded-md z-10">
          정답
        </span>
      );
    }
    if (status === "wrong") {
      return (
        <span className="absolute right-2 top-0 -translate-y-1/2 bg-[#C75C5C] text-white text-xs px-2 py-0.5 rounded-md z-10">
          오답
        </span>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* dim 배경 바깥 클릭 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10">
        {/* 책 제목 및 점수 */}
        <div className="mb-4">
          <h2 className="text-base font-medium">{bookTitle}</h2>
          <p className="text-sm text-gray-500">점수: {score}점</p>
        </div>

        {/* 퀴즈 내용 - 이미지와 같이 스타일링 */}
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
                  {renderBadge(status)}
                </div>
              );
            })}
          </div>

          {/* 해설보기 아코디언 - 이미지와 같이 스타일링 */}
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

        {/* 이전/다음 버튼 */}
        <div className="flex justify-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
