import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopTitle from "../../components/TopTitle";
import ProgressBar from "../../components/ProgressBar";
import { generateQuiz, submitQuizAnswers } from "../../api/api";
import { QuizQuestion, UserAnswer, QuizParams, QuizResult } from "./quizTypes";
import MultipleChoice from "./MultipleChoice";
import ShortAnswer from "./ShortAnswer";
import OxQuiz from "./OxQuiz";
import ScoreModal from "./ScoreModal";
import { mockMotivation } from "../../mocks/mockMotivation";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { quizData, quizParams } =
    location.state ||
    ({} as {
      quizData?: QuizQuestion[];
      quizParams?: QuizParams;
    });

  const [quizList, setQuizList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const currentQuestion = quizList[currentIndex];
  const isLastQuestion = currentIndex === quizList.length - 1;

  // 퀴즈 데이터 로드
  useEffect(() => {
    const fetchQuizData = async () => {
      if (quizData) {
        setQuizList(quizData);
        setIsLoading(false);
        return;
      }

      if (!quizParams) {
        setApiError("퀴즈 생성에 필요한 정보가 없습니다");
        setIsLoading(false);
        return;
      }

      try {
        const { bookId, type, difficulty } = quizParams;
        const result = await generateQuiz(bookId, type, difficulty);
        setQuizList(result);
      } catch (error) {
        setApiError("퀴즈 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [quizData, quizParams]);

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return;

    const newAnswer: UserAnswer = {
      quizId: currentQuestion.id,
      userAnswer: answer,
    };

    setUserAnswers((prev) => [...prev, newAnswer]);

    // 클라이언트 측에서 점수 계산
    const isCorrect =
      answer.trim().toUpperCase() ===
      currentQuestion.correctAnswer.trim().toUpperCase();
    const updatedScore = isCorrect ? score + currentQuestion.score : score;

    setScore(updatedScore);

    // 마지막 문제인 경우 결과 표시
    if (isLastQuestion) {
      // 마지막 점수가 즉시 반영되도록 업데이트된 점수 사용
      await handleQuizSubmission(newAnswer, updatedScore);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 퀴즈 제출 및 채점 처리
  const handleQuizSubmission = async (
    newAnswer: UserAnswer,
    finalScore: number
  ) => {
    try {
      setIsSubmitting(true);

      // 모든 답변을 서버에 제출
      const allAnswers = [...userAnswers, newAnswer];

      // API 요청 형식을 배열로 변환
      const submissionData = allAnswers.map((item) => ({
        quizId: item.quizId,
        answer: item.userAnswer,
      }));

      const result = await submitQuizAnswers(submissionData);

      // 결과 데이터 구성
      const totalScore = quizList.reduce((sum, q) => sum + q.score, 0);

      const quizResultData: QuizResult = {
        score: result?.score || finalScore, // 업데이트된 점수 사용
        totalScore: totalScore,
        correctCount:
          result?.correctAnswers?.filter(Boolean).length ||
          calculateCorrectAnswersCount(allAnswers),
        totalQuestions: quizList.length,
        correctAnswers: result?.correctAnswers || [],
        userSubmissions: allAnswers,
      };

      setQuizResult(quizResultData);
    } catch (error) {
      console.error("퀴즈 제출 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
      setShowResult(true);
    }
  };

  // 클라이언트 측에서 정답 개수 계산
  const calculateCorrectAnswersCount = (answers: UserAnswer[]): number => {
    return answers.filter((a) => {
      const question = quizList.find((q) => q.id === a.quizId);
      return (
        question?.correctAnswer.trim().toUpperCase() ===
        a.userAnswer.trim().toUpperCase()
      );
    }).length;
  };

  // 결과 모달 닫기 후 홈으로 이동
  const handleResultClose = () => {
    navigate("/home");
  };

  if (isLoading || isSubmitting) {
    return renderLoadingState(isSubmitting);
  }

  if (apiError) {
    return renderErrorState(apiError, () => navigate(-1));
  }

  if (!quizList.length) {
    return renderEmptyState(() => navigate("/home"));
  }

  const quizTypeMap: Record<string, React.ReactElement> = {
    MULTIPLE_CHOICE: (
      <MultipleChoice
        key={`question-${currentQuestion.id}-${currentIndex}`}
        questionData={currentQuestion}
        onAnswer={handleAnswer}
        isLastQuestion={isLastQuestion}
        current={currentIndex + 1}
        score={currentQuestion.score}
      />
    ),
    SHORT_ANSWER: (
      <ShortAnswer
        key={`question-${currentQuestion.id}-${currentIndex}`}
        questionData={currentQuestion}
        onAnswer={handleAnswer}
        isLastQuestion={isLastQuestion}
        current={currentIndex + 1}
        score={currentQuestion.score}
      />
    ),
    TRUE_FALSE: (
      <OxQuiz
        key={`question-${currentQuestion.id}-${currentIndex}`}
        questionData={currentQuestion}
        onAnswer={handleAnswer}
        isLastQuestion={isLastQuestion}
        current={currentIndex + 1}
        score={currentQuestion.score}
      />
    ),
  };

  return (
    <>
      <TopTitle bookId={quizParams?.bookId} />
      <div className="pt-1 md:pt-9 md:w-[650px] px-6 md:mx-auto">
        <ProgressBar current={currentIndex + 1} total={quizList.length} />

        <div className="mt-8 md:mt-10">
          {currentQuestion ? quizTypeMap[currentQuestion.questionType] : null}
        </div>

        {showResult && quizResult && (
          <ScoreModal
            score={score}
            total={quizList.reduce((sum, q) => sum + q.score, 0)}
            onClose={handleResultClose}
            quizResult={quizResult}
          />
        )}
      </div>
    </>
  );
};

// 로딩 상태 렌더링 함수
function renderLoadingState(isSubmitting: boolean) {
  // 랜덤 동기부여 문구 선택
  const randomIndex = Math.floor(Math.random() * mockMotivation.length);
  const randomMotivation = mockMotivation[randomIndex];

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="w-64 h-64 md:w-96 md:h-96">
        <img
          src="/images/Loader.gif"
          alt="북타운 마스코트"
          className="w-full h-full"
        />
      </div>
      <p className="mt-4 text-2xl md:text-5xl text-center">
        {isSubmitting ? "퀴즈 채점중..." : "고을이가 문제 생성중..."}
      </p>
      <p className="text-lg md:text-xl text-center text-[#9CAAB9] mb-6">
        <br />
        🗣 "{randomMotivation.motivation}"
        <br />
        {randomMotivation.characters}, {"<"}{randomMotivation.title}{">"}
      </p>
    </div>
  );
}

// 에러 상태 렌더링 함수
function renderErrorState(errorMessage: string, onBackClick: () => void) {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="text-center">
        <p className="text-xl text-red-500 mb-4">{errorMessage}</p>
        <button
          onClick={onBackClick}
          className="px-4 py-2 bg-[#C75C5C] text-white rounded-lg"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

// 빈 상태 렌더링 함수
function renderEmptyState(onHomeClick: () => void) {
  return (
    <div className="pt-28 text-center">
      <p className="text-lg">이용 가능한 퀴즈가 없습니다.</p>
      <button
        onClick={onHomeClick}
        className="mt-4 px-4 py-2 bg-[#C75C5C] text-white rounded-lg"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default Quiz;