import React, { useState, useEffect } from "react";
import ListFrame from "../../components/ListFrame";
import QuizCard from "../../components/QuizCard";
import QuizModal from "../../components/QuizModal";
import { fetchUserQuizHistory, fetchUserProfile } from "../../api/user";
import { fetchBookDetailById } from "../../api/api"; // 단일 책 정보 API import
import { sampleQuizData } from "../../mocks/mockQuiz"; // 퀴즈 데이터는 여전히 사용

// 퀴즈 히스토리 인터페이스 정의
interface QuizHistoryItem {
  id: number; // 퀴즈 기록 자체의 ID (API 응답에 null일 수 있으므로 주의)
  bookId: number;
  bookTitle: string;
  score: number;
  submittedAt: string;
  author?: string; 
  imageUrl?: string; 
  // correctCount와 totalCount 필드 제거
}

const HistoryMain = () => {
  const [quizHistoryList, setQuizHistoryList] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
    author?: string;
    imageUrl?: string;
  } | null>(null);
  
  // 모달 상태 관리
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // 퀴즈 상태 관리
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        setIsLoading(true);
        
        const userProfile = await fetchUserProfile();
        const userId = userProfile.id;
        
        const historyData = await fetchUserQuizHistory(userId);
        
        // 각 히스토리 항목에 대해 책 상세 정보 조회
        const formattedDataPromises = historyData.map(async (item: any) => {
          let author = '작자미상';
          let imageUrl = '/images/default-book.png';

          try {
            const bookDetail = await fetchBookDetailById(item.bookId);
            if (bookDetail) {
              author = bookDetail.author || author;
              imageUrl = bookDetail.thumbnailUrl || imageUrl;
            }
          } catch (bookDetailError) {
            console.error(`Book ID ${item.bookId} 상세 정보 조회 실패:`, bookDetailError);
            // 책 정보 조회 실패 시 기본값 사용
          }
          
          return {
            id: item.id, // API 응답에 따라 null일 수 있음
            bookId: item.bookId,
            bookTitle: item.bookTitle,
            score: item.score,
            submittedAt: item.submittedAt,
            author,
            imageUrl,
            // correctCount와 totalCount 계산 제거
          };
        });

        const formattedData = await Promise.all(formattedDataPromises);
        
        setQuizHistoryList(formattedData);
      } catch (err) {
        console.error('퀴즈 히스토리 로딩 오류:', err);
        setError('퀴즈 히스토리를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizHistory();
  }, []);

  // 퀴즈 카드 클릭 핸들러
  const handleQuizCardSelect = (book: { id: number; title: string; author?: string; imageUrl?: string }) => {
    setSelectedBook(book);
    setShowQuizModal(true);
    setCurrentQuizIndex(0);
    setSelectedAnswerIndex(undefined); // 초기에는 선택된 답변 없음
  };
  
  // 퀴즈 모달 핸들러들
  const handleQuizClose = () => {
    setShowQuizModal(false);
  };
  
  const handleNextQuiz = () => {
    // sampleQuizData.options.length를 기반으로 하거나, 실제 퀴즈 데이터 길이를 사용해야 합니다.
    // 현재는 예시로 3개의 퀴즈가 있다고 가정 (인덱스 0, 1, 2)
    if (currentQuizIndex < 2) { 
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswerIndex(undefined);
    } else {
      setShowQuizModal(false); // 마지막 퀴즈 후 모달 닫기
    }
  };
  
  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      setSelectedAnswerIndex(undefined); // 이전 문제로 가면 선택 초기화
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="pt-14 md:pt-12 flex justify-center items-center h-[50vh]">
        <p className="text-xl">로딩 중...</p>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="pt-14 md:pt-12 flex justify-center items-center h-[50vh]">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

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
                key={quiz.id || quiz.bookId} // quiz.id가 null일 수 있으므로 bookId를 fallback으로 사용
                id={quiz.bookId}
                title={quiz.bookTitle}
                author={quiz.author || '작자미상'}
                thumbnailUrl={quiz.imageUrl || '/images/default-book.png'}
                score={quiz.score} // correctCount, totalCount 대신 score로 변경
                onQuizSelect={() => handleQuizCardSelect({
                  id: quiz.bookId,
                  title: quiz.bookTitle,
                  author: quiz.author,
                  imageUrl: quiz.imageUrl
                })}
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
          score={quizHistoryList.find(q => q.bookId === selectedBook.id)?.score || 0} // 선택된 책의 점수 찾기
          quizNumber={currentQuizIndex + 1}
          question={sampleQuizData.question} // 실제 퀴즈 데이터로 교체 필요
          options={sampleQuizData.options} // 실제 퀴즈 데이터로 교체 필요
          correctAnswerIndex={sampleQuizData.correctAnswerIndex} // 실제 퀴즈 데이터로 교체 필요
          selectedAnswerIndex={selectedAnswerIndex}
          explanation={sampleQuizData.explanation} // 실제 퀴즈 데이터로 교체 필요
          onClose={handleQuizClose}
          onNext={handleNextQuiz}
          onPrev={handlePrevQuiz}
          isLastQuestion={currentQuizIndex === 2} // 실제 퀴즈 개수에 따라 동적으로 변경 필요
          isFirstQuestion={currentQuizIndex === 0}
        />
      )}
    </div>
  );
};

export default HistoryMain;