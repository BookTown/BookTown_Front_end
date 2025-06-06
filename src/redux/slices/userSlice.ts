import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number | null;
  email: string | null;
  username: string | null;
  profileImage: string | null;
  role: 'USER' | 'ADMIN' | null;
  score: number | null;
  introduction: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
  profileImage: null,
  role: null,
  score: null,
  introduction: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Omit<UserState, 'isAuthenticated'>>) => {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    },
    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;