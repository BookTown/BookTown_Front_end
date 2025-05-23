import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TTSState {
  voiceType: 'female' | 'male';
}

const initialState: TTSState = {
  voiceType: 'female'  // 기본값을 female로 설정
};

const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    setVoiceType: (state, action: PayloadAction<'female' | 'male'>) => {
      state.voiceType = action.payload;
    }
  }
});

export const { setVoiceType } = ttsSlice.actions;
export default ttsSlice.reducer;
