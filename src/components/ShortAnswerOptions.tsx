import React from 'react';
import { QuizSubmission } from "../interfaces/quizInterface";

interface ShortAnswerResultProps {
  currentSubmission: QuizSubmission;
}

const ShortAnswerOptions: React.FC<ShortAnswerResultProps> = ({ currentSubmission }) => {
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

  return (
    <>
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
    </>
  );
};

export default ShortAnswerOptions;