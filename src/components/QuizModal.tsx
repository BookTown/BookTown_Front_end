import React, { useState } from "react";
import Button from "./Button";
import { ChevronDown, ChevronUp } from "lucide-react";

// API 응답 형식에 맞는 인터페이스
interface QuizSubmission {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  correct: boolean;
}

interface QuizHistoryDetail {
  historyId: number | null;
  bookTitle: string;
  totalScore: number;
  submittedAt: string;
  submissions: QuizSubmission[];
}

export interface QuizModalProps {
  bookTitle: string;
  score: number;
  quizNumber: number;
  submission: QuizSubmission;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastQuestion: boolean;
  isFirstQuestion?: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({
  bookTitle,
  score,
  quizNumber,
  submission,
  onClose,
  onNext,
  onPrev,
  isLastQuestion,
  isFirstQuestion = false
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  // TRUE/FALSE 퀴즈인지 확인
  const isTrueFalseQuiz = submission.correctAnswer === "TRUE" || submission.correctAnswer === "FALSE";
  
  // 정답 인덱스 계산
  const correctAnswerIndex = submission.correctAnswer === "TRUE" ? 0 : 1;
  
  // 사용자 선택 인덱스 계산
  const selectedAnswerIndex = submission.userAnswer === "TRUE" ? 0 : 1;

  // 선택지 옵션의 상태 결정 함수
  const getOptionStatus = (index: number) => {
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
          <h3 className="font-medium mb-3">
            <span className="inline-flex items-center">
              Quiz 
              <span className="relative ml-1">
                <span 
                  className="absolute text-red-500 z-10" 
                  style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    fontFamily: 'cursive', 
                    top: '-6px', 
                    left: '0',
                    right: '0',
                    textAlign: 'center',
                    transform: submission.correct ? 'translateX(-4px)' : 'none'
                  }}
                >
                  {submission.correct ? "O" : "/"}
                </span>
                <span className="relative z-0">{quizNumber}</span>
              </span>
            </span>
          </h3>
          
          <p className="mb-5 text-sm">{submission.question}</p>

          {isTrueFalseQuiz ? (
            // OX 형식 렌더링
            submission.correct ? (
              // 정답인 경우 - 정답만 중앙에 표시
              <div className="mb-4">
                <div 
                  className={`relative p-12 rounded-lg flex items-center justify-center mx-auto w-1/2 ${
                    getOptionStyle("correct")
                  }`}
                >
                  <span className="text-6xl font-bold">
                    {submission.correctAnswer === "TRUE" ? "O" : "X"}
                  </span>
                  {renderBadge("correct")}
                </div>
              </div>
            ) : (
              // 오답인 경우 - O와 X 모두 표시
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* O 선택지 */}
                <div 
                  className={`relative p-12 rounded-lg flex items-center justify-center ${
                    getOptionStyle(getOptionStatus(0))
                  }`}
                >
                  <span className="text-6xl font-bold">O</span>
                  {renderBadge(getOptionStatus(0))}
                </div>
                
                {/* X 선택지 */}
                <div 
                  className={`relative p-12 rounded-lg flex items-center justify-center ${
                    getOptionStyle(getOptionStatus(1))
                  }`}
                >
                  <span className="text-6xl font-bold">X</span>
                  {renderBadge(getOptionStatus(1))}
                </div>
              </div>
            )
          ) : (
            // 기존 객관식, 단답형 텍스트 옵션 렌더링
            <div className="space-y-3 mb-4">
              {submission.correct ? (
                // 정답인 경우 - 정답만 표시
                <div className={`relative p-3 rounded-lg ${getOptionStyle("correct")}`}>
                  <p className="font-medium">{submission.correctAnswer}</p>
                  {renderBadge("correct")}
                </div>
              ) : (
                // 오답인 경우 - 사용자 답변과 정답 모두 표시
                <>
                  <div className={`relative p-3 rounded-lg ${getOptionStyle("wrong")}`}>
                    <p className="font-medium">{submission.userAnswer}</p>
                    {renderBadge("wrong")}
                  </div>
                  <div className={`relative p-3 rounded-lg ${getOptionStyle("correct")}`}>
                    <p className="font-medium">{submission.correctAnswer}</p>
                    {renderBadge("correct")}
                  </div>
                </>
              )}
            </div>
          )}

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
                <p className="text-sm">{submission.question}</p>
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
