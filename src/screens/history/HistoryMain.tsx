import React, { useState, useEffect } from "react";
import ListFrame from "../../components/ListFrame";
import QuizCard from "../../components/QuizCard";
import QuizModal from "../../components/QuizModal";
import QuizHistoryListModal from "../../components/QuizHistoryListModal";
import { fetchUserQuizHistory, fetchUserProfile, fetchBookQuizHistoryDetail } from "../../api/user";
import { fetchBookDetailById } from "../../api/api";
import { QuizHistoryDetail } from "../../interfaces/quizInterface";
import Loader from "../../components/Loader/Loader";

// 새로운 API 응답 형식에 맞는 인터페이스
interface BookHistoryItem {
  bookId: number;
  title: string;
  author: string;
  histories: QuizHistoryItem[];
  imageUrl?: string;
  totalScore?: number;
}

interface QuizHistoryItem {
  id: number;
  bookId: number;
  bookTitle: string;
  score: number;
  submittedAt: string;
  groupIndex: number;
  quizType: string;
}

const HistoryMain = () => {
  const [bookHistoryList, setBookHistoryList] = useState<BookHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  // 모달 상태 관리
  const [showHistorySelectModal, setShowHistorySelectModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // 선택된 책 정보
  const [selectedBook, setSelectedBook] = useState<BookHistoryItem | null>(null);
  
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
        
        // 책 이미지 정보 추가
        const updatedData = await Promise.all(historyData.map(async (book: BookHistoryItem) => {
          try {
            const bookDetail = await fetchBookDetailById(book.bookId);
            if (bookDetail && bookDetail.thumbnailUrl) {
              return {
                ...book,
                imageUrl: bookDetail.thumbnailUrl,
                histories: book.histories  // correctCount 추가 로직 제거
              };
            }
          } catch (error) {
            console.error(`책 ID ${book.bookId}의 세부 정보를 불러오는데 실패했습니다.`, error);
          }
          
          // 책 정보를 불러오는 데 실패한 경우
          return {
            ...book,
            histories: book.histories  // correctCount 추가 로직 제거
          };
        }));
        
        setBookHistoryList(updatedData);
      } catch (err) {
        console.error('퀴즈 히스토리 로딩 오류:', err);
        setError('퀴즈 히스토리를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizHistory();
  }, []);

  // 퀴즈 카드 클릭 핸들러 - 히스토리 선택 모달 표시
  const handleQuizCardSelect = (quiz: { id: number; title: string; author: string; imageUrl: string, }) => {
    // 선택된 책 ID에 해당하는 책 찾기
    const book = bookHistoryList.find(item => item.bookId === quiz.id);
    if (book) {
      setSelectedBook(book);
      setShowHistorySelectModal(true);
    } else {
      console.error(`ID ${quiz.id}에 해당하는 책을 찾을 수 없습니다.`);
    }
  };
  
  // 히스토리 항목 선택 핸들러 - 퀴즈 모달 표시
  const handleHistorySelect = async (bookId: number, groupIndex: number) => {
    if (!userId) {
      console.error("사용자 ID를 찾을 수 없습니다.");
      return;
    }
    
    try {
      setIsLoadingDetail(true);
      
      // API에서 선택한 책과 그룹의 퀴즈 히스토리 상세 정보 로드
      const detailData = await fetchBookQuizHistoryDetail(userId, bookId, groupIndex);
      
      // correctCount 계산 로직 제거
      
      // bookHistoryList 상태 업데이트 로직 제거
      
      // 히스토리 데이터만 설정
      setHistoryData(detailData);
      
      setShowHistorySelectModal(false);
      setShowQuizModal(true);
    } catch (error) {
      console.error("퀴즈 히스토리 상세 정보 로드 실패:", error);
      alert("퀴즈 히스토리 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  // 모달 닫기 핸들러들
  const handleHistorySelectModalClose = () => {
    setShowHistorySelectModal(false);
  };
  
  const handleQuizModalClose = () => {
    setShowQuizModal(false);
    setHistoryData(null);
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-[100dvh] text-2xl">
          <Loader />
          <div className="pt-5">데이터를 불러오는 중...</div>
        </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-[100dvh] text-2xl">데이터를 불러오는데 실패했습니다.</div>
    );
  }

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">내가 푼 퀴즈</h1>
        <p className="text-xl text-[#A39C9C] pb-6">풀었던 퀴즈 목록을 모아봤어요</p>
      </div>
      
      {bookHistoryList.length > 0 ? (
        <ListFrame>
          {bookHistoryList.map((book) => (
            <QuizCard
              key={book.bookId}
              id={book.bookId}
              title={book.title}
              author={book.author || '작자미상'}
              thumbnailUrl={book.imageUrl || '/images/default-book.png'}
              totalScore={book.totalScore}
              onQuizSelect={handleQuizCardSelect}
              size="lg"
            />
          ))}
        </ListFrame>
      ) : (
        <div className="w-full py-10 flex justify-center items-center h-[100dvh]">
          <p className="text-[#9CAAB9] text-2xl">풀었던 퀴즈가 없습니다.</p>
        </div>
      )}
      
      {/* 상세 정보 로딩 중 표시 */}
      {isLoadingDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p className="text-lg">퀴즈 상세 정보를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 퀴즈 히스토리 선택 모달 */}
      {showHistorySelectModal && selectedBook && (
        <QuizHistoryListModal
          bookTitle={selectedBook.title}
          histories={selectedBook.histories}
          onClose={handleHistorySelectModalClose}
          onSelectHistory={handleHistorySelect}
        />
      )}

      {/* 퀴즈 결과 모달 */}
      {showQuizModal && historyData && (
        <QuizModal
          bookTitle={historyData.bookTitle}
          onClose={handleQuizModalClose}
          historyData={historyData}
        />
      )}
    </div>
  );
};

export default HistoryMain;