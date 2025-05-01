import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookDetail } from "../../interfaces/bookInterface";

interface CartoonState {
    cartoon: IBookDetail;
}

// 작가 정보 처리 함수
const processAuthor = (book: IBookDetail): IBookDetail => {
    if (book.author === null || book.author === undefined || book.author === '') {
        return { ...book, author: '작자미상' };
    }
    return book;
};

const initialState: CartoonState = {
    cartoon: {
        id: 0,
        title: "",
        author: "",
        summaryUrl: "",
        thumbnailUrl: "",
        createdAt: "",
        scenes: [], // IScene 배열로 구체적으로 타입 정의
        likeCount: 0
    }
}

const cartoonSlice = createSlice({
    name: "cartoon",
    initialState,
    reducers: {
        setCartoon: (state, action: PayloadAction<IBookDetail>) => {        
            state.cartoon = processAuthor(action.payload);
        }
    }
})

export const { setCartoon } = cartoonSlice.actions;
export default cartoonSlice.reducer;
