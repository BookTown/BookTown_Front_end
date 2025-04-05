import React, { useState } from "react";
import BookCard from "../../components/BookCard";
import ModalOverlay from "../../components/ModalOverlay";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const book = [
  {
    id: 1,
    title: "어린왕자",
    author: "앙투안 드 생텍쥐페리",
    imageUrl: "/images/little-prince.png",
  },
];

const Search = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>search</div>
      <BookCard
        key={book[0].id}
        {...book[0]}
        onClick={() => {
          setSelectedBook(book[0]);
          setIsModalOpen(true);
        }}
        size="sm"
      />

      {isModalOpen && selectedBook && (
        <ModalOverlay
          book={selectedBook}
          onClose={() => setIsModalOpen(false)}
          requireSubmit={false}
        />
      )}
    </>
  );
};

export default Search;
