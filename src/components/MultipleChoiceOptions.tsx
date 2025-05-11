import React, { useEffect } from 'react';
import { QuizSubmission } from '../interfaces/quizInterface';
import { getOptionStyle, getStatusBadge } from '../utils/quizStyles';

interface MultipleChoiceOptionsProps {
  currentSubmission: QuizSubmission;
}

const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({ currentSubmission }) => {
  // 컴포넌트 마운트 시 로그 출력
  useEffect(() => {
    console.log("MultipleChoiceOptions 렌더링:", { 
      currentSubmission,
      options: currentSubmission.options,
      hasOptions: Array.isArray(currentSubmission.options) && currentSubmission.options.length > 0
    });
  }, [currentSubmission]);
  
  // 옵션 레이블 생성 함수
  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index) + '. '; // A, B, C, D 생성
  };
  
  // 옵션 상태 결정 함수
  const getOptionStatus = (option: string): 'correct' | 'wrong' | 'default' => {
    const isUserAnswer = option === currentSubmission.userAnswer;
    const isCorrectAnswer = option === currentSubmission.correctAnswer;
    
    if (isCorrectAnswer) return 'correct';
    if (isUserAnswer && !isCorrectAnswer) return 'wrong';
    return 'default';
  };
  
  // options가 없거나 빈 배열인 경우 확인
  if (!currentSubmission.options || currentSubmission.options.length === 0) {
    console.log("객관식 문제의 선택지가 없습니다.", currentSubmission);
    return <div className="text-sm text-red-500">선택지 정보를 불러올 수 없습니다.</div>;
  }
  
  return (
    <div className="space-y-3 mb-4">
      {currentSubmission.options.map((option, index) => {
        const optionText = option; // API 응답에서는 이미 문자열로 제공됨
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