import { configureStore } from "@reduxjs/toolkit";

import booksReducer from "./slices/bookSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer, // 도서 관련 상태 관리 리듀서(인기, 최신)
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
