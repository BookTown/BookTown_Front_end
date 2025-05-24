// apis/user.ts

import axiosApi from '../axios';
import { UserProfileData } from '../interfaces/rankInterface';

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

// 사용자 퀴즈 히스토리 조회 (책별로 그룹화된 히스토리)
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

// 특정 책에 대한 퀴즈 히스토리 상세 조회 (그룹 인덱스별)
export const fetchBookQuizHistoryDetail = async (userId: number, bookId: number, groupIndex: number) => {
  console.log(`책 퀴즈 상세 히스토리 조회 API 호출 시작 (userId: ${userId}, bookId: ${bookId}, groupIndex: ${groupIndex})`);
  try {
    const res = await axiosApi.get(`/history/${userId}/book/${bookId}/${groupIndex}`);
    console.log("✅ 책 퀴즈 상세 히스토리 조회 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 책 퀴즈 상세 히스토리 조회 실패:", error.response || error.message);
    throw error;
  }
};

// 특정 책의 퀴즈 히스토리 삭제 (그룹 인덱스별)
export const deleteBookQuizHistory = async (userId: number, bookId: number, groupIndex: number) => {
  console.log(`책 퀴즈 히스토리 삭제 API 호출 시작 (userId: ${userId}, bookId: ${bookId}, groupIndex: ${groupIndex})`);
  try {
    const res = await axiosApi.delete(`/history/${userId}/book/${bookId}/${groupIndex}`);
    console.log("✅ 책 퀴즈 히스토리 삭제 완료:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ 책 퀴즈 히스토리 삭제 실패:", error.response || error.message);
    throw error;
  }
};

// 특정 사용자 프로필 조회
export const fetchUserProfileById = async (userId: number): Promise<UserProfileData> => {
  console.log(`사용자 프로필 조회 API 호출 시작 (userId: ${userId})`);
  try {
    const response = await axiosApi.get<UserProfileData>(`/profile/${userId}`);
    console.log('사용자 프로필 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 프로필 API 오류:', error);
    throw error;
  }
};