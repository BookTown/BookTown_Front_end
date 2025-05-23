import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import { useState, useEffect } from "react";
import BookModal from "../../components/BookModal";
import { useLikedBooks } from "../../hooks/useBookQueries";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectLikedBooks, toggleLike } from "../../redux/slices/likeSlice";
import Loader from "../../components/Loader/Loader";

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
  
  // Redux에서 좋아요 상태 구독
  const likedBookIds = useAppSelector(selectLikedBooks);
  
  // React Query로 좋아요 도서 목록 가져오기 (캐시 & 서버 동기화)
  const { data: serverBooks, isLoading, isError, refetch } = useLikedBooks();
  
  // 서버에서 가져온 도서 데이터를 현재 좋아요 ID 목록에 따라 필터링
  const books = Array.isArray(serverBooks) 
    ? serverBooks.filter(book => likedBookIds.includes(book.bookId)) 
    : [];
  
  // 컴포넌트 마운트 시 데이터 새로고침
  useEffect(() => {
    console.log("LikedBooksMain: 좋아요 목록 조회 요청");
    refetch();
  }, [refetch]);
  
  // 데이터 로딩 중
  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-[100dvh] text-2xl">
          <Loader />
          <div className="pt-5">데이터를 불러오는 중...</div>
        </div>
    );

  }
  
  // 에러 처리
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[100dvh] text-2xl">데이터를 불러오는데 실패했습니다.</div>
    );
  }
  
  // 책이 있는지 확인
  const hasBooks = books.length > 0;

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // 좋아요 처리를 컴포넌트 내부에서 처리
  const handleToggleLike = async (bookId: number) => {
    await dispatch(toggleLike(bookId));
    // 좋아요 취소 후 UI 즉시 업데이트 - 별도 리페치 불필요
  };

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
              // 좋아요 핸들러를 직접 전달 (선택 사항)
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