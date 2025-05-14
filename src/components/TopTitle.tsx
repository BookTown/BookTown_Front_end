import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchBookDetailById } from "../api/api"; // 책 정보를 가져오는 API

interface TopTitleProps {
  bookId?: string | number;
  title?: string;
}

const TopTitle: React.FC<TopTitleProps> = ({ bookId, title }) => {
  const [bookTitle, setBookTitle] = useState<string>("책고을");
  const location = useLocation();
  
  // Redux 스토어에서 만화 데이터 가져오기 (Cartoon 페이지에서 사용)
  const { cartoon } = useSelector((state: RootState) => state.cartoon);
  
  useEffect(() => {
    // 1. prop으로 직접 제목이 전달된 경우
    if (title) {
      setBookTitle(title);
      return;
    }
    
    // 2. prop으로 bookId가 전달된 경우 API로 제목 조회
    if (bookId) {
      const fetchBookInfo = async () => {
        try {
          const bookDetail = await fetchBookDetailById(Number(bookId));
          if (bookDetail && bookDetail.title) {
            setBookTitle(bookDetail.title);
          }
        } catch (error) {
          console.error("책 정보를 가져오는데 실패했습니다:", error);
        }
      };
      
      fetchBookInfo();
      return;
    }
    
    // 3. 경로에 따라 제목 결정 (기존 로직 활용)
    const isCartoonPage = location.pathname.includes('/cartoon/');
    const isQuizPage = location.pathname.includes('/quiz/');
    
    if (isCartoonPage && cartoon && cartoon.title) {
      setBookTitle(cartoon.title);
      return;
    }
    
    if (isQuizPage && location.state?.quizParams?.bookTitle) {
      setBookTitle(location.state.quizParams.bookTitle);
      return;
    }
    
    // 4. 기본값은 "책고을"로 설정 (이미 초기값으로 설정됨)
  }, [bookId, title, cartoon, location]);

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-[#FFFAF0]">
      <div className="mx-auto flex items-center h-[60px] px-4 relative">
        {/* 좌측: 로고 */}
        <div className="absolute left-4">
          <Link to="/home" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="책고을 로고"
              className="w-20 h-20 -my-3"
            />
          </Link>
        </div>
        
        {/* 중앙: 타이틀 */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl font-medium">{bookTitle}</h1>
        </div>
      </div>
    </div>
  );
};

export default TopTitle;