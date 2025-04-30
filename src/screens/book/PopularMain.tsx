import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import { useState } from "react";
import BookModal from "../../components/BookModal";
import { useAllPopularBooks } from "../../hooks/useBookQueries";
import { IBook } from "../../interfaces/bookInterface";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const PopularMain = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // API 호출
  const { data: books, isLoading, isError } = useAllPopularBooks();
  
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
  const isBookArray = Array.isArray(books) && books.length > 0;

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">인기고전</h1>
        <p className="text-xl text-[#A39C9C] pb-6">멘트 추천 좀...</p>
      </div>
      <ListFrame>
        {[
          isBookArray ? (
            books.map((book: IBook) => (
              <BookCard
                key={book.id}
                bookId={book.id}
                thumbnailUrl={book.thumbnailUrl}
                title={book.title}
                author={book.author}
                onClick={() => {
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
            <div className="w-full text-center py-10">
              <p className="text-[#9CAAB9]">인기 도서가 없습니다.</p>
            </div>
          )
        ]}
      </ListFrame>
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default PopularMain;