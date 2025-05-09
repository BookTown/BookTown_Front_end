import { MultipleChoiceQuestion } from "./quizTypes";
import { useState } from "react";
import Button from "../../components/Button";

interface Props {
  questionData: MultipleChoiceQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion?: boolean;
  current: number;
}

const MultipleChoice = ({ questionData, onAnswer, isLastQuestion = false, current }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const currentNumber = current;

  const handleOptionSelect = (optText: string) => {
    setSelectedOption(optText);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };

  // 선택지 레이블 생성 함수
  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index) + '.';
  };

  return (
    <div className="">
      {/* 문제 텍스트 */}
      <p className="text-xl md:text-2xl pb-6">Quiz {currentNumber}. {questionData.question}</p>
      
      {/* 선택지 목록 */}
      <div className="space-y-4 ml-4">
        {questionData.options.map((opt, index) => (
          <label 
            key={opt.id}
            className="flex items-center cursor-pointer pt-6"
          >
            <div className="relative pr-2">
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
                  : 'border-black'
              } flex items-center justify-center mr-3`}>
                {selectedOption === opt.text && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#C75C5C]"></div>
                )}
              </div>
            </div>
            <span className={`text-xl md:text-2lg ${
              selectedOption === opt.text ? 'text-[#C75C5C]' : ''
            }`}>
              <span className="font-bold mr-2">{getOptionLabel(index)}</span>
              {opt.text}
            </span>
          </label>
        ))}
      </div>
      
      {/* 다음/제출 버튼 */}
      <div className="pt-12 md:pt-28 flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!selectedOption}
          size="lg"
          color="pink"
        >
          {isLastQuestion ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoice;