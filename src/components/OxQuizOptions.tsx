import React from 'react';
import { QuizSubmission } from '../interfaces/quizInterface';
import { getOptionStyle, getStatusBadge } from '../utils/quizStyles';

interface OxQuizOptionsProps {
  currentSubmission: QuizSubmission;
}

const OxQuizOptions: React.FC<OxQuizOptionsProps> = ({ currentSubmission }) => {
  const { correct, correctAnswer, userAnswer } = currentSubmission;

  // OX 옵션 렌더링 함수
  const renderOption = (value: "TRUE" | "FALSE", symbol: string) => {
    const isCorrectAnswer = correctAnswer === value;
    const isUserAnswer = userAnswer === value;
    
    // 상태에 따른 스타일 결정
    let status: 'correct' | 'wrong' | 'default' = 'default';
    if (isCorrectAnswer) status = 'correct';
    else if (isUserAnswer && !correct) status = 'wrong';
    
    return (
      <div className={`relative w-32 md:w-[11.25rem] h-32 md:h-40 rounded-lg flex items-center justify-center ${getOptionStyle(status)}`}>
        {/* 정답/오답 라벨 추가 */}
        {status !== 'default' && (
          <span className={getStatusBadge(status).className}>
            {getStatusBadge(status).text}
          </span>
        )}
        {isCorrectAnswer && (
          <span className="absolute top-2 left-2 text-xs text-gray-500">정답:</span>
        )}
        {isUserAnswer && !isCorrectAnswer && (
          <span className="absolute top-2 left-2 text-xs text-gray-500">사용자 답변:</span>
        )}
        <span className="text-6xl font-bold">{symbol}</span>
      </div>
    );
  };

  return (
    <div className="mb-4">
      {correct ? (
        // 정답인 경우: 정답만 표시
        <div className="flex justify-center">
          {correctAnswer === "TRUE" 
            ? renderOption("TRUE", "O") 
            : renderOption("FALSE", "X")}
        </div>
      ) : (
        // 오답인 경우: OX 두 개 표시
        <div className="grid grid-cols-2 gap-3">
          {renderOption("TRUE", "O")}
          {renderOption("FALSE", "X")}
        </div>
      )}
    </div>
  );
};

export default OxQuizOptions;