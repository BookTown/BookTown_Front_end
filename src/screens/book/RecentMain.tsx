import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import { useState } from "react";
import BookModal from "../../components/BookModal";
import { useAllRecentBooks } from "../../hooks/useBookQueries";
import { IBook } from "../../interfaces/bookInterface";
import Loader from "../../components/Loader/Loader";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const RecentMain = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // API 호출
  const { data: books, isLoading, isError } = useAllRecentBooks();
  
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
    return <div className="flex justify-center items-center h-[100dvh] text-2xl">데이터를 불러오는데 실패했습니다.</div>
  }
  
  // 데이터 존재 여부 확인
  const isBookArray = Array.isArray(books) && books.length > 0;

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">최근 등록된 고전</h1>
        <p className="text-xl text-[#A39C9C] pb-6">모든 최근 등록 작품을 모아봤어요</p>
      </div>
      <ListFrame>
        {isBookArray ? (
          books.map((book: IBook) => (
            <BookCard
              key={book.id}
              id={book.id}
              thumbnailUrl={book.thumbnailUrl}
              title={book.title}
              author={book.author}
              onBookSelect={() => {
                setSelectedBook({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  imageUrl: book.thumbnailUrl
                });
                setShowModal(true);
              }}
              size="lg"
            />
          ))
        ) : (
          [
            <div className="w-full py-10 flex justify-center items-center text-center h-[100dvh]" key="no-books">
              <p className="text-[#9CAAB9] text-2xl">최근 등록된 도서가 없습니다.</p>
            </div>
          ]
        )}
      </ListFrame>
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default RecentMain;