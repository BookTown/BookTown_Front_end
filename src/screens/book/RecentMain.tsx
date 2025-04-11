import ListFrame from "../../components/ListFrame";
import { mockBooks } from "../../mocks/mockBook";
import BookCard from "../../components/BookCard";
import { useState } from "react";
import BookModal from "../../components/BookModal";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const RecentMain = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4">
        <h1 className="text-3xl">최근 등록된 고전</h1>
        <p className="text-xl text-[#A39C9C] pb-6">멘트 추천 좀...</p>
      </div>
      <ListFrame>
        {mockBooks.map((book) => (
          <BookCard
            key={book.id}
            {...book}
            onClick={() => {
              setSelectedBook(book);
              setShowModal(true);
            }}
            size="lg"
          />
        ))}
      </ListFrame>
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default RecentMain;
