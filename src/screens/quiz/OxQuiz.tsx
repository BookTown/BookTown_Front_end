import { TrueFalseQuestion } from "./quizTypes";
import { useState } from "react";
import Button from "../../components/Button";

interface Props {
  questionData: TrueFalseQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion?: boolean;
  current: number;
  score: number;
}

const OxQuiz = ({ questionData, onAnswer, isLastQuestion = false, current, score }: Props) => {
  const [selected, setSelected] = useState<"TRUE" | "FALSE" | null>(null);
  const currentNumber = current;

  const handleSelect = (value: "TRUE" | "FALSE") => {
    setSelected(value);
  };
  
  const handleSubmit = () => {
    if (selected) {
      onAnswer(selected);
    }
  };

  return (
    <div className="">
      {/* 문제 텍스트 */}
      <p className="text-xl md:text-2xl pb-3">Quiz {currentNumber}. {questionData.question}</p>
      {/* 배점 표시 */}
      <p className="text-lg md:text-xl text-[#9CAAB9] pb-4 md:pb-12">배점: {score}점</p>
      {/* O/X 버튼 */}
      <div className="flex justify-center gap-10 md:gap-16 mb-2 md:mb-8">
        <button
          type="button"
          className={`w-36 h-32 md:w-64 md:h-48 rounded-3xl flex items-center justify-center text-7xl md:text-8xl transition shadow-lg
            ${selected === "TRUE" 
              ? "border-2 border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]" 
              : "bg-white border-2 border-gray-300 hover:border-[#C75C5C] hover:text-[#C75C5C]"
            }`}
          onClick={() => handleSelect("TRUE")}
        >
          O
        </button>
        <button
          type="button"
          className={`w-36 h-32 md:w-72 md:h-56 rounded-3xl flex items-center justify-center text-7xl md:text-8xl transition shadow-lg
            ${selected === "FALSE" 
              ? "border-2 border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]" 
              : "bg-white border-2 border-gray-300 hover:border-[#C75C5C] hover:text-[#C75C5C]"
            }`}
          onClick={() => handleSelect("FALSE")}
        >
          X
        </button>
      </div>
      
      {/* 다음/제출 버튼 */}
      <div className="pt-20 md:pt-36 flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          size="lg"
          color="pink"
        >
          {isLastQuestion ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default OxQuiz;