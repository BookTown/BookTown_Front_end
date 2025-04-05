import BookCard from "../../components/BookCard";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import ModalOverlay from "../../components/ModalOverlay";
import { mockBooks } from "../../mocks/mockBook";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const Main = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardsPerSection, setCardsPerSection] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerSection(window.innerWidth >= 768 ? 4 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="pt-14 pb-16 md:pb-0">
      {/* 메인 도서 (index 0) */}
      <div className="relative w-full h-60 md:h-[34rem] overflow-hidden mb-4">
        <img
          src={mockBooks[0].imageUrl}
          alt={mockBooks[0].title}
          className="w-full h-full object-cover md:rounded-xl"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:rounded-xl"/>
        <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
          <h2 className="text-xl md:text-2xl mb-1">{mockBooks[0].title}</h2>
          <p className="text-sm md:text-base pb-3">{mockBooks[0].author}</p>
          <Button
            size="md"
            color="pink"
            type="submit"
            onClick={() => {
              setSelectedBook(mockBooks[0]);
              setIsModalOpen(true);
            }}
          >
            보러가기
          </Button>
        </div>
      </div>

      {/* 인기 고전 섹션 */}
      <div className="mb-4">
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-2xl">인기 고전</h3>
          <Link
            to="/popular"
            className="text-[#4B8E96] hover:underline hover:opacity-80 transition"
          >
            모두 보기
          </Link>
        </div>
        <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
          {mockBooks.slice(1, 1 + cardsPerSection).map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* 최신 고전 섹션 */}
      <div className="mb-8">
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-2xl">최근 등록된 고전</h3>
          <Link
            to="/recent"
            className="text-[#4B8E96] hover:underline hover:opacity-80 transition"
          >
            모두 보기
          </Link>
        </div>
        <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
          {mockBooks.slice(0, cardsPerSection).map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* 히스토리 섹션 */}
      <div className="mb-8">
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-2xl">히스토리</h3>
          <Link
            to="/search"
            className="text-[#4B8E96] hover:underline hover:opacity-80 transition"
          >
            모두 보기
          </Link>
        </div>
        <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
          {mockBooks.slice(0, cardsPerSection).map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
              size="sm"
            />
          ))}
        </div>
      </div>

      {isModalOpen && selectedBook && (
        <ModalOverlay
          book={selectedBook}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Main;
