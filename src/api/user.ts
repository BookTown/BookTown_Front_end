import axiosApi from '../axios';

// 내 정보 조회
export const fetchUserProfile = async () => {
  const res = await axiosApi.get('/users/me');
  return res.data;
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