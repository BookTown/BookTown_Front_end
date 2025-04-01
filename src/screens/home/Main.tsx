import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import Button from "../../components/Button";
import { useState } from "react";
import ModalOverlay from "../../components/ModalOverlay";
import { mockBooks } from "../../mocks/mockBook";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const mainBook = mockBooks[0];

const Main = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pt-14 pb-16">
      {/* 메인 도서 (index 0) */}
      <div className="relative w-full h-60 overflow-hidden mb-4">
        <img
          src={mainBook.imageUrl}
          alt={mainBook.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
          <h2 className="text-xl">{mainBook.title}</h2>
          <p className="text-sm pb-2">{mainBook.author}</p>
          <Button
            size="md"
            color="pink"
            type="submit"
            onClick={() => {
              setSelectedBook(mainBook);
              setIsModalOpen(true);
            }}
          >
            보러가기
          </Button>
        </div>
      </div>

      {/* 인기 고전 리스트 */}
      <div>
        <div className="px-4 flex items-center justify-between">
          <h3 className="text-2xl mx-2 mb-2">인기 고전</h3>
          <Link
            to="/popular"
            className="pr-2 text-[#4B8E96] hover:underline hover:opacity-80 transition"
          >
            모두 보기
          </Link>
        </div>
        <ListFrame>
          {mockBooks.slice(1).map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
            />
          ))}
        </ListFrame>
      </div>

      {/* 최신 고전 리스트 */}
      <div>
        <div className="px-4 flex items-center justify-between">
          <h3 className="text-2xl mx-2 mb-2">최근 등록된 고전</h3>
          <Link
            to="/recent"
            className="pr-2 text-[#4B8E96] hover:underline hover:opacity-80 transition"
          >
            모두 보기
          </Link>
        </div>
        <ListFrame>
          {mockBooks.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
            />
          ))}
        </ListFrame>
      </div>
      {/* 히스토리 리스트 */}
      <div>
        <div className="px-4 flex items-center justify-between">
          <h3 className="text-2xl mx-2 mb-2">히스토리</h3>
          <Link
            to="/search"
            className="pr-2 text-[#4B8E96] hover:underline hover:opacity-80 transition"
          >
            모두 보기
          </Link>
        </div>
        <ListFrame>
          {mockBooks.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
            />
          ))}
        </ListFrame>
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
