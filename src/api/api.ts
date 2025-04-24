import axiosApi from "../axios";
import { IBookList } from "../interfaces/bookInterface";

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

// 관심 책 목록 조회 (GET /profile/me/liked-books)
export const getLikedBooks = async (userId?: number) => {
  try {
    console.log('좋아요 목록 요청 시작');
    
    let endpoint = "/profile/me/liked-books"; // 기본적으로 현재 로그인한 사용자('me')의 좋아요 목록을 가져옴
    
    // userId가 제공된 경우 해당 사용자의 좋아요 목록을 가져옴
    if (userId !== undefined) {
      // '/api/' 부분 제거 (이미 axios 인스턴스에서 baseURL로 설정됨)
      endpoint = `/profile/${userId}/liked-books`;
    }
    
    const response = await axiosApi.get<number[]>(endpoint);
    console.log('좋아요 목록 응답 성공:', response.data);
    return response;
  } catch (error) {
    console.error('좋아요 목록 요청 실패:', error);
    throw error;
  }
};