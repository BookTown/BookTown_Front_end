import React, { useState, useEffect, useMemo } from "react";

interface ListFrameProps {
  children: React.ReactNode[];
  itemsPerPage?: number;
}

// 화면 크기별 설정을 상수로 분리
const SCREEN_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024
};

const ITEMS_PER_VIEW = {
  MOBILE: 8,
  TABLET: 9,
  DESKTOP: 12
};

const ListFrame: React.FC<ListFrameProps> = ({ 
  children, 
  itemsPerPage = ITEMS_PER_VIEW.DESKTOP
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerView, setItemsPerView] = useState(itemsPerPage);

  // 화면 크기에 따른 아이템 수 설정 처리
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < SCREEN_BREAKPOINTS.MOBILE) {
        setItemsPerView(ITEMS_PER_VIEW.MOBILE);
      } else if (width < SCREEN_BREAKPOINTS.TABLET) {
        setItemsPerView(ITEMS_PER_VIEW.TABLET);
      } else {
        setItemsPerView(ITEMS_PER_VIEW.DESKTOP);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 총 페이지 수와 현재 표시할 아이템 계산
  const totalPages = useMemo(() => Math.ceil(children.length / itemsPerView), [children.length, itemsPerView]);
  const currentItems = useMemo(() => 
    children.slice((currentPage - 1) * itemsPerView, currentPage * itemsPerView),
    [children, currentPage, itemsPerView]
  );

  // 페이지네이션 버튼 렌더링 함수
  const renderPaginationButton = (page: number) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
        currentPage === page
          ? "bg-[#C75C5C] text-white"
          : "bg-[#FFFAF0] hover:opacity-80 text-gray-700"
      }`}
    >
      {page}
    </button>
  );

  return (
    <div className="px-4 pb-20 md:pb-0 flex flex-col min-h-[calc(100vh-12rem)] bg-[#FFFAF0]">
      {/* 북카드 리스트 컨테이너 */}
      <div className="flex-grow overflow-hidden">
        <ul className="flex flex-wrap gap-4 md:gap-6 mx-auto mb-4 w-full">
          {currentItems.map((item, index) => (
            <li 
              key={index} 
              className="p-1 relative w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:max-w-[23%] lg:flex-[0_0_23%]" 
              style={{ transformOrigin: 'center' }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center items-center gap-2 py-4 mt-auto">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-full text-sm disabled:opacity-50 hover:opacity-80 transition-colors"
          >
            이전
          </button>
          
          <div className="flex gap-1.5 flex-wrap justify-center max-w-[240px]">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(renderPaginationButton)}
          </div>
          
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-full text-sm disabled:opacity-50 hover:opacity-80 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default ListFrame;