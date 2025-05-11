import React from 'react';
import { QuizSubmission } from '../interfaces/quizInterface';

interface MultipleChoiceOptionsProps {
  currentSubmission: QuizSubmission;
}

const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({ currentSubmission }) => {
  // 4지선다형 퀴즈 렌더링
  return (
    <div className="space-y-3 mb-4">
      {/* 모든 선택지 표시 */}
      {currentSubmission.options?.map((option, index) => {
        const isUserAnswer = option === currentSubmission.userAnswer;
        const isCorrectAnswer = option === currentSubmission.correctAnswer;
        
        // 스타일 결정
        let optionClass = "bg-white border border-black/20";
        let badgeComponent = null;
        
        if (isCorrectAnswer) {
          optionClass = "bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]";
          badgeComponent = (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4B8E96] text-white text-xs px-2 py-0.5 rounded-md">
              정답
            </span>
          );
        } else if (isUserAnswer && !currentSubmission.correct) {
          optionClass = "bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]";
          badgeComponent = (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C75C5C] text-white text-xs px-2 py-0.5 rounded-md">
              오답
            </span>
          );
        }
        
        return (
          <div 
            key={index}
            className={`relative p-3 rounded-lg ${optionClass}`}
          >
            <div className="flex items-center">
              <span className="font-medium mr-2">
                {index === 0 ? 'A. ' : index === 1 ? 'B. ' : index === 2 ? 'C. ' : 'D. '}
              </span>
              <div className="flex-1">{option}</div>
              {badgeComponent}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MultipleChoiceOptions;