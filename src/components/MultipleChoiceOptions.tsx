import React from 'react';
import { QuizSubmission, QuizOption } from '../interfaces/quizInterface';
import { getOptionStyle, getStatusBadge } from '../utils/quizStyles';

interface MultipleChoiceOptionsProps {
  currentSubmission: QuizSubmission;
}

const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({ currentSubmission }) => {
  // 옵션 레이블 생성 함수
  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index) + '. '; // A, B, C, D 생성
  };
  
  // 옵션 상태 결정 함수
  const getOptionStatus = (option: QuizOption): 'correct' | 'wrong' | 'default' => {
    const isUserAnswer = option.text === currentSubmission.userAnswer;
    const isCorrectAnswer = option.text === currentSubmission.correctAnswer;
    
    if (isCorrectAnswer) return 'correct';
    if (isUserAnswer && !isCorrectAnswer) return 'wrong';
    return 'default';
  };
  
  // options가 없거나 빈 배열인 경우 확인
  if (!currentSubmission.options || currentSubmission.options.length === 0) {
    return <div className="text-sm text-red-500">선택지 정보를 불러올 수 없습니다.</div>;
  }
  
  return (
    <div className="space-y-3 mb-4">
      {currentSubmission.options.map((option) => {
        const status = getOptionStatus(option);
        const showBadge = status !== 'default';
        
        return (
          <div 
            key={option.id}
            className={`relative p-3 rounded-lg ${getOptionStyle(status)}`}
          >
            <div className="flex items-center">
              <span className="font-medium mr-2">{getOptionLabel(option.index)}</span>
              <div className="flex-1">{option.text}</div>
              
              {showBadge && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusBadge(status).className}`}>
                  {getStatusBadge(status).text}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MultipleChoiceOptions;