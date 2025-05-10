// apis/user.ts

import axiosApi from '../axios';

export interface UpdateProfileInfoPayload {
  username: string;
  introduction: string;
  score: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

// 내 정보 조회
export const fetchUserProfile = async () => {
  try {
    const res = await axiosApi.get('/users/me');
    console.log("✅ 사용자 정보 응답:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 사용자 정보 요청 실패:", error.response || error.message);
    throw error;
  }
};

// 로그아웃
export const logoutUser = async () => {
  const res = await axiosApi.post('/users/logout');
  return res.data;
};

// 회원 탈퇴
export const deleteUser = async () => {
  const res = await axiosApi.delete('/users/delete');
  return res.data;
};

// 사용자 프로필 정보 수정
export const updateProfileInfo = async (
  userId: number,
  data: UpdateProfileInfoPayload
) => {
  try {
    const res = await axiosApi.patch(`/profile/update/${userId}`, data);
    console.log("✅ 프로필 정보 수정 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 프로필 수정 실패:", error.response || error.message);
    throw error;
  }
};

// 프로필 이미지 수정
export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axiosApi.post("/profile/update/image", formData);
    console.log("✅ 프로필 이미지 업로드 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 프로필 이미지 업로드 실패:", error.response || error.message);
    throw error;
  }
};

// 이미지 업로드 삭제
export const deleteProfileImage = async () => {
  try {
    const res = await axiosApi.delete("/profile/delete/image");
    console.log("✅ 프로필 이미지 삭제 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 프로필 이미지 삭제 실패:", error.response || error.message);
    throw error;
  }
};

// 사용자 퀴즈 히스토리 조회
export const fetchUserQuizHistory = async (userId: number) => {
  console.log('사용자 퀴즈 히스토리 조회 API 호출 시작');
  try {
    const res = await axiosApi.get(`/history/${userId}`);
    console.log("✅ 퀴즈 히스토리 조회 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 퀴즈 히스토리 조회 실패:", error.response || error.message);
    throw error;
  }
};

// 특정 책에 대한 퀴즈 히스토리 상세 조회
export const fetchBookQuizHistoryDetail = async (userId: number, bookId: number) => {
  console.log(`책 퀴즈 상세 히스토리 조회 API 호출 시작 (userId: ${userId}, bookId: ${bookId})`);
  try {
    const res = await axiosApi.get(`/history/${userId}/book/${bookId}`);
    console.log("✅ 책 퀴즈 상세 히스토리 조회 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 책 퀴즈 상세 히스토리 조회 실패:", error.response || error.message);
    throw error;
  }
};