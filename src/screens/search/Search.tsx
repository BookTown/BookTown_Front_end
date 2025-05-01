import React, { useState, useEffect } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookModal from "../../components/BookModal";
import { searchBooks } from "../../api/api";
import { IBookSearchResponse } from "../../interfaces/bookInterface";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IBookSearchResponse[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<Book[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  // 검색 처리
  useEffect(() => {
    // 디바운스 처리
    const debounceTimer = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        setError(null);
        
        try {
          const results = await searchBooks(searchTerm);
          setSearchResults(results);
        } catch (err) {
          console.error("검색 중 오류 발생:", err);
          setError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms 디바운스

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // 책 선택 핸들러
  const handleBookSelect = (book: IBookSearchResponse) => {
    const bookData: Book = {
      id: book.bookId,
      title: book.title,
      author: book.author,
      imageUrl: book.thumbnailUrl,
    };
    
    setSelectedBook(bookData);
    setShowModal(true);

    // 최근 검색 기록에 추가
    const updatedSearches = [
      bookData,
      ...recentSearches.filter(item => item.id !== book.bookId)
    ].slice(0, 8); // 최대 8개까지만 저장

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return (
    <>
      {/* 검색 헤더 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-container bg-booktown-bg md:max-w-container-lg">
        <div className="flex items-center px-4 py-3 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-2"
            aria-label="뒤로 가기"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="책 제목 또는 저자 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#C75C5C] focus:border-transparent"
              autoFocus
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CAAB9]" size={20} />
          </div>
        </div>
      </div>

      <div className="pt-16 pb-6 px-4 md:px-6">
        {/* 검색 결과 또는 최근 검색 목록 */}
        {searchTerm.trim() ? (
          // 검색 결과
          isLoading ? (
            <div className="text-center py-10">
              <p className="text-[#9CAAB9]">검색 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <h2 className="text-xl mb-4">검색 결과 ({searchResults.length})</h2>
              {searchResults.map((book) => (
                <div
                  key={book.bookId}
                  onClick={() => handleBookSelect(book)}
                  className="flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-[#9CAAB9]">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-[#9CAAB9]">검색 결과가 없습니다.</p>
            </div>
          )
        ) : (
          // 최근 검색 목록
          <div>
            <h2 className="text-xl my-4">최근 검색</h2>
            {recentSearches.length > 0 ? (
              recentSearches.map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-[#9CAAB9]">{book.author}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-[#9CAAB9]">최근 검색 내역이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 모달 */}
      {showModal && selectedBook && (
        <BookModal book={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Search;