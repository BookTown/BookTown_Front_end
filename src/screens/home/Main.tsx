import BookCard from "../../components/BookCard";
import { useState, useEffect, useCallback } from "react";
import BookModal from "../../components/BookModal";
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
      {/* 메인 도서 */}
      {mainBook && (
        <div
          className="relative w-full h-60 md:h-[38rem] overflow-hidden mb-4 md:rounded-xl group cursor-pointer"
          onClick={handleMainBannerClick}
        >
          {/* 배경 이미지 */}
          <div className="absolute inset-0 overflow-hidden md:rounded-xl">
            <img
              src={mainBook.thumbnailUrl}
              alt={mainBook.title}
              className="w-full h-full object-cover scale-[1.02] filter blur-[8px] brightness-[0.4] 
                md:group-hover:blur-[12px] md:group-hover:brightness-[0.3] transition-all duration-1000"
              loading="eager"
            />
          </div>

          {/* 메인 커버 이미지 */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-[45%] h-[85%] overflow-hidden rounded-lg shadow-2xl
              md:group-hover:scale-105 transition-all duration-700"
          >
            <img
              src={mainBook.thumbnailUrl}
              alt={mainBook.title}
              className="w-full h-full object-cover"
            />
            {/* 커버 이미지 반사/광택 효과 */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 
                md:group-hover:opacity-70 transition-opacity duration-700"
            ></div>
          </div>

          {/* 도서 정보 컨테이너 */}
          <div
            className="absolute bottom-0 inset-x-0 text-white py-10 px-6 
              bg-gradient-to-t from-black/90 via-black/70 to-transparent 
              transform md:translate-y-[70%] md:group-hover:translate-y-0 
              transition-transform duration-700 ease-in-out"
          >
            {/* 타이틀과 저자 정보 */}
            <div className="mb-6 transform md:translate-y-[-60%] md:group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                {mainBook.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-4">
                {mainBook.author}
              </p>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex items-center gap-4 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {/* 보러가기 버튼 */}
              <button
                type="button"
                className="w-full max-w-[340px] text-lg font-medium rounded-xl 
                  bg-[#C75C5C] text-white px-8 py-3 shadow-lg
                  hover:bg-[#b54d4d] active:bg-[#a44444]
                  hover:transform hover:scale-105 active:scale-[0.98]
                  transition-all duration-300 outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMainBannerClick();
                }}
              >
                보러가기
              </button>

              {/* 좋아요 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleMainBookLike(e);
                }}
                className="p-3 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300 z-10"
                aria-label={isMainBookLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  size={24}
                  className={`${
                    isMainBookLiked
                      ? "fill-[#C75C5C] stroke-[#C75C5C]"
                      : "stroke-[#C75C5C]"
                  } pointer-events-none`}
                />
              </button>
            </div>
          </div>

          {/* 넷플릭스 스타일 테두리 효과 */}
          <div
            className="hidden md:block absolute inset-0 md:rounded-xl opacity-0 
              md:group-hover:opacity-100 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)] 
              pointer-events-none transition-opacity duration-700"
          ></div>

          {/* 호버시 오버레이 */}
          <div
            className="absolute inset-0 md:rounded-xl bg-black/0 
              md:group-hover:bg-black/20 transition-colors duration-700"
          ></div>
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
