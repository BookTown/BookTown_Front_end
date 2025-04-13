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

// 프로필 이미지 업로드
export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); // ✅ 정확한 key 이름: file

  try {
    const res = await axiosApi.post("/profile/update/image", formData); // ✅ 헤더 생략
    console.log("✅ 프로필 이미지 업로드 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 프로필 이미지 업로드 실패:", error.response || error.message);
    throw error;
  }
};