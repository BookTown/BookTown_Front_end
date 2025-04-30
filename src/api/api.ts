import axiosApi from "../axios";
import { IBookList, IScene } from "../interfaces/bookInterface";

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

// 도서 줄거리 조회
export const fetchBookSummary = async (bookId: string | undefined): Promise<IScene[]> => {
  console.log('도서 줄거리 API 호출 시작');
  try {
    if (!bookId) {
      throw new Error('도서 ID가 없습니다');
    }
    const response = await axiosApi.post<IScene[]>('/summaries/lookup', { bookId: Number(bookId) });
    console.log('도서 줄거리 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('도서 줄거리 API 오류:', error);
    throw error;
  }
};

