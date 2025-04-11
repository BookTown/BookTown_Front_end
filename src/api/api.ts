import axiosApi from "../axios";
import { IBookList } from "../interfaces/bookInterface";

// 인기 도서 조회 (좋아요 수 기준)
export const fetchPopularBooks = async (): Promise<IBookList> => {
  const response = await axiosApi.get<IBookList>('/book/popular');
  return response.data;
};

// 최신 도서 조회
export const fetchRecentBooks = async (): Promise<IBookList> => {
  const response = await axiosApi.get<IBookList>('/book/recent');
  return response.data;
};

