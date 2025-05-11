import React from 'react';
import { QuizSubmission } from '../interfaces/quizInterface';
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
  const getOptionStatus = (option: string): 'correct' | 'wrong' | 'default' => {
    const isUserAnswer = option === currentSubmission.userAnswer;
    const isCorrectAnswer = option === currentSubmission.correctAnswer;
    
    if (isCorrectAnswer) return 'correct';
    if (isUserAnswer && !currentSubmission.correct) return 'wrong';
    return 'default';
  };
  
  // options가 없거나 빈 배열인 경우 확인
  if (!currentSubmission.options || currentSubmission.options.length === 0) {
    console.error('No options found for multiple choice question', currentSubmission);
    return <div>선택지 정보를 불러올 수 없습니다.</div>;
  }
  
  return (
    <div className="space-y-3 mb-4">
      {currentSubmission.options.map((option, index) => {
        // 타입 안전하게 처리
        const optionText = typeof option === 'string' ? option : (option as any).text || String(option);
        const status = getOptionStatus(optionText);
        const showBadge = status !== 'default';
        
        return (
          <div 
            key={index}
            className={`relative p-3 rounded-lg ${getOptionStyle(status)}`}
          >
            <div className="flex items-center">
              <span className="font-medium mr-2">{getOptionLabel(index)}</span>
              <div className="flex-1">{optionText}</div>
              
              {showBadge && (
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 ${getStatusBadge(status).className} text-xs px-2 py-0.5 rounded-md`}>
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