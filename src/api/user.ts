import axiosApi from '../axios';

// 내 정보 조회
export const fetchUserProfile = async () => {
  try {
    const res = await axiosApi.get('/users/me');
    console.log("✅ 사용자 정보 응답:", res.data); // Debugging log
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