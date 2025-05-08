import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopTitle from "../../components/TopTitle";
import { QuizQuestion } from "./quizTypes";
import MultipleChoice from "./MultipleChoice";
import ShortAnswer from "./ShortAnswer";
import OxQuiz from "./OxQuiz";
import ScoreModal from "./ScoreModal";
import ProgressBar from "../../components/ProgressBar";
import quizMockData from "../../mocks/quizMockData";
import { Loader2 } from "lucide-react";

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, difficulty } = location.state || {};

  const [quizList, setQuizList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentQuestion = quizList[currentIndex];
  const isLastQuestion = currentIndex === quizList.length - 1;

  // 퀴즈 데이터 불러오기
  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        // 실제 API 호출이라면 이런 형태
        // const data = await fetchQuizQuestions(difficulty, type);
        // setQuizList(data);

        // 모의 데이터로 지연 시간 시뮬레이션
        setTimeout(() => {
          const filteredQuizzes = type 
            ? quizMockData.filter(q => q.questionType === type && q.difficulty === difficulty)
            : quizMockData;
            
          setQuizList(filteredQuizzes.slice(0, 10)); // 최대 10문제만
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error("퀴즈 데이터 로딩 실패:", error);
        alert("퀴즈 데이터를 불러오는데 실패했습니다.");
        navigate("/");
      }
    };

    fetchQuizData();
  }, [type, difficulty, navigate]);

  const handleAnswer = (answer: string) => {
    // 정답 확인
    if (currentQuestion && answer.trim().toUpperCase() === currentQuestion.correctAnswer.trim().toUpperCase()) {
      setScore((prev) => prev + currentQuestion.score);
    }

    // 마지막 문제인지 확인
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 결과 모달 닫기 후 홈으로 이동
  const handleResultClose = () => {
    navigate("/home");
  };

  // 로딩 중 상태 표시
  if (isLoading) {
    return (
      <>
        <TopTitle />
        <div className="pt-28 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C75C5C]" />
          <p className="mt-4 text-lg text-center">퀴즈를 준비하는 중입니다...</p>
        </div>
      </>
    );
  }

  // 퀴즈가 비어있는 경우
  if (!quizList.length) {
    return (
      <>
        <TopTitle />
        <div className="pt-28 text-center">
          <p className="text-lg">이용 가능한 퀴즈가 없습니다.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-[#C75C5C] text-white rounded-lg"
          >
            홈으로 돌아가기
          </button>
        </div>
      </>
    );
  }

  const quizTypeMap: Record<string, React.ReactElement> = {
    MULTIPLE_CHOICE: (
      <MultipleChoice 
        questionData={currentQuestion as any} 
        onAnswer={handleAnswer} 
        isLastQuestion={isLastQuestion} 
      />
    ),
    SHORT_ANSWER: (
      <ShortAnswer 
        questionData={currentQuestion as any} 
        onAnswer={handleAnswer} 
        isLastQuestion={isLastQuestion}
      />
    ),
    TRUE_FALSE: (
      <OxQuiz 
        questionData={currentQuestion as any} 
        onAnswer={handleAnswer} 
        isLastQuestion={isLastQuestion}
      />
    )
  };

  return (
    <>
      <TopTitle />
      <div className="pt-28 p-6 max-w-xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-4">
          문제 {currentIndex + 1} / {quizList.length}
        </h2>
        <ProgressBar current={currentIndex + 1} total={quizList.length} />
        
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md min-h-[350px]">
          {currentQuestion ? quizTypeMap[currentQuestion.questionType] : null}
        </div>

        {showResult && (
          <ScoreModal
            score={score}
            total={quizList.reduce((sum, q) => sum + q.score, 0)}
            onClose={handleResultClose}
          />
        )}
      </div>
    </>
  );
};

export default Quiz;