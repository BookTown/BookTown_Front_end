import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizQuestion } from "./quizTypes";
import MultipleChoice from "./MultipleChoice";
import ShortAnswer from "./ShortAnswer";
import OxQuiz from "./OxQuiz";
import ScoreModal from "./ScoreModal";
import ProgressBar from "../../components/ProgressBar";
import { generateQuiz, submitQuizAnswers } from "../../api/api";
import TopTitle from "../../components/TopTitle";

interface UserAnswer {
  quizId: number;
  userAnswer: string;
}

interface QuizParams {
  bookId?: number;
  type: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "TRUE_FALSE";
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { quizData, quizParams } = location.state || {} as { 
    quizData?: QuizQuestion[], 
    quizParams?: QuizParams 
  };

  const [quizList, setQuizList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const currentQuestion = quizList[currentIndex];
  const isLastQuestion = currentIndex === quizList.length - 1;

  // 퀴즈 데이터 로드
  useEffect(() => {
    const fetchQuizData = async () => {
      // 이미 퀴즈 데이터가 있는 경우
      if (quizData) {
        console.log('이미 생성된 퀴즈 데이터 사용:', quizData);
        setQuizList(quizData);
        setIsLoading(false);
        return;
      }
      
      // 퀴즈 파라미터가 없으면 에러
      if (!quizParams) {
        console.error('퀴즈 파라미터가 없습니다');
        setApiError('퀴즈 생성에 필요한 정보가 없습니다');
        setIsLoading(false);
        return;
      }

      try {
        console.log('퀴즈 생성 API 호출 시작:', quizParams);
        const { bookId, type, difficulty } = quizParams;
        
        // API 호출
        const result = await generateQuiz(bookId, type, difficulty);
        
        console.log('퀴즈 생성 완료:', result);
        setQuizList(result);
      } catch (error) {
        console.error('퀴즈 생성 중 오류 발생:', error);
        setApiError('퀴즈 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [quizData, quizParams, navigate]);

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return;
    
    // 사용자 답변 저장
    const newAnswer: UserAnswer = {
      quizId: currentQuestion.id,
      userAnswer: answer
    };
    
    setUserAnswers(prev => [...prev, newAnswer]);
    
    // 클라이언트 측에서 점수 계산
    if (answer.trim().toUpperCase() === currentQuestion.correctAnswer.trim().toUpperCase()) {
      setScore(prev => prev + currentQuestion.score);
    }
  
    // 마지막 문제인 경우 결과 표시
    if (isLastQuestion) {
      try {
        setIsSubmitting(true);
        
        // 모든 답변을 서버에 제출
        const allAnswers = [...userAnswers, newAnswer];
        
        // 수정된 부분: API 요청 형식을 배열로 바꿈
        const submissionData = allAnswers.map(item => ({
          quizId: item.quizId,
          answer: item.userAnswer
        }));
        
        // 배열 자체를 전달 (객체에 감싸지 않음)
        const result = await submitQuizAnswers(submissionData);
        
        // 서버 응답에 correctAnswers 배열 포함 (true/false 배열)
        const quizResultData = {
          score: result?.score || score,
          totalScore: quizList.reduce((sum, q) => sum + q.score, 0),
          correctCount: result?.correctAnswers?.filter(Boolean).length || 
          allAnswers.filter(a => {
            const question = quizList.find(q => q.id === a.quizId);
            return question?.correctAnswer.trim().toUpperCase() === a.userAnswer.trim().toUpperCase();
          }).length,
          totalQuestions: quizList.length,
          correctAnswers: result?.correctAnswers || [], // 서버에서 받은 정답 여부 배열
          userSubmissions: allAnswers // 사용자가 제출한 답변
        };
        
        setQuizResult(quizResultData);      
        setShowResult(true);
      } catch (error) {
        console.error("퀴즈 제출 중 오류 발생:", error);
        setShowResult(true); 
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // 결과 모달 닫기 후 홈으로 이동
  const handleResultClose = () => {
    navigate("/home");
  };

  // 로딩 중 상태 표시
  if (isLoading || isSubmitting) {
    return (
      <>
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
        </div>
      </>
    );
  }

  // API 에러 발생 시
  if (apiError) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">{apiError}</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#C75C5C] text-white rounded-lg"
            >
              돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  // 퀴즈가 비어있는 경우
  if (!quizList.length) {
    return (
      <>
        <div className="pt-28 text-center">
          <p className="text-lg">이용 가능한 퀴즈가 없습니다.</p>
          <button 
            onClick={() => navigate("/home")}
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
        key={`question-${currentQuestion.id}-${currentIndex}`}
        questionData={currentQuestion as any} 
        onAnswer={handleAnswer} 
        isLastQuestion={isLastQuestion}
        current={currentIndex + 1}
      />
    ),
    SHORT_ANSWER: (
      <ShortAnswer 
        key={`question-${currentQuestion.id}-${currentIndex}`}
        questionData={currentQuestion as any} 
        onAnswer={handleAnswer} 
        isLastQuestion={isLastQuestion}
        current={currentIndex + 1}
      />
    ),
    TRUE_FALSE: (
      <OxQuiz 
        key={`question-${currentQuestion.id}-${currentIndex}`}
        questionData={currentQuestion as any} 
        onAnswer={handleAnswer} 
        isLastQuestion={isLastQuestion}
        current={currentIndex + 1}
      />
    )
  };

  return (
    <>
      <TopTitle />
      <div className="pt-24 md:w-[650px] px-6 md:mx-auto">
        <ProgressBar current={currentIndex + 1} total={quizList.length} />
        
        <div className="mt-8 md:mt-10">
          {currentQuestion ? quizTypeMap[currentQuestion.questionType] : null}
        </div>

        {showResult && (
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

export default Quiz;