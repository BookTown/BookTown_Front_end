import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TTSState {
  voiceType: 'female' | 'male';
}

// 로컬 스토리지에서 저장된 음성 타입을 가져옴
const savedVoiceType = localStorage.getItem('ttsVoiceType');

const initialState: TTSState = {
  voiceType: (savedVoiceType as 'female' | 'male') || 'female'
};

const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    setVoiceType: (state, action: PayloadAction<'female' | 'male'>) => {
      state.voiceType = action.payload;
      // 로컬 스토리지에 설정 저장
      localStorage.setItem('ttsVoiceType', action.payload);
    }
  }
});

export const { setVoiceType } = ttsSlice.actions;
export default ttsSlice.reducer;
