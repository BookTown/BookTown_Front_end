import React, { useState } from "react";
import {  QuestionComponentProps } from "./quizTypes";
import QuestionContainer from "./QuestionContainer";

const OxQuiz: React.FC<QuestionComponentProps> = ({
  questionData,
  onAnswer,
  isLastQuestion = false,
  current,
  score,
}) => {
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
    <QuestionContainer
      questionData={questionData}
      current={current}
      score={score}
      isLastQuestion={isLastQuestion}
      onSubmit={handleSubmit}
      isDisabled={!selected}
    >
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
          className={`w-36 h-32 md:w-64 md:h-48 rounded-3xl flex items-center justify-center text-7xl md:text-8xl transition shadow-lg
            ${selected === "FALSE" 
              ? "border-2 border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]" 
              : "bg-white border-2 border-gray-300 hover:border-[#C75C5C] hover:text-[#C75C5C]"
            }`}
          onClick={() => handleSelect("FALSE")}
        >
          X
        </button>
      </div>
    </QuestionContainer>
  );
};

export default OxQuiz;