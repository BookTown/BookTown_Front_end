import { TrueFalseQuestion } from "./quizTypes";
import { useState } from "react";

interface Props {
  questionData: TrueFalseQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion?: boolean;
}

const OxQuiz = ({ questionData, onAnswer, isLastQuestion = false }: Props) => {
  const [selected, setSelected] = useState<"TRUE" | "FALSE" | null>(null);

  const handleSelect = (value: "TRUE" | "FALSE") => {
    setSelected(value);
  };
  
  const handleSubmit = () => {
    if (selected) {
      onAnswer(selected);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 질문 */}
      <div className="text-lg font-medium text-center px-4 mb-8">
        {questionData.question}
      </div>
      
      {/* O/X 버튼 */}
      <div className="flex justify-center gap-8 mb-8">
        <button
          type="button"
          className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-bold transition
            ${selected === "TRUE" 
              ? "bg-[#C75C5C] text-white" 
              : "bg-white border-2 border-gray-300 hover:border-[#C75C5C]"
            }`}
          onClick={() => handleSelect("TRUE")}
        >
          O
        </button>
        <button
          type="button"
          className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-bold transition
            ${selected === "FALSE" 
              ? "bg-[#C75C5C] text-white" 
              : "bg-white border-2 border-gray-300 hover:border-[#C75C5C]"
            }`}
          onClick={() => handleSelect("FALSE")}
        >
          X
        </button>
      </div>
      
      {/* 다음/제출 버튼 */}
      <div className="w-full max-w-md">
        <button 
          onClick={handleSubmit}
          disabled={!selected}
          className={`w-full h-12 rounded-lg text-white font-medium transition
            ${selected 
              ? "bg-[#C75C5C] hover:bg-[#b54d4d]" 
              : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          {isLastQuestion ? "제출" : "다음"}
        </button>
      </div>
    </div>
  );
};

export default OxQuiz;