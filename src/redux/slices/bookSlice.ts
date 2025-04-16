import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookList, IBookDetail } from "../../interfaces/bookInterface";

// 상태의 각 키를 구분하기 위해 타입을 정의합니다.
interface BookState {
  popular: IBookList | null;
  recent: IBookList | null;
  favorites: number[]; // 즐겨찾기한 책 ID 목록 추가
  banner: IBookDetail | null; // 배너용 도서 추가
}

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
    setBannerBook: (state, action: PayloadAction<IBookDetail>) => {
      state.banner = action.payload;
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