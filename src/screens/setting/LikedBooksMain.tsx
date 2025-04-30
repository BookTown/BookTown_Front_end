import React, { useState, useCallback, memo } from "react";
import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import BookModal from "../../components/BookModal";
import { useLikedBooks } from "../../hooks/useBookQueries";
import { useQueryClient } from "@tanstack/react-query";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const LikedBooksMain = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  
  // React Query로 좋아요 도서 목록 가져오기 (캐시 활용)
  const { 
    data: books, 
    isLoading, 
    isError,
    // refreshLikedBooks 제거 (사용하지 않음)
  } = useLikedBooks();
  
  // 컴포넌트 렌더링 시 로깅 콘솔 출력
  console.log("LikedBooksMain 렌더링 - 북 목록 길이:", books?.length || 0);
  
  // 메모이제이션된 핸들러로 최적화
  const handleBookSelect = useCallback((book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  }, []);

  // 모달 닫기 핸들러 최적화
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // 데이터 존재 여부 확인
  const hasBooks = Array.isArray(books) && books.length > 0;

  // 메모이제이션된 도서 변환 함수
  const getBookObject = useCallback((book: any): Book => ({
    id: book.bookId,
    title: book.title,
    author: book.author || '작가 미상',
    imageUrl: book.thumbnailUrl || '/images/default-book.png'
  }), []);

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">관심 작품</h1>
        <p className="text-xl text-[#A39C9C] pb-6">좋아요를 누른 작품들을 모아봤어요</p>
      </div>
      
      {isLoading ? (
        <div className="pt-14 text-center py-10">
          <p className="text-[#9CAAB9]">데이터를 불러오는 중...</p>
        </div>
      ) : isError ? (
        <div className="pt-14 text-center py-10">
          <p className="text-[#9CAAB9]">데이터를 불러오는데 실패했습니다.</p>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["likedBooks"] })}
            className="mt-4 px-4 py-2 bg-[#C75C5C] text-white rounded-lg hover:bg-[#b54d4d]"
          >
            다시 시도
          </button>
        </div>
      ) : !hasBooks ? (
        <div className="w-full text-center py-10">
          <p className="text-[#9CAAB9]">아직 관심 작품이 없습니다.</p>
          <p className="text-[#9CAAB9] mt-2">마음에 드는 작품에 좋아요를 눌러보세요!</p>
        </div>
      ) : (
        <ListFrame>
          {books.map((book) => (
            <BookCard
              key={book.bookId}
              id={book.bookId}
              thumbnailUrl={book.thumbnailUrl || '/images/default-book.png'}
              title={book.title}
              author={book.author || '작가 미상'}
              onBookSelect={() => handleBookSelect(getBookObject(book))}
              size="lg"
            />
          ))}
        </ListFrame>
      )}
      
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </div>
  );
};

// 불필요한 리렌더링을 방지
export default memo(LikedBooksMain);