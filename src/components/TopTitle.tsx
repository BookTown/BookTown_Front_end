import React from "react";
import { Link, useParams } from "react-router-dom";

const TopTitle = () => {
  const { bookId } = useParams();
  
  // Mock 데이터: 실제 구현 시 API 호출이나 Redux 등으로 대체
  const mockBookTitles: Record<string, string> = {
    "1": "로빈슨 크루소",
    "2": "걸리버 여행기",
    "3": "데미안",
    "4": "변신",
    "5": "동물농장",
    // 더 많은 책 추가 가능
  };
  
  // bookId가 없으면 기본 타이틀, 있으면 해당 책 제목
  const bookTitle = bookId && mockBookTitles[bookId] 
    ? mockBookTitles[bookId] 
    : "책고을";

  return (
    <div className="fixed top-0 left-0 right-0 z-40 max-w-[1440px] mx-auto bg-[#FFFAF0] border-b border-gray-300">
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
