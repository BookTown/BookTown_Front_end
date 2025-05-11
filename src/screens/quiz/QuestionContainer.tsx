import React from "react";
import { QuestionComponentProps } from "./quizTypes";
import Button from "../../components/Button";

interface QuestionContainerProps {
  questionData: QuestionComponentProps["questionData"];
  current: number;
  score: number;
  isLastQuestion?: boolean;
  onSubmit: () => void;
  isDisabled: boolean;
  children: React.ReactNode;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({
  questionData,
  current,
  score,
  isLastQuestion = false,
  onSubmit,
  isDisabled,
  children,
}) => {
  return (
    <div className="">
      {/* 문제 텍스트 */}
      <p className="text-xl md:text-2xl pb-3">
        Quiz {current}. {questionData.question}
      </p>

      {/* 배점 표시 */}
      <p className="text-lg md:text-xl text-[#9CAAB9] pb-4 md:pb-8">
        배점: {score}점
      </p>

      {/* 문제 내용 - children으로 전달됨 */}
      {children}

      {/* 다음/제출 버튼 */}
      <div className="pt-8 md:pt-28 flex justify-center">
        <Button onClick={onSubmit} disabled={isDisabled} size="lg" color="pink">
          {isLastQuestion ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionContainer;
