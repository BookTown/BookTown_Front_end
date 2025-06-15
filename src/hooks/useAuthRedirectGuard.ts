import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenValidation } from './useTokenValidation';

export const useAuthRedirectGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, tokenStatus } = useTokenValidation();

  useEffect(() => {
    const publicRoutes = ['/', '/register', '/oauth/callback'];
    
    // 공개 라우트가 아니고 인증되지 않은 경우 로그인 페이지로 리다이렉션
    if (!publicRoutes.includes(location.pathname) && isAuthenticated === false) {
      // 토큰 상태에 따라 다른 메시지 표시
      if (tokenStatus === 'expired') {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      }
      
      // redirectPath 저장 후 로그인 페이지로 이동
      sessionStorage.setItem('redirectPath', location.pathname);
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate, isAuthenticated, tokenStatus]);

  return { isAuthenticated };
};