import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/bookSlice";
import cartoonReducer from "./slices/cartoonSlice";
import likesReducer from "./slices/likeSlice";
import ttsReducer from "./slices/ttsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer, // 도서 관련 상태 관리 리듀서(인기, 최신)
    cartoon: cartoonReducer,
    likes: likesReducer,  // 좋아요 관련 상태 관리 리듀서
    tts: ttsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;