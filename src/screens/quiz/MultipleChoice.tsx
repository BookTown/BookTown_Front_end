import { MultipleChoiceQuestion } from "./quizTypes";
import { useState } from "react";

interface Props {
  questionData: MultipleChoiceQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion?: boolean;
}

const MultipleChoice = ({ questionData, onAnswer, isLastQuestion = false }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optText: string) => {
    setSelectedOption(optText);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="space-y-6 px-4">
      {/* 문제 텍스트 */}
      <p className="text-lg md:text-xl pb-4">{questionData.question}</p>
      
      {/* 선택지 목록 */}
      <div className="space-y-4">
        {questionData.options.map((opt) => (
          <label 
            key={opt.id}
            className="flex items-center cursor-pointer"
          >
            <div className="relative">
              <input
                type="radio"
                name="quiz-option"
                className="opacity-0 absolute"
                checked={selectedOption === opt.text}
                onChange={() => handleOptionSelect(opt.text)}
              />
              <div className={`w-6 h-6 rounded-full border ${
                selectedOption === opt.text 
                  ? 'border-2 border-[#C75C5C]' 
                  : 'border-gray-400'
              } flex items-center justify-center mr-3`}>
                {selectedOption === opt.text && (
                  <div className="w-3 h-3 rounded-full bg-[#C75C5C]"></div>
                )}
              </div>
            </div>
            <span className="text-base md:text-lg">{opt.text}</span>
          </label>
        ))}
      </div>
      
      {/* 다음/제출 버튼 */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-3 rounded-full text-white font-medium transition
            ${selectedOption 
              ? 'bg-[#C75C5C] hover:bg-[#b54d4d]' 
              : 'bg-[#C75C5C]/60 cursor-not-allowed'
            }`}
        >
          {isLastQuestion ? "제출" : "다음"}
        </button>
      </div>
    </div>
  );
};

export default MultipleChoice;