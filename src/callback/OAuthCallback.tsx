import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { fetchLikedBooks } from '../redux/slices/likeSlice';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // URL에서 토큰 추출
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // 로그인 성공 후 좋아요 목록 가져오기
      dispatch(fetchLikedBooks());
      
      // 메인 페이지로 리다이렉트
      navigate('/home');
    } else {
      // 토큰이 없는 경우 로그인 페이지로 리다이렉트
      console.error('OAuth 콜백: 토큰을 찾을 수 없습니다');
      navigate('/');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#FFFAF0] flex flex-col items-center justify-center">
      <p className="text-xl">로그인 중입니다...</p>
    </div>
  );
};

export default OAuthCallback;
