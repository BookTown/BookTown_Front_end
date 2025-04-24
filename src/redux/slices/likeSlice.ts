import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getLikedBooks, postLikeBook, deleteLikeBook } from "../../api/api";
import { RootState } from "../store";
import { IBookDetail } from "../../interfaces/bookInterface";

// 상태 인터페이스 정의 개선
interface LikeState {
  likedBooks: number[];        // 좋아요한 책 ID 목록
  likedBookDetails: IBookDetail[]; // 좋아요한 책 상세 정보 목록
  loading: boolean;
  detailsLoading: boolean;     // 상세 정보 로딩 여부
  error: string | null;
}

// 초기 상태
const initialState: LikeState = {
  likedBooks: [],
  likedBookDetails: [],
  loading: false,
  detailsLoading: false,
  error: null,
};

// 비동기 액션: 좋아요 ID 목록 조회
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

// 비동기 액션: 사용자의 관심 책 상세 정보 조회 (새로 추가)
export const fetchLikedBookDetails = createAsyncThunk(
  "likes/fetchLikedBookDetails",
  async (userId: number, { rejectWithValue }) => {
    try {
      // API 호출 위치 수정 필요
      const response = await fetch(`/api/profile/${userId}/liked-books`);
      
      if (!response.ok) {
        throw new Error('관심 책 조회에 실패했습니다');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "관심 책 상세 정보를 불러오는데 실패했습니다");
    }
  }
);

// 비동기 액션: 좋아요 추가
export const addLike = createAsyncThunk(
  "likes/addLike",
  async (bookId: number, { rejectWithValue }) => {
    try {
      // API 응답으로 불린값 받는 것 처리
      const response = await postLikeBook(bookId);
      // API가 성공했을 때만 상태 업데이트
      if (response.data === true) {
        return bookId;
      } else {
        return rejectWithValue("좋아요 추가에 실패했습니다");
      }
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
      // API 응답으로 불린값 받는 것 처리
      const response = await deleteLikeBook(bookId);
      // API가 성공했을 때만 상태 업데이트
      if (response.data === true) {
        return bookId;
      } else {
        return rejectWithValue("좋아요 제거에 실패했습니다");
      }
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
      
      // 좋아요한 책 상세 정보 조회 (새로 추가)
      .addCase(fetchLikedBookDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchLikedBookDetails.fulfilled, (state, action: PayloadAction<IBookDetail[]>) => {
        state.detailsLoading = false;
        state.likedBookDetails = action.payload;
      })
      .addCase(fetchLikedBookDetails.rejected, (state, action) => {
        state.detailsLoading = false;
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
        // 상세 정보도 함께 제거
        state.likedBookDetails = state.likedBookDetails.filter(book => book.id !== action.payload);
      });
  },
});

// Selector: 책이 좋아요 되어있는지 확인
export const selectIsLiked = (state: RootState, bookId: number) => 
  state.likes.likedBooks.includes(bookId);
  
// Selector: 좋아요 ID 목록 반환
export const selectLikedBooks = (state: RootState) => 
  state.likes.likedBooks;

// Selector: 좋아요한 책 상세 정보 목록 반환 (새로 추가)
export const selectLikedBookDetails = (state: RootState) => 
  state.likes.likedBookDetails;

// Selector: 좋아요 로딩 상태
export const selectLikesLoading = (state: RootState) =>
  state.likes.loading || state.likes.detailsLoading;

export default likeSlice.reducer;