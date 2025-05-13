import React from 'react';
import { QuizSubmission } from "../interfaces/quizInterface";
import { getOptionStyle } from '../utils/quizStyles';

interface ShortAnswerResultProps {
  currentSubmission: QuizSubmission;
}

const ShortAnswerOptions: React.FC<ShortAnswerResultProps> = ({ currentSubmission }) => {
  const { correct, userAnswer, correctAnswer } = currentSubmission;
  
  return (
    <>
      {/* 사용자 답변 */}
      <div className={`relative p-3 rounded-lg ${getOptionStyle(correct ? 'correct' : 'wrong')}`}>
        <div className="text-xs text-gray-500 mb-1">사용자 답변:</div>
        <div className="text-center">{userAnswer}</div>
      </div>
        
      {/* 오답인 경우에만 정답 표시 */}
      {!correct && (
        <div className={`relative p-3 rounded-lg mt-3 ${getOptionStyle('correct')}`}>
          <div className="text-xs text-gray-500 mb-1">정답:</div>
          <div className="text-center">{correctAnswer}</div>
        </div>
      )}
    </>
  );
};

export default ShortAnswerOptions;