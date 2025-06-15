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
      console.log('OAuth 콜백: 토큰을 받았습니다');
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      // 로그인 성공 후 좋아요 목록 가져오기
      console.log('🔄 OAuth 로그인 후 좋아요 목록 요청 시작');
      dispatch(fetchLikedBooks())
        .then((result) => {
          if (fetchLikedBooks.fulfilled.match(result)) {
            console.log('OAuth 로그인 후 좋아요 목록 로드 성공:', result.payload);
          } else {
            console.error('OAuth 로그인 후 좋아요 목록 로드 실패:', result.payload);
          }
          
          // 저장된 리다이렉션 경로가 있으면 해당 경로로, 없으면 홈으로 이동
          const redirectPath = sessionStorage.getItem('redirectPath') || '/home';
          sessionStorage.removeItem('redirectPath'); // 사용 후 삭제
          navigate(redirectPath);
        })
        .catch(error => {
          console.error('OAuth 로그인 후 좋아요 요청 오류:', error);
          navigate('/home'); // 오류가 있어도 홈으로 이동
        });
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