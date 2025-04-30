import axiosApi from "../axios";
import { IBookList } from "../interfaces/bookInterface";
import { IBookSearch } from "../interfaces/bookInterface";

// 인기 도서 조회 (좋아요 수 기준)
export const fetchPopularBooks = async (): Promise<IBookList> => {
  console.log('인기 도서 API 호출 시작');
  try {
    const response = await axiosApi.get<IBookList>('/book/popular');
    console.log('인기 도서 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('인기 도서 API 오류:', error);
    throw error;
  }
};

// 최신 도서 조회
export const fetchRecentBooks = async (): Promise<IBookList> => {
  console.log('최신 도서 API 호출 시작');
  try {
    const response = await axiosApi.get<IBookList>('/book/recent');
    console.log('최신 도서 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('최신 도서 API 오류:', error);
    throw error;
  }
};

// 배너용 랜덤 도서 조회
export const fetchBannerBook = async () => {
  console.log('배너 도서 API 호출 시작');
  try {
    const response = await axiosApi.get('/book/banner');
    console.log('배너 도서 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('배너 도서 API 오류:', error);
    throw error;
  }
};

// 전체 인기 도서 조회
export const fetchAllPopularBooks = async (): Promise<IBookList> => {
  try {
    const response = await axiosApi.get<IBookList>('/book/popular/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 전체 최신 도서 조회
export const fetchAllRecentBooks = async (): Promise<IBookList> => {
  try {
    const response = await axiosApi.get<IBookList>('/book/recent/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 토글 API
export const toggleLikeBook = (bookId: number) => {
  if (!bookId) {
    console.error('좋아요 토글 실패: 유효하지 않은 bookId -', bookId);
    return Promise.reject('유효하지 않은 bookId입니다.');
  }
  console.log('좋아요 토글 요청:', bookId);
  return axiosApi.post(`/book/like/${bookId}`);
};


// 관심 책 목록 조회 (GET /book/like/view)
export const getLikedBooks = async () => {
  try {
    console.log('좋아요 목록 요청 시작');
    
    const response = await axiosApi.get("/book/like/view");
    console.log('서버에서 받은 좋아요 책 목록:', response.data);
    return response.data; // data 속성만 반환하도록 수정
  } catch (error) {
    console.error('좋아요 목록 요청 실패:', error);
    throw error;
  }
};

// 책 검색 API
export const searchBooks = async (query: string): Promise<IBookSearch> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    console.log(`🔍 검색 API 호출 시작: "${trimmed}"`);
    
    const response = await axiosApi.get<IBookSearch>(
      `/book/search?query=${encodeURIComponent(trimmed)}`
    );

    console.log("검색 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("검색 API 오류:", error);
    return []; // 에러 시 빈 배열 반환해도 무방 (앱 크래시 방지)
  }
};