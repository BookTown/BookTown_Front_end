import React, { useState, useEffect } from "react";

interface ListFrameProps {
  children: React.ReactNode[];
  itemsPerPage?: number;
  gapSize?: "small" | "medium" | "large";
}

const ListFrame = ({ 
  children, 
  itemsPerPage = 12, 
  gapSize = "medium" 
}: ListFrameProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerView, setItemsPerView] = useState(itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 8 : 12);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // gap 크기에 따른 클래스 결정
  const gapClasses = {
    small: "gap-3 md:gap-5",
    medium: "gap-4 md:gap-6",
    large: "gap-5 md:gap-8" 
  };

  const totalPages = Math.ceil(children.length / itemsPerView);
  const currentItems = children.slice(
    (currentPage - 1) * itemsPerView,
    currentPage * itemsPerView
  );

  return (
    <div className="px-4 pb-20 md:pb-0 flex flex-col min-h-[calc(100vh-12rem)] md:h-[864px] bg-[#FFFAF0]">
      <ul className={`flex flex-wrap ${gapClasses[gapSize]} mx-auto my-auto mb-8 flex-grow w-full md:max-h-[720px]`}>
        {currentItems.map((item, index) => (
          <li 
            key={index} 
            className="p-1 relative w-[calc(50%-0.5rem)] md:max-w-[23%] md:flex-[0_0_23%]" 
            style={{ transformOrigin: 'center' }}
          >
            {item}
          </li>
        ))}
      </ul>
      
      {/* Pagination */}
      {totalPages > 1 && (
      <div className="w-full flex justify-center items-center gap-2 py-4">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-full text-sm disabled:opacity-50 hover:opacity-80 transition-colors"
        >
          이전
        </button>
        <div className="flex gap-1.5 flex-wrap justify-center max-w-[240px]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
          ))}
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