import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookList, IBookDetail } from "../../interfaces/bookInterface";

// 상태의 각 키를 구분하기 위해 타입을 정의합니다.
interface BookState {
  popular: IBookList | null;
  recent: IBookList | null;
  favorites: number[]; // 즐겨찾기한 책 ID 목록 추가
  banner: IBookDetail | null; // 배너용 도서 추가
}

// 작가 정보 처리 헬퍼 함수
const processAuthor = <T extends { author?: string | null }>(data: T): T => {
  if (data.author === null || data.author === undefined || data.author === '') {
    return { ...data, author: '작자미상' };
  }
  return data;
};

// 책 배열에 대한 작가 정보 처리 함수
const processBookArray = (books: IBookList | null): IBookList | null => {
  if (!books || !Array.isArray(books)) return books;
  return books.map(book => processAuthor(book));
};

// 초기 상태 정의
const initialState: BookState = {
  popular: null,
  recent: null,
  favorites: [],
  banner: null,
};

// 리듀서 정의
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPopularBooks: (state, action: PayloadAction<IBookList>) => {
      state.popular = processBookArray(action.payload);
    },
    setRecentBooks: (state, action: PayloadAction<IBookList>) => {
      state.recent = processBookArray(action.payload);
    },
    addToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setBannerBook: (state, action: PayloadAction<IBookDetail>) => {
      state.banner = processAuthor(action.payload);
    },
  },
});

export const { 
  setPopularBooks, 
  setRecentBooks,
  addToFavorites,
  removeFromFavorites,
  setBannerBook
} = bookSlice.actions;

export default bookSlice.reducer;