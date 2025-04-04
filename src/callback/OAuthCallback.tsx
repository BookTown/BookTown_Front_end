import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 추출
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    // URL에서 토큰 제거 (브라우저 히스토리에서 토큰 노출 방지)
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.protocol + "//" + 
                       window.location.host + 
                       window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (accessToken) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // 메인 페이지로 리다이렉트
      navigate('/home');
    } else {
      // 토큰이 없는 경우 로그인 페이지로 리다이렉트
      console.error('OAuth 콜백: 토큰을 찾을 수 없습니다');
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#FFFAF0] flex flex-col items-center justify-center">
      <p className="text-xl">로그인 중입니다...</p>
    </div>
  );
};

export default OAuthCallback;
