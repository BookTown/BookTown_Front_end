import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getLikedBooks, toggleLikeBook } from "../../api/api";
import { RootState } from "../store";
import { IBookDetail } from "../../interfaces/bookInterface";
import { createSelector } from "reselect";

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
      console.log('서버에서 좋아요 목록을 가져왔습니다:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('좋아요 목록 가져오기 실패:', error);
      return rejectWithValue(error.message || "좋아요 목록을 불러오는데 실패했습니다");
    }
  }
);

// 비동기 액션: 좋아요 토글 (추가/삭제 통합)
export const toggleLike = createAsyncThunk(
  "likes/toggleLike",
  async (bookId: number, { rejectWithValue, getState }) => {
    try {
      const response = await toggleLikeBook(bookId);
      
      // 토글 결과에 따라 처리 - API 응답 확인 필요
      return {
        bookId,
        isLiked: response.data, // API 토글 후 현재 좋아요 상태(true/false)를 반환한다고 가정
        wasLiked: selectIsLiked(getState() as RootState, bookId) // 이전 상태
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "좋아요 토글에 실패했습니다");
    }
  }
);

// 좋아요 슬라이스
const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    // 로그아웃 시 상태 초기화를 위한 액션 추가
    clearLikes: (state) => {
      state.likedBooks = [];
      state.likedBookDetails = [];
      state.loading = false;
      state.detailsLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 좋아요 목록 조회
      .addCase(fetchLikedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedBooks.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.loading = false;
        console.log('fetchLikedBooks 액션 데이터:', action.payload);
        // 받은 데이터가 배열인지 확인 후 상태 업데이트
        state.likedBooks = Array.isArray(action.payload) ? action.payload : [];
        console.log('상태 업데이트 후 likedBooks:', state.likedBooks);
      })
      .addCase(fetchLikedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 좋아요 토글 (addLike와 removeLike 대체)
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { bookId, isLiked } = action.payload;
        
        if (isLiked) {
          // 좋아요 추가
          if (Array.isArray(state.likedBooks) && !state.likedBooks.includes(bookId)) {
            state.likedBooks.push(bookId);
          }
        } else {
          // 좋아요 제거
          if (Array.isArray(state.likedBooks)) {
            state.likedBooks = state.likedBooks.filter(id => id !== bookId);
          }
          
          // 상세 정보도 함께 제거
          if (Array.isArray(state.likedBookDetails)) {
            state.likedBookDetails = state.likedBookDetails.filter(book => book.id !== bookId);
          }
        }
      });
  },
});

// Selector: 책이 좋아요 되어있는지 확인 - 일반 선택자
export const selectIsLiked = (state: RootState, bookId: number) => 
  Array.isArray(state.likes.likedBooks) && state.likes.likedBooks.includes(bookId);

// 메모이제이션된 선택자 - 특정 bookId에 대한 좋아요 상태만 추적
export const makeSelectIsLiked = () => {
  return createSelector(
    [(state: RootState) => state.likes.likedBooks, 
      (_: RootState, bookId: number) => bookId],
    (likedBooks, bookId) => 
      Array.isArray(likedBooks) && likedBooks.includes(bookId)
  );
};
// Selector: 좋아요 ID 목록 반환
export const selectLikedBooks = (state: RootState) => 
  state.likes.likedBooks;

// Selector: 좋아요한 책 상세 정보 목록 반환
export const selectLikedBookDetails = (state: RootState) => 
  state.likes.likedBookDetails;

// Selector: 좋아요 로딩 상태
export const selectLikesLoading = (state: RootState) =>
  state.likes.loading || state.likes.detailsLoading;

export default likeSlice.reducer;

// 액션 내보내기
export const { clearLikes } = likeSlice.actions;