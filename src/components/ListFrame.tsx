import React, { useState, useEffect } from "react";

interface ListFrameProps {
  children: React.ReactNode[];
  itemsPerPage?: number;
}

const ListFrame = ({ children, itemsPerPage = 8 }: ListFrameProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerView, setItemsPerView] = useState(itemsPerPage);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setItemsPerView(mobile ? 8 : 12);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const totalPages = Math.ceil(children.length / itemsPerView);
  const currentItems = children.slice(
    (currentPage - 1) * itemsPerView,
    currentPage * itemsPerView
  );

  return (
    <div className="px-4 pb-20 md:pb-0 flex flex-col min-h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mx-auto my-auto mb-8 flex-grow w-full">
        {currentItems}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
      <div className="w-full flex justify-center items-center gap-2 py-4">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-full bg-[#FFFAF0] text-sm font-medium disabled:opacity-50 hover:opacity-80 transition-colors"
        >
          이전
        </button>
        <div className="flex gap-1.5">
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
          className="px-3 py-1.5 rounded-full bg-[#FFFAF0] text-sm font-medium disabled:opacity-50 hover:opacity-80 transition-colors"
        >
          다음
        </button>
      </div>
    )}
    </div>
  );
};

export default ListFrame;
