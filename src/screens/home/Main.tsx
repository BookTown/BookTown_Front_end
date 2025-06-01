import BookCard from "../../components/BookCard";
import { useState, useEffect, useCallback } from "react";
import BookModal from "../../components/BookModal";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  usePopularBooks,
  useRecentBooks,
  useBannerBook,
} from "../../hooks/useBookQueries";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { IBook } from "../../interfaces/bookInterface";
import { selectIsLiked, toggleLike } from "../../redux/slices/likeSlice";
import Loader from "../../components/Loader/Loader";

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

  // React Query로 데이터 가져오기
  const { isLoading: isLoadingPopular, error: popularError } =
    usePopularBooks();
  const { isLoading: isLoadingRecent, error: recentError } = useRecentBooks();
  const { isLoading: isLoadingBanner, error: bannerError } = useBannerBook();

  // Redux 스토어에서 데이터 가져오기
  const dispatch = useAppDispatch();
  const popularBooks = useAppSelector((state) => state.books.popular) || [];
  const recentBooks = useAppSelector((state) => state.books.recent) || [];
  const bannerBook = useAppSelector((state) => state.books.banner);

  // 메인 도서로 배너 도서 사용 (bannerBook이 없으면 첫번째 인기 도서 사용)
  const mainBook =
    bannerBook ||
    (Array.isArray(popularBooks) && popularBooks.length > 0
      ? popularBooks[0]
      : null);

  // 메인 배너 도서의 좋아요 상태 확인
  const isMainBookLiked = useAppSelector((state) =>
    mainBook ? selectIsLiked(state, mainBook.id) : false
  );

  // 화면 크기에 따라 카드 개수 조정
  useEffect(() => {
    const handleResize = () => {
      setCardsPerSection(window.innerWidth >= 768 ? 4 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // handleMainBookLike 함수를 useCallback으로 메모이제이션
  const handleMainBookLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!mainBook || !mainBook.id) {
        console.error("유효하지 않은 메인 도서 ID:", mainBook?.id);
        return;
      }

      try {
        console.log(`🔄 좋아요 토글 처리 시작: id=${mainBook.id}`);
        await dispatch(toggleLike(mainBook.id)).unwrap();
      } catch (error) {
        console.error("좋아요 토글 처리 실패:", error);
      }
    },
    [mainBook, dispatch]
  );

  // BookCard 선택 핸들러 메모이제이션
  const handleBookSelect = useCallback((book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  }, []);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // 메인 배너 클릭 핸들러
  const handleMainBannerClick = useCallback(() => {
    if (mainBook) {
      setSelectedBook({
        id: mainBook.id,
        title: mainBook.title,
        author: mainBook.author,
        imageUrl: mainBook.thumbnailUrl,
      });
      setShowModal(true);
    }
  }, [mainBook]);

  if (isLoadingPopular || isLoadingRecent || isLoadingBanner) {
    return (
      <div className="flex flex-col justify-center items-center h-[100dvh] text-2xl">
        <Loader />
        <div className="pt-5">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (popularError || recentError || bannerError) {
    return (
      <div className="flex justify-center items-center h-[100dvh] text-2xl">
        데이터를 불러오는데 실패했습니다.
      </div>
    );
  }

  // 데이터 확인 및 안전한 액세스
  const isPopularBooksArray = Array.isArray(popularBooks);
  const isRecentBooksArray = Array.isArray(recentBooks);

  return (
    <div className="pt-14 pb-16 md:pb-0">
      {/* 메인 도서 - 시네마틱 스타일 배너 */}
      {mainBook && (
        <div className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden mb-4 group">
          {/* 블러 처리된 배경 이미지 (확장 효과) */}
          <img
            src={mainBook.thumbnailUrl}
            alt={`${mainBook.title}`}
            className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
          />
          
          {/* 어두운 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
          
          {/* 배너 내용 영역 */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12">
            {/* 타이틀과 저자 정보 */}
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-2 drop-shadow-lg">
              {mainBook.title}
            </h2>
            <p className="text-sm md:text-lg text-white/90 mb-4 max-w-md">
              {mainBook.author}
            </p>
            
            {/* 버튼 영역 */}
            <div className="flex items-center gap-3 mt-2">
              <Button
                size="md"
                color="pink"
                onClick={handleMainBannerClick}
                className="transition-transform duration-300 hover:scale-105"
              >
                보러가기
              </Button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleMainBookLike(e);
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                aria-label={isMainBookLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  size={22}
                  className={`${
                    isMainBookLiked
                      ? "fill-[#C75C5C] stroke-[#C75C5C]"
                      : "stroke-[#C75C5C]"
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* 전경 표지 이미지 (데스크톱에만 표시) */}
          <div className="hidden md:block absolute bottom-8 right-12 h-4/5 aspect-[2/3] shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
            <img
              src={mainBook.thumbnailUrl}
              alt={mainBook.title}
              className="w-full h-full object-cover"
            />
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
          {isPopularBooksArray && popularBooks.length > 1 ? (
            popularBooks
              .slice(1, 1 + cardsPerSection)
              .map((book: IBook) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  thumbnailUrl={book.thumbnailUrl}
                  title={book.title}
                  author={book.author}
                  onBookSelect={handleBookSelect}
                  size="sm"
                />
              ))
          ) : (
            <div className="col-span-2 md:col-span-4 text-center text-gray-500">
              인기 도서가 없습니다
            </div>
          )}
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
          {isRecentBooksArray && recentBooks.length > 0 ? (
            recentBooks
              .slice(0, cardsPerSection)
              .map((book: IBook) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  thumbnailUrl={book.thumbnailUrl}
                  title={book.title}
                  author={book.author}
                  onBookSelect={handleBookSelect}
                  size="sm"
                />
              ))
          ) : (
            <div className="col-span-2 md:col-span-4 text-center text-gray-500">
              최신 등록된 도서가 없습니다
            </div>
          )}
        </div>
      </div>

      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Main;
