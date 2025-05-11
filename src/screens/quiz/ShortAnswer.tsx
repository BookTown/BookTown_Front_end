import React, { useState } from "react";
import { ShortAnswerQuestion, QuestionComponentProps } from "./quizTypes";
import QuestionContainer from "./QuestionContainer";

const ShortAnswer: React.FC<QuestionComponentProps> = ({
  questionData,
  onAnswer,
  isLastQuestion = false,
  current,
  score,
}) => {
  const [input, setInput] = useState("");
  const typedQuestionData = questionData as ShortAnswerQuestion;

  const handleSubmit = () => {
    if (input.trim()) {
      onAnswer(input);
    }
  };

  // 정답 글자 수에 따른 힌트 생성 함수
  const getHintText = () => {
    if (!typedQuestionData.correctAnswer) return "정답을 입력하세요";
    
    const answerLength = typedQuestionData.correctAnswer.trim().length;
    
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
    <QuestionContainer
      questionData={questionData}
      current={current}
      score={score}
      isLastQuestion={isLastQuestion}
      onSubmit={handleSubmit}
      isDisabled={!input.trim()}
    >
      <div className="flex justify-center pt-24">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-80 md:w-10/12 h-12 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75C5C] focus:border-transparent text-center shadow-md text-xl"
          placeholder={getHintText()}
        />
      </div>
    </QuestionContainer>
  );
};

export default ShortAnswer;