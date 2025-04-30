import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import { useState, useCallback } from "react";
import BookModal from "../../components/BookModal";
import { useLikedBooks } from "../../hooks/useBookQueries";
import { useAppDispatch } from "../../redux/hooks";
import { toggleLike } from "../../redux/slices/likeSlice";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const LikedBooksMain = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  
  // React Query로 좋아요 도서 목록 가져오기 (캐시 & 서버 동기화)
  const { data: books = [], isLoading, isError, refetch } = useLikedBooks();
  
  // 책이 있는지 확인
  const hasBooks = Array.isArray(books) && books.length > 0;

  // useCallback으로 핸들러 메모이제이션
  const handleBookSelect = useCallback((book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  }, []);

  // 좋아요 처리를 컴포넌트 내부에서 처리 (메모이제이션)
  const handleToggleLike = useCallback(async (bookId: number) => {
    await dispatch(toggleLike(bookId));
  }, [dispatch]);

  // 데이터 로딩 중
  if (isLoading) {
    return (
      <div className="pt-14 md:pt-12 text-center py-10">
        <p className="text-[#9CAAB9]">데이터를 불러오는 중...</p>
      </div>
    );
  }
  
  // 에러 처리
  if (isError) {
    return (
      <div className="pt-14 md:pt-12 text-center py-10">
        <p className="text-[#9CAAB9]">데이터를 불러오는데 실패했습니다.</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-[#C75C5C] text-white rounded-lg hover:bg-[#b54d4d]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">관심 작품</h1>
        <p className="text-xl text-[#A39C9C] pb-6">좋아요를 누른 작품들을 모아봤어요</p>
      </div>
      
      {hasBooks ? (
        <ListFrame>
          {books.map((book) => (
            <BookCard
              key={book.bookId}
              id={book.bookId}
              thumbnailUrl={book.thumbnailUrl || '/images/default-book.png'}
              title={book.title}
              author={book.author || '작가 미상'}
              onBookSelect={() => handleBookSelect({
                id: book.bookId,
                title: book.title,
                author: book.author || '작가 미상',
                imageUrl: book.thumbnailUrl || '/images/default-book.png'
              })}
              size="lg"
              onToggleLike={handleToggleLike}
            />
          ))}
        </ListFrame>
      ) : (
        <div className="w-full text-center py-10">
          <p className="text-[#9CAAB9]">아직 관심 작품이 없습니다.</p>
          <p className="text-[#9CAAB9] mt-2">마음에 드는 작품에 좋아요를 눌러보세요!</p>
        </div>
      )}
      
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default LikedBooksMain;