import React from 'react';
import { QuizSubmission } from '../interfaces/quizInterface';
import { getOptionStyle, getStatusBadge } from '../utils/quizStyles';

interface OxQuizOptionsProps {
  currentSubmission: QuizSubmission;
}

const OxQuizOptions: React.FC<OxQuizOptionsProps> = ({ currentSubmission }) => {
  const trueSelected = currentSubmission.userAnswer === 'true';
  const falseSelected = currentSubmission.userAnswer === 'false';
  
  // 정답 상태 확인
  const trueStatus = currentSubmission.correctAnswer === 'true' 
    ? 'correct' 
    : (trueSelected ? 'wrong' : 'default');
    
  const falseStatus = currentSubmission.correctAnswer === 'false'
    ? 'correct'
    : (falseSelected ? 'wrong' : 'default');
  
  // 배지 표시 여부
  const showTrueBadge = trueStatus !== 'default';
  const showFalseBadge = falseStatus !== 'default';
  
  return (
    <div className="flex flex-col space-y-3 mb-4">
      {/* O 옵션 */}
      <div className={`relative p-3 rounded-lg ${getOptionStyle(trueStatus)}`}>
        <div className="flex items-center justify-center text-center">
          <span className="font-bold mr-2">O</span>
          <div className="flex-1 text-center">맞습니다</div>
          
          {showTrueBadge && (
            <span className={getStatusBadge(trueStatus).className}>
              {getStatusBadge(trueStatus).text}
            </span>
          )}
        </div>
      </div>
      
      {/* X 옵션 */}
      <div className={`relative p-3 rounded-lg ${getOptionStyle(falseStatus)}`}>
        <div className="flex items-center justify-center text-center">
          <span className="font-bold mr-2">X</span>
          <div className="flex-1 text-center">아닙니다</div>
          
          {showFalseBadge && (
            <span className={getStatusBadge(falseStatus).className}>
              {getStatusBadge(falseStatus).text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OxQuizOptions;