import { useState, useEffect } from 'react';

export const useTokenValidation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // JWT 토큰의 payload 부분 디코딩
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // 만료 시간 확인
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          // 토큰이 만료된 경우 토큰 삭제
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
          console.log('토큰이 만료되었습니다.');
        } else {
          setIsAuthenticated(true);
          console.log('유효한 토큰입니다.');
        }
      } catch (error) {
        console.error('토큰 검증 중 오류 발생:', error);
        setIsAuthenticated(false);
      }
    };

    validateToken();

    // 주기적으로 토큰 검사 (1분마다)
    const intervalId = setInterval(validateToken, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { isAuthenticated };
};