import BookCard from "../../components/BookCard";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import ModalOverlay from "../../components/ModalOverlay";
import { mockBooks } from "../../mocks/mockBook";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { usePopularBooks, useRecentBooks } from "../../hooks/useBookQueries";
import { useAppSelector } from "../../redux/hooks";

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
  const [isMainBookLiked, setIsMainBookLiked] = useState(false);

  // React Query로 데이터 가져오기
  const { isLoading: isLoadingPopular, error: popularError } = usePopularBooks();
  const { isLoading: isLoadingRecent, error: recentError } = useRecentBooks();
  
  // Redux 스토어에서 데이터 가져오기
  const popularBooks = useAppSelector(state => state.books.popular) || [];
  const recentBooks = useAppSelector(state => state.books.recent) || [];

  useEffect(() => {
    const handleResize = () => {
      setCardsPerSection(window.innerWidth >= 768 ? 4 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoadingPopular || isLoadingRecent) {
    return <div className="pt-14 text-center">데이터를 불러오는 중...</div>;
  }

  if (popularError || recentError) {
    return <div className="pt-14 text-center">데이터를 불러오는데 실패했습니다.</div>;
  }

  // 데이터 확인 및 안전한 액세스
  const isPopularBooksArray = Array.isArray(popularBooks);
  const isRecentBooksArray = Array.isArray(recentBooks);
  
  // 메인 도서로 표시할 첫 번째 인기 도서
  const mainBook = isPopularBooksArray && popularBooks.length > 0 ? popularBooks[0] : null;

  return (
    <div className="pt-14 pb-16 md:pb-0">
      {/* 메인 도서 (index 0) */}
      {mainBook && (
        <div className="relative w-full h-60 md:h-[34rem] overflow-hidden mb-4">
          <img
            src={mainBook.thumbnailUrl}
            alt={mainBook.title}
            className="w-full h-full object-cover md:rounded-xl"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:rounded-xl"/>
          <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
            <h2 className="text-xl md:text-2xl mb-1">{mainBook.title}</h2>
            <p className="text-sm md:text-base pb-3">{mainBook.author}</p>
            <div className="flex items-center gap-2">
              <Button
                size="md"
                color="pink"
                type="submit"
                onClick={() => {
                  setSelectedBook({
                    id: mainBook.bookId,
                    title: mainBook.title,
                    author: mainBook.author,
                    imageUrl: mainBook.thumbnailUrl
                  });
                  setIsModalOpen(true);
                }}
              >
                보러가기
              </Button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMainBookLiked(!isMainBookLiked);
                }}
                className="p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                aria-label={isMainBookLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  size={20}
                  className={`${isMainBookLiked ? "fill-[#C75C5C] stroke-[#C75C5C]" : "stroke-[#C75C5C]"} md:w-6 md:h-6`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

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
          {isPopularBooksArray && popularBooks.length > 1 ? 
            popularBooks.slice(1, 1 + cardsPerSection).map((book) => (
              <BookCard
                key={book.bookId}
                bookId={book.bookId}
                thumbnailUrl={book.thumbnailUrl}
                title={book.title}
                author={book.author}
                onClick={() => {
                  setSelectedBook({
                    id: book.bookId,
                    title: book.title,
                    author: book.author,
                    imageUrl: book.thumbnailUrl
                  });
                  setIsModalOpen(true);
                }}
                size="sm"
              />
            )) : (
              <div className="col-span-2 md:col-span-4 text-center text-gray-500">
                인기 도서가 없습니다
              </div>
            )
          }
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
          {recentBooks.slice(0, cardsPerSection).map((book) => (
            <BookCard
              key={book.bookId}
              bookId={book.bookId}
              thumbnailUrl={book.thumbnailUrl}
              title={book.title}
              author={book.author}
              onClick={() => {
                setSelectedBook({
                  id: book.bookId,
                  title: book.title,
                  author: book.author,
                  imageUrl: book.thumbnailUrl
                });
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
              bookId={book.id}
              thumbnailUrl={book.imageUrl}
              title={book.title}
              author={book.author}
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
          requireSubmit={false}
        />
      )}
    </div>
  );
};

export default Main;