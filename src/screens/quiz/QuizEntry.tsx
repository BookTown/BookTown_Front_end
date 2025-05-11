import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Difficulty, QuestionType } from "./quizTypes";

interface QuizTypeOption {
  label: string;
  value: QuestionType;
}

interface DifficultyOption {
  label: string;
  value: Difficulty;
}

const QuizEntry: React.FC = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [step, setStep] = useState<"difficulty" | "type">("difficulty");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [type, setType] = useState<QuestionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const difficultyOptions: DifficultyOption[] = [
    { value: "EASY", label: "쉬움" },
    { value: "MEDIUM", label: "보통" },
    { value: "HARD", label: "어려움" },
  ];

  const quizTypeOptions: QuizTypeOption[] = [
    { value: "MULTIPLE_CHOICE", label: "객관식" },
    { value: "SHORT_ANSWER", label: "주관식" },
    { value: "TRUE_FALSE", label: "O/X" },
  ];

  // 퀴즈 시작 함수
  const handleSubmit = () => {
    if (difficulty && type) {
      setIsLoading(true);
      const numericBookId = bookId ? parseInt(bookId) : undefined;

      // 퀴즈 화면으로 이동
      navigate("/quiz", {
        state: {
          quizParams: {
            bookId: numericBookId,
            type,
            difficulty,
          },
        },
      });
    }
  };

  // 뒤로 가기 버튼 처리
  const handleBack = () => {
    if (step === "type") {
      setStep("difficulty");
      setType(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] pt-4 px-4 md:px-2 md:pt-10">
      {/* 뒤로 가기 버튼 */}
      <div>
        <button
          onClick={handleBack}
          className="rounded-full hover:bg-gray-200/70 transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeft size={32} />
        </button>
      </div>

      {/* 북타운 마스코트 */}
      <div className="flex flex-col items-center justify-center mt-6 md:mt-10 mb-8">
        <div className="w-64 h-64 md:w-80 md:h-80">
          <img
            src="/images/Loader.gif"
            alt="북타운 마스코트"
            className="w-full h-full"
          />
        </div>

        {/* 안내 텍스트 */}
        <p className="text-4xl md:text-5xl mt-5 md:mt-10 text-center">
          {step === "difficulty"
            ? "난이도를 골라주세요 !!"
            : "퀴즈 유형을 골라주세요 !!"}
        </p>
        <p className="text-lg md:text-xl text-center text-[#9CAAB9] mb-6">
          퀴즈 난이도와 유형에 따라 점수가 조금씩 달라요!
          <br />
          어려운 문제일수록 점수가 더 높아요 🧠✨
        </p>

        {/* 선택 버튼 영역 */}
        <div className="flex flex-col items-center">
          {step === "difficulty" ? (
            <DifficultySelection
              options={difficultyOptions}
              selectedValue={difficulty}
              onSelect={setDifficulty}
              onNext={() => setStep("type")}
            />
          ) : (
            <QuizTypeSelection
              options={quizTypeOptions}
              selectedValue={type}
              onSelect={setType}
              onPrevious={() => {
                setStep("difficulty");
                setType(null);
              }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface DifficultySelectionProps {
  options: DifficultyOption[];
  selectedValue: Difficulty | null;
  onSelect: (value: Difficulty) => void;
  onNext: () => void;
}

const DifficultySelection: React.FC<DifficultySelectionProps> = ({
  options,
  selectedValue,
  onSelect,
  onNext,
}) => {
  return (
    <>
      <div className="flex justify-center gap-4 mb-10 md:mb-14">
        {options.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-2xl border-2 ${
              selectedValue === value
                ? "border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]"
                : "border-black bg-white text-black hover:border-[#C75C5C] hover:text-[#C75C5C]"
            } flex items-center justify-center text-3xl md:text-4xl shadow-xl`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 md:gap-8">
        <div className="w-40 h-10 md:w-48 md:h-12"></div>
        <button
          onClick={onNext}
          disabled={!selectedValue}
          className={`w-40 h-10 md:w-48 md:h-12 rounded-xl text-xl md:text-2xl bg-[#C75C5C] text-white transition-all duration-200 ease-in-out shadow-lg ${
            selectedValue
              ? " hover:bg-[#b54d4d] cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-lg"
              : "opacity-50 transform-none cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </>
  );
};

interface QuizTypeSelectionProps {
  options: QuizTypeOption[];
  selectedValue: QuestionType | null;
  onSelect: (value: QuestionType) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const QuizTypeSelection: React.FC<QuizTypeSelectionProps> = ({
  options,
  selectedValue,
  onSelect,
  onPrevious,
  onSubmit,
  isLoading,
}) => {
  return (
    <>
      <div className="flex justify-center gap-4 mb-8 md:mb-14">
        {options.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-2xl border-2 ${
              selectedValue === value
                ? "border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]"
                : "border-black bg-white text-black hover:border-[#C75C5C] hover:text-[#C75C5C]"
            } flex items-center justify-center text-3xl md:text-4xl shadow-xl`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 md:gap-8">
        <button
          onClick={onPrevious}
          className="w-40 h-10 md:w-48 md:h-12 rounded-xl text-xl md:text-2xl bg-white text-[#C75C5C] 
          border-2 border-[#C75C5C] transition-all duration-200 ease-in-out 
          shadow-lg hover:bg-[#FDECEC] cursor-pointer hover:scale-[1.02] 
          hover:shadow-xl active:scale-[0.98] active:shadow-lg"
        >
          이전
        </button>

        <button
          onClick={onSubmit}
          disabled={!selectedValue || isLoading}
          className={`w-40 h-10 md:w-48 md:h-12 rounded-xl text-xl md:text-2xl bg-[#C75C5C] text-white transition-all duration-200 ease-in-out shadow-lg ${
            selectedValue && !isLoading
              ? " hover:bg-[#b54d4d] cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-lg"
              : "opacity-50 transform-none cursor-not-allowed"
          }`}
        >
          퀴즈 시작
        </button>
      </div>
    </>
  );
};

export default QuizEntry;
