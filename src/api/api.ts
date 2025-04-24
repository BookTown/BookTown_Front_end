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

// 좋아요 설정 (POST /book/like/{bookId})
export const postLikeBook = (bookId: number) => {
  return axiosApi.post(`/book/like/${bookId}`);
};

// 좋아요 해제 (DELETE /book/like/{bookId})
export const deleteLikeBook = (bookId: number) => {
  return axiosApi.delete(`/book/like/${bookId}`);
};

// 관심 책 목록 조회 (GET /profile/me/liked-books)
export const getLikedBooks = () => {
  return axiosApi.get<number[]>("/profile/me/liked-books");  // 응답: 책 ID 리스트
};