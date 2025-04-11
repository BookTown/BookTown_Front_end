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

