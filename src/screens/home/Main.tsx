import BookCard from "../../components/BookCard";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import BookModal from "../../components/BookModal";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { usePopularBooks, useRecentBooks, useBannerBook } from "../../hooks/useBookQueries";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { IBookDetail } from "../../interfaces/bookInterface";
import { selectIsLiked, toggleLike } from "../../redux/slices/likeSlice";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const Main = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cardsPerSection, setCardsPerSection] = useState(2);
  
  // React Query로 데이터 가져오기 (배너 도서 추가)
  const { isLoading: isLoadingPopular, error: popularError } = usePopularBooks();
  const { isLoading: isLoadingRecent, error: recentError } = useRecentBooks();
  const { isLoading: isLoadingBanner, error: bannerError } = useBannerBook();
  
  // Redux 스토어에서 데이터 가져오기
  const dispatch = useAppDispatch();
  const popularBooks = useAppSelector(state => state.books.popular) || [];
  const recentBooks = useAppSelector(state => state.books.recent) || [];
  const bannerBook = useAppSelector(state => state.books.banner);

  // 메인 도서로 배너 도서 사용 (bannerBook이 없으면 첫번째 인기 도서 사용)
  const mainBook = bannerBook || (Array.isArray(popularBooks) && popularBooks.length > 0 ? popularBooks[0] : null);
  // 메인 도서 객체 구조 확인
  console.log("메인 도서:", mainBook);  
  
  // 메인 배너 도서의 좋아요 상태 확인
  const isMainBookLiked = useAppSelector(state => 
    mainBook ? selectIsLiked(state, mainBook.id) : false
  );

  useEffect(() => {
    const handleResize = () => {
      setCardsPerSection(window.innerWidth >= 768 ? 4 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 배너 도서 좋아요 처리 함수 (토글 방식으로 변경)
  const handleMainBookLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mainBook || !mainBook.id) {
      console.error('유효하지 않은 메인 도서 ID:', mainBook?.id);
      return;
    }
    
    try {
      console.log(`메인 배너 좋아요 토글 시작: bookId=${mainBook.id}, 현재 상태=${isMainBookLiked ? '좋아요 상태' : '좋아요 안함 상태'}`);
      // 토글 액션 디스패치 (addLike 및 removeLike 대신 toggleLike 사용)
      await dispatch(toggleLike(mainBook.id)).unwrap();
      console.log('메인 배너 좋아요 토글 완료');
    } catch (error) {
      console.error("좋아요 토글 처리 실패:", error);
    }
  };

  if (isLoadingPopular || isLoadingRecent || isLoadingBanner) {
    return <div className="pt-14 text-center">데이터를 불러오는 중...</div>;
  }

  if (popularError || recentError || bannerError) {
    return <div className="pt-14 text-center">데이터를 불러오는데 실패했습니다.</div>;
  }

  // 데이터 확인 및 안전한 액세스
  const isPopularBooksArray = Array.isArray(popularBooks);
  const isRecentBooksArray = Array.isArray(recentBooks);
  
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
                    id: mainBook.id,
                    title: mainBook.title,
                    author: mainBook.author,
                    imageUrl: mainBook.thumbnailUrl
                  });
                  setShowModal(true);
                }}
              >
                보러가기
              </Button>
              <button
                onClick={handleMainBookLike}
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
            popularBooks.slice(1, 1 + cardsPerSection).map((book: IBookDetail) => {
              console.log('인기 고전 북카드 데이터:', book);
              return (
                <BookCard
                  key={book.id}
                  id={book.id}
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
                  size="sm"
                />
              );
            }) : (
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
          {isRecentBooksArray && recentBooks.length > 0 ? 
            recentBooks.slice(0, cardsPerSection).map((book: IBookDetail) => {
              console.log('최신 고전 북카드 데이터:', book);
              return (
                <BookCard
                  key={book.id}
                  id={book.id}
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
                  size="sm"
                />
              );
            }) : (
              <div className="col-span-2 md:col-span-4 text-center text-gray-500">
                최신 등록된 도서가 없습니다
              </div>
            )
          }
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
          {isRecentBooksArray && recentBooks.length > 0 ? 
            recentBooks.slice(0, cardsPerSection).map((book: IBookDetail) => {
              console.log('히스토리 북카드 데이터:', book);
              return (
                <BookCard
                  key={book.id}
                  id={book.id}
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
                  size="sm"
                />
              );
            }) : (
              <div className="col-span-2 md:col-span-4 text-center text-gray-500">
                최신 등록된 도서가 없습니다
              </div>
            )
          }
        </div>
      </div>

      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Main;