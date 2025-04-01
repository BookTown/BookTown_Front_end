import ListFrame from "../../components/ListFrame";
import BookCard from "../../components/BookCard";
import Button from "../../components/Button";
import { useState } from "react";
import ModalOverlay from "../../components/ModalOverlay";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const mockBooks = [
  {
    id: 1,
    title: "어린왕자",
    author: "앙투안 드 생텍쥐페리",
    imageUrl: "/images/little-prince.png",
  },
  {
    id: 2,
    title: "데미안",
    author: "Hermann Hesse",
    imageUrl: "/images/demian.png",
  },
  {
    id: 3,
    title: "헨젤과 그레텔",
    author: "Brothers Grimm",
    imageUrl: "/images/hansel.png",
  },
  {
    id: 4,
    title: "노인과 바다",
    author: "Ernest Hemingway",
    imageUrl: "/images/oldSea.png",
  },
  {
    id: 5,
    title: "변신",
    author: "Franz Kafka",
    imageUrl: "/images/Die Verwandlung.png",
  },
  {
    id: 6,
    title: "싯다르타",
    author: "Hermann Hesse",
    imageUrl: "/images/Siddhartha.png",
  },
  {
    id: 7,
    title: "소돔의 120일",
    author: "Marquis de Sade",
    imageUrl: "/images/Lusts of the Libertines.png",
  },
];

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
      <ListFrame title="인기 고전" link="search">
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

      {/* 최신 고전 리스트 */}
      <ListFrame title="최신 등록 고전" link="search">
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
      {/* 히스토리 리스트 */}
      <ListFrame title="히스토리" link="search">
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
