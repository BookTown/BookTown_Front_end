import React, { useState, useEffect } from "react";
import ListFrame from "../../components/ListFrame";
import QuizCard from "../../components/QuizCard";
import QuizModal from "../../components/QuizModal";
import { fetchUserQuizHistory, fetchUserProfile, fetchBookQuizHistoryDetail } from "../../api/user";
import { fetchBookDetailById } from "../../api/api";
import { QuizHistoryDetail } from "../../interfaces/quizInterface";

// 퀴즈 히스토리 인터페이스 정의
interface QuizHistoryItem {
  id: number; // 퀴즈 기록 자체의 ID (API 응답에 null일 수 있으므로 주의)
  bookId: number;
  bookTitle: string;
  score: number;
  submittedAt: string;
  author?: string; 
  imageUrl?: string; 
}

const HistoryMain = () => {
  const [quizHistoryList, setQuizHistoryList] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
    author?: string;
    imageUrl?: string;
  } | null>(null);
  
  // 모달 상태 관리
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // API로 불러온 퀴즈 상세 데이터
  const [historyData, setHistoryData] = useState<QuizHistoryDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        setIsLoading(true);
        
        const userProfile = await fetchUserProfile();
        const userId = userProfile.id;
        setUserId(userId); // 사용자 ID 저장
        
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

  // 퀴즈 카드 클릭 핸들러 - API 호출 추가
  const handleQuizCardSelect = async (book: { id: number; title: string; author?: string; imageUrl?: string }) => {
    if (!userId) {
      console.error("사용자 ID를 찾을 수 없습니다.");
      return;
    }
    
    try {
      setIsLoadingDetail(true);
      setSelectedBook(book);
      
      // API에서 선택한 책의 퀴즈 히스토리 상세 정보 로드
      const detailData = await fetchBookQuizHistoryDetail(userId, book.id);
      setHistoryData(detailData);
      setShowQuizModal(true);
    } catch (error) {
      console.error("퀴즈 히스토리 상세 정보 로드 실패:", error);
      alert("퀴즈 히스토리 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  // 퀴즈 모달 핸들러들
  const handleQuizClose = () => {
    setShowQuizModal(false);
    setHistoryData(null); // 모달을 닫을 때 히스토리 데이터 초기화
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
                score={quiz.score}
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
      
      {/* 상세 정보 로딩 중 표시 */}
      {isLoadingDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p className="text-lg">퀴즈 상세 정보를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 퀴즈 모달 - API 데이터 전달 */}
      {showQuizModal && selectedBook && (
        <QuizModal
          bookTitle={selectedBook.title}
          score={quizHistoryList.find(q => q.bookId === selectedBook.id)?.score || 0}
          quizNumber={1} // API 데이터를 사용할 때는 사용되지 않음
          question="" // API 데이터를 사용할 때는 사용되지 않음
          options={[]} // API 데이터를 사용할 때는 사용되지 않음
          correctAnswerIndex={0} // API 데이터를 사용할 때는 사용되지 않음
          onClose={handleQuizClose}
          onNext={() => {}} // API 데이터 사용 시 컴포넌트 내부에서 처리함
          onPrev={() => {}} // API 데이터 사용 시 컴포넌트 내부에서 처리함
          historyData={historyData || undefined}
        />
      )}
    </div>
  );
};

export default HistoryMain;