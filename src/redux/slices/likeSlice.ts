import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getLikedBooks, postLikeBook, deleteLikeBook } from "../../api/api";
import { RootState } from "../store";


// 상태 인터페이스 정의
interface LikeState {
  likedBooks: number[];
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: LikeState = {
  likedBooks: [],
  loading: false,
  error: null,
};

// 비동기 액션: 좋아요 목록 조회
export const fetchLikedBooks = createAsyncThunk(
  "likes/fetchLikedBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLikedBooks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "좋아요 목록을 불러오는데 실패했습니다");
    }
  }
);

// 비동기 액션: 좋아요 추가
export const addLike = createAsyncThunk(
  "likes/addLike",
  async (bookId: number, { rejectWithValue }) => {
    try {
      await postLikeBook(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || "좋아요 추가에 실패했습니다");
    }
  }
);

// 비동기 액션: 좋아요 제거
export const removeLike = createAsyncThunk(
  "likes/removeLike",
  async (bookId: number, { rejectWithValue }) => {
    try {
      await deleteLikeBook(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || "좋아요 제거에 실패했습니다");
    }
  }
);

// 좋아요 슬라이스
const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 좋아요 목록 조회
      .addCase(fetchLikedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedBooks.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.loading = false;
        state.likedBooks = action.payload;
      })
      .addCase(fetchLikedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 좋아요 추가
      .addCase(addLike.fulfilled, (state, action: PayloadAction<number>) => {
        if (!state.likedBooks.includes(action.payload)) {
          state.likedBooks.push(action.payload);
        }
      })
      
      // 좋아요 제거
      .addCase(removeLike.fulfilled, (state, action: PayloadAction<number>) => {
        state.likedBooks = state.likedBooks.filter(id => id !== action.payload);
      });
  },
});

// Selector: 책이 좋아요 되어있는지 확인
export const selectIsLiked = (state: RootState, bookId: number) => 
  state.likes.likedBooks.includes(bookId);
  
// Selector: 좋아요 목록 반환
export const selectLikedBooks = (state: RootState) => state.likes.likedBooks;

export default likeSlice.reducer;

export {};