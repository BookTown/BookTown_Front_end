import React from 'react';
import { QuizSubmission } from '../interfaces/quizInterface';

interface OxQuizOptionsProps {
  currentSubmission: QuizSubmission;
}

const OxQuizOptions: React.FC<OxQuizOptionsProps> = ({ currentSubmission }) => {
  return (
    <div className="mb-4">
      {currentSubmission.correct ? (
        // 정답인 경우: 정답만 표시 (너비 조정 및 중앙 정렬)
        <div className="flex justify-center">
          <div className={`relative p-12 rounded-lg flex items-center justify-center ${
            currentSubmission.correctAnswer === "TRUE" 
              ? 'bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]' 
              : 'bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]'
          }`} style={{ width: '48%' }}>
            <span className="absolute top-2 left-2 text-xs text-gray-500">사용자 답변:</span>
            <span className="text-6xl font-bold">
              {currentSubmission.correctAnswer === "TRUE" ? "O" : "X"}
            </span>
          </div>
        </div>
      ) : (
        // 오답인 경우: OX 두 개 표시
        <div>
          <div className="grid grid-cols-2 gap-3">
            {/* O 선택지 */}
            <div className={`relative p-12 rounded-lg flex items-center justify-center ${
              currentSubmission.correctAnswer === "TRUE" 
                ? 'bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]' 
                : (currentSubmission.userAnswer === "TRUE" 
                  ? 'bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]' 
                  : 'bg-white border border-black/20')
            }`}>
              {currentSubmission.correctAnswer === "TRUE" && (
                <span className="absolute top-2 left-2 text-xs text-gray-500">정답:</span>
              )}
              {currentSubmission.userAnswer === "TRUE" && (
                <span className="absolute top-2 left-2 text-xs text-gray-500">사용자 답변:</span>
              )}
              <span className="text-6xl font-bold">O</span>
            </div>
            
            {/* X 선택지 */}
            <div className={`relative p-12 rounded-lg flex items-center justify-center ${
              currentSubmission.correctAnswer === "FALSE" 
                ? 'bg-[#B2EBF2] border-[1.5px] border-[#4B8E96]' 
                : (currentSubmission.userAnswer === "FALSE" 
                  ? 'bg-[#FFEBEE] border-[1.5px] border-[#C75C5C]' 
                  : 'bg-white border border-black/20')
            }`}>
              {currentSubmission.correctAnswer === "FALSE" && (
                <span className="absolute top-2 left-2 text-xs text-gray-500">정답:</span>
              )}
              {currentSubmission.userAnswer === "FALSE" && (
                <span className="absolute top-2 left-2 text-xs text-gray-500">사용자 답변:</span>
              )}
              <span className="text-6xl font-bold">X</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OxQuizOptions;