import React, { useState, useMemo } from "react";
import ListFrame from "../../components/ListFrame";
import QuizCard from "../../components/QuizCard";
import QuizModal from "../../components/QuizModal";
import { mockQuizHistory } from "../../mocks/mockQuiz";

// 샘플 퀴즈 데이터
const sampleQuizData = {
  question: "돈키호테가 처음으로 만난 사람은 누구인가?",
  options: [
    { id: 1, text: "산초 판자", index: 0 },
    { id: 2, text: "로시난테", index: 1 },
    { id: 3, text: "귀족", index: 2 },
    { id: 4, text: "사냥꾼", index: 3 }
  ],
  correctAnswerIndex: 2,
  explanation: "돈키호테는 모험을 시작한 후 처음으로 귀족을 만나게 됩니다."
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
      correctCount: quiz.correctCount,
      totalCount: 10,
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
    // 다음 퀴즈로 이동하는 로직 (실제로는 여러 퀴즈 데이터가 있을 경우)
    if (currentQuizIndex < 2) { // 예시로 최대 3개 퀴즈로 제한
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
                correctCount={quiz.correctCount}
                totalCount={quiz.totalCount}
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
          question={sampleQuizData.question}
          options={sampleQuizData.options}
          correctAnswerIndex={sampleQuizData.correctAnswerIndex}
          selectedAnswerIndex={selectedAnswerIndex}
          explanation={sampleQuizData.explanation}
          onClose={handleQuizClose}
          onNext={handleNextQuiz}
          onPrev={handlePrevQuiz}
          isLastQuestion={currentQuizIndex === 2} // 예시로 3번째가 마지막
        />
      )}
    </div>
  );
};

export default HistoryMain;