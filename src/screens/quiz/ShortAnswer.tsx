import { ShortAnswerQuestion } from "./quizTypes";
import { useState } from "react";

interface Props {
  questionData: ShortAnswerQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion?: boolean;
}

const ShortAnswer = ({ questionData, onAnswer, isLastQuestion = false }: Props) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      onAnswer(input);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg md:text-xl">{questionData.question}</p>
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75C5C]"
        placeholder="정답을 입력하세요"
      />
      
      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        className={`w-full py-3 rounded-lg text-white font-medium transition
          ${input.trim() 
            ? "bg-[#C75C5C] hover:bg-[#b54d4d]" 
            : "bg-gray-300 cursor-not-allowed"
          }`}
      >
        {isLastQuestion ? "제출" : "다음"}
      </button>
    </div>
  );
};

export default ShortAnswer;