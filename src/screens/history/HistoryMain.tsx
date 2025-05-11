import React, { useState, useMemo } from "react";
import ListFrame from "../../components/ListFrame";
import QuizCard from "../../components/QuizCard";
import QuizModal from "../../components/QuizModal";
import { mockQuizHistory } from "../../mocks/mockQuiz";

// 목업 퀴즈 히스토리 응답 형식 - API와 동일한 형식
const sampleQuizDetail = {
  historyId: null,
  bookTitle: "모비 딕",
  totalScore: 50,
  submittedAt: "2025-05-11T04:22:02.619718",
  submissions: [
    {
      question: "고래는 인류의 탐험과 문화를 상징하는 존재로 자리 잡고 있다.",
      userAnswer: "FALSE",
      correctAnswer: "TRUE",
      score: 0,
      correct: false
    },
    {
      question: "이스마엘은 바다의 매력을 이야기하며 물과의 연결이 인간에게 주는 심리적 안정과 회복의 중요성을 강조한다.",
      userAnswer: "TRUE",
      correctAnswer: "TRUE",
      score: 0,
      correct: true
    },
    {
      question: "이스마엘은 물이 인간의 사색과 깊은 연관이 있다고 주장한다.",
      userAnswer: "FALSE",
      correctAnswer: "TRUE",
      score: 0,
      correct: false
    },
    {
      question: "이스마엘은 승객으로서의 삶을 선택했다.",
      userAnswer: "승객",
      correctAnswer: "탑승객",
      score: 0,
      correct: false
    },
    {
      question: "이스마엘은 여관에 도착해 고급스러운 숙소를 찾았다.",
      userAnswer: "이스마엘 숙소",
      correctAnswer: "이스마엘 숙소",
      score: 0,
      correct: true
    },
    {
      question: "이스마엘은 하포니어와 같은 방을 쓰는 것에 대해 불안해하고 있다.",
      userAnswer: "FALSE",
      correctAnswer: "TRUE",
      score: 0,
      correct: false
    },
    {
      question: "이스마엘은 처음에 퀴퀘그의 외모에 두려움을 느꼈다.",
      userAnswer: "TRUE",
      correctAnswer: "TRUE",
      score: 0,
      correct: true
    },
    {
      question: "이스마엘과 퀴퀘그는 같은 배에 타고 조업을 시작한다.",
      userAnswer: "FALSE",
      correctAnswer: "TRUE",
      score: 0,
      correct: false
    },
    {
      question: "두 사람은 고래잡이의 위험과 두려움을 경험하며 서로의 존재가 큰 힘이 됨을 느꼈다.",
      userAnswer: "TRUE",
      correctAnswer: "TRUE",
      score: 0,
      correct: true
    },
    {
      question: "이스마엘과 퀴퀘그는 피쿼드 호에 승선하게 된다.",
      userAnswer: "FALSE",
      correctAnswer: "TRUE",
      score: 0,
      correct: false
    }
  ]
};

const HistoryMain = () => {
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
    author: string;
    imageUrl: string;
  } | null>(null);
  
  // 모달 상태 관리
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // 퀴즈 상태 관리 (실제로는 API 호출로 가져올 데이터)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | undefined>(undefined);

  // mockQuiz에서 데이터 가져오기 (고정된 점수 사용)
  const quizHistoryList = useMemo(() => {
    return mockQuizHistory.slice(0, 10).map((quiz, index) => ({
      id: index + 1,
      bookId: quiz.id,
      title: quiz.title,
      author: quiz.author,
      imageUrl: quiz.imageUrl,
      score: quiz.score,
      solvedAt: new Date(Date.now() - index * 86400000).toISOString(),
    }));
  }, []);

  // 퀴즈 카드 클릭 핸들러
  const handleQuizCardSelect = (book: { id: number; title: string; author: string; imageUrl: string }) => {
    setSelectedBook(book);
    setShowQuizModal(true); // QuizModal 표시
    
    // 실제 구현에서는 여기서 해당 책의 퀴즈 데이터를 불러올 수 있음
    setCurrentQuizIndex(0);
    setSelectedAnswerIndex(1); // 예시로 특정 답변 선택 상태로 설정
  };
  

  // 퀴즈 모달 핸들러
  const handleQuizClose = () => {
    setShowQuizModal(false);
  };
  
  const handleNextQuiz = () => {
    // 다음 퀴즈로 이동하는 로직
    if (currentQuizIndex < sampleQuizDetail.submissions.length - 1) { 
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswerIndex(undefined); // 새 퀴즈에서는 선택 초기화
    } else {
      setShowQuizModal(false); // 마지막 퀴즈면 모달 닫기
    }
  };
  
  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">내가 푼 퀴즈</h1>
        <p className="text-xl text-[#A39C9C] pb-6">풀었던 퀴즈 목록을 모아봤어요</p>
      </div>
      
      <ListFrame>
        {quizHistoryList.length > 0 
          ? quizHistoryList.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.bookId}
                title={quiz.title}
                author={quiz.author}
                thumbnailUrl={quiz.imageUrl}
                score={quiz.score}
                onQuizSelect={handleQuizCardSelect} // 수정된 핸들러 사용
                size="lg"
              />
            ))
          : [
              <div className="w-full text-center py-10" key="no-history">
                <p className="text-[#9CAAB9]">풀었던 퀴즈가 없습니다.</p>
              </div>
            ]
        }
      </ListFrame>
      
      {/* 퀴즈 모달 */}
      {showQuizModal && selectedBook && (
        <QuizModal
          bookTitle={selectedBook.title}
          score={Math.floor(Math.random() * 50) + 50} // 예시 점수
          quizNumber={currentQuizIndex + 1}
          submission={sampleQuizDetail.submissions[currentQuizIndex]}
          onClose={handleQuizClose}
          onNext={handleNextQuiz}
          onPrev={handlePrevQuiz}
          isLastQuestion={currentQuizIndex === sampleQuizDetail.submissions.length - 1}
          isFirstQuestion={currentQuizIndex === 0}
        />
      )}
    </div>
  );
};

export default HistoryMain;