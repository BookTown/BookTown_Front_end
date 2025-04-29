import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import { useState } from "react";
import BookModal from "../../components/BookModal";
import { useLikedBooks } from "../../hooks/useBookQueries";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const LikedBooksMain = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // 좋아요 한 도서 목록 API 호출
  const { data: books, isLoading, isError } = useLikedBooks();
  
  console.log("받은 책 목록:", books); // 디버깅용
  
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
      </div>
    );
  }
  
  // 데이터 존재 여부 확인
  const hasBooks = Array.isArray(books) && books.length > 0;

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
              onBookSelect={() => {
                setSelectedBook({
                  id: book.bookId,
                  title: book.title,
                  author: book.author || '작가 미상',
                  imageUrl: book.thumbnailUrl || '/images/default-book.png'
                });
                setShowModal(true);
              }}
              size="lg"
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