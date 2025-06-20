import React from 'react';
import { QuizSubmission } from "../interfaces/quizInterface";
import { getOptionStyle, getStatusBadge } from '../utils/quizStyles';

interface ShortAnswerResultProps {
  currentSubmission: QuizSubmission;
}

const ShortAnswerOptions: React.FC<ShortAnswerResultProps> = ({ currentSubmission }) => {
  const { correct, userAnswer, correctAnswer } = currentSubmission;
  
  return (
    <>
      {/* 사용자 답변 */}
      <div className={`relative p-2 rounded-lg ${getOptionStyle(correct ? 'correct' : 'wrong')}`}>
        {/* 정답/오답 라벨 추가 */}
        <span className={getStatusBadge(correct ? 'correct' : 'wrong').className}>
          {getStatusBadge(correct ? 'correct' : 'wrong').text}
        </span>
        <div className="text-xs text-gray-500 mb-1">사용자 답변:</div>
        <div className="">{userAnswer}</div>
      </div>
        
      {/* 오답인 경우에만 정답 표시 */}
      {!correct && (
        <div className={`relative p-2 rounded-lg mt-3 ${getOptionStyle('correct')}`}>
          {/* 정답 라벨 추가 */}
          <span className={getStatusBadge('correct').className}>
            {getStatusBadge('correct').text}
          </span>
          <div className="text-xs text-gray-500 mb-1">정답:</div>
          <div className="">{correctAnswer}</div>
        </div>
      )}
    </>
  );
};

export default ShortAnswerOptions;