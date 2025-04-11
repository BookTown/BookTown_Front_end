import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookList } from "../../interfaces/bookInterface";

// 상태의 각 키를 구분하기 위해 타입을 정의합니다.
interface BooksState {
  popular: IBookList;
  recent: IBookList;
  favorites: number[]; // 즐겨찾기한 책 ID 목록 추가
}

// 초기 상태 정의
const initialState: BooksState = {
  popular: [],
  recent: [],
  favorites: [],
};

// 리듀서 정의
const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPopularBooks: (state, action: PayloadAction<IBookList>) => {
      state.popular = action.payload;
    },
    setRecentBooks: (state, action: PayloadAction<IBookList>) => {
      state.recent = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
  },
});

export const { 
  setPopularBooks, 
  setRecentBooks,
  addToFavorites,
  removeFromFavorites 
} = booksSlice.actions;

export default booksSlice.reducer;