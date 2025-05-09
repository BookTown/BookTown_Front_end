import { ShortAnswerQuestion } from "./quizTypes";
import { useState } from "react";
import Button from "../../components/Button";

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

  // 정답 글자 수에 따른 힌트 생성 함수
  const getHintText = () => {
    if (!questionData.correctAnswer) return "정답을 입력하세요";
    
    const answerLength = questionData.correctAnswer.trim().length;
    
    // 한글로 글자 수 표현
    const numberToKorean: Record<number, string> = {
      1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 
      6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열"
    };
    
    if (answerLength > 10) {
      return `${answerLength} 글자`;
    }
    
    return `${numberToKorean[answerLength] || answerLength} 글자`;
  };

  return (
    <div className="">
      {/* 문제 텍스트 */}
      <p className="text-xl md:text-2xl pb-28 md:pb-32">Q. {questionData.question}</p>
      
      <div className="flex justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-80 md:w-10/12 h-12 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75C5C] focus:border-transparent text-center shadow-md text-xl"
          placeholder={getHintText()}
        />
      </div>
      
      {/* 다음/제출 버튼 */}
      <div className="pt-36 md:pt-44 flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          size="lg"
          color="pink"
        >
          {isLastQuestion ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default ShortAnswer;