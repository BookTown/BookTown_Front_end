import React, { useState, useMemo } from "react";
import ListFrame from "../../components/ListFrame";
import QuizCard from "../../components/QuizCard";
import BookModal from "../../components/BookModal";
import { mockQuizHistory } from "../../mocks/mockQuiz";

const HistoryMain = () => {
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
    author: string;
    imageUrl: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // mockQuiz에서 데이터 가져오기 (고정된 점수 사용)
  const quizHistoryList = useMemo(() => {
    return mockQuizHistory.slice(0, 10).map((quiz, index) => ({
      id: index + 1,
      bookId: quiz.id,
      title: quiz.title,
      author: quiz.author,
      imageUrl: quiz.imageUrl,
      correctCount: quiz.correctCount, // mockQuiz의 correctCount 값 사용
      totalCount: 10,
      solvedAt: new Date(Date.now() - index * 86400000).toISOString(),
    }));
  }, []); // 의존성 배열이 비어있어 컴포넌트 마운트 시 한 번만 생성됨

  // 책 선택 시 모달 표시
  const handleBookSelect = (book: { id: number; title: string; author: string; imageUrl: string }) => {
    setSelectedBook(book);
    setShowModal(true);
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
                onQuizSelect={handleBookSelect}
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
      
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default HistoryMain;