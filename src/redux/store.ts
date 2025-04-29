import { configureStore } from "@reduxjs/toolkit";

import booksReducer from "./slices/bookSlice";
import likesReducer from "./slices/likeSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer, // 도서 관련 상태 관리 리듀서(인기, 최신)
    likes: likesReducer,  // 좋아요 관련 상태 관리 리듀서
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;