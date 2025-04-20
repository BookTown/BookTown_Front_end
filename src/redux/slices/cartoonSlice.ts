import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookDetail } from "../../interfaces/bookInterface";


interface cartoonState {
    cartoon: IBookDetail;
}

const initialState: cartoonState = {
    cartoon: {
        bookId: 0,
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
            state.cartoon = action.payload;
        }
    }
})

export const { setCartoon } = cartoonSlice.actions;
export default cartoonSlice.reducer;
