import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBook } from "../../interfaces/bookInterface";
 
 // 상태의 각 키를 구분하기 위해 타입을 정의합니다.
 interface BooksState {
   popular: IBook;
   recent: IBook;
 }
 
 // 초기 상태 정의
 const initialState: BooksState = {
   popular: {
     totalElements: 0,
     totalPages: 0,
     size: 0,
     content: [],
     number: 0,
     sort: {
       empty: true,
       unsorted: true,
       sorted: true,
     },
     first: true,
     last: true,
     numberOfElements: 0,
     pageable: {
       offset: 0,
       sort: {
         empty: true,
         unsorted: true,
         sorted: true,
       },
       pageSize: 0,
       paged: true,
       pageNumber: 0,
       unpaged: true,
     },
     empty: true,
   },
   recent: {
     totalElements: 0,
     totalPages: 0,
     size: 0,
     content: [],
     number: 0,
     sort: {
       empty: true,
       unsorted: true,
       sorted: true,
     },
     first: true,
     last: true,
     numberOfElements: 0,
     pageable: {
       offset: 0,
       sort: {
         empty: true,
         unsorted: true,
         sorted: true,
       },
       pageSize: 0,
       paged: true,
       pageNumber: 0,
       unpaged: true,
     },
     empty: true,
   },
 };
 
 // 리듀서 정의
 const booksSlice = createSlice({
   name: "books",
   initialState,
   reducers: {
     setPopularBooks: (state, action: PayloadAction<IBook>) => {
       state.popular = action.payload;
     },
     setRecentBooks: (state, action: PayloadAction<IBook>) => {
       state.recent = action.payload;
     },
   },
 });
 
 export const { setPopularBooks, setRecentBooks } = booksSlice.actions;
 export default booksSlice.reducer;