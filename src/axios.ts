import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosApi = axios.create({
  baseURL: "https://booktown.site/api",
  withCredentials: true,
});

const handleRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// 에러 처리
const handleResponseInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse> => {
  // 인증 관련 오류 (401: 인증 실패, 403: 권한 없음)
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    console.log('인증 오류 발생:', error.response.status);
    
    // 현재 URL 저장 (로그인 후 돌아오기 위해)
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && !currentPath.includes('/oauth')) {
      sessionStorage.setItem('redirectPath', currentPath);
    }
    
    // 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // 로그인 페이지로 리다이렉트
    window.location.href = '/';
  }
  
  return Promise.reject(error);
};

axiosApi.interceptors.request.use(
  handleRequestInterceptor,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => handleResponseInterceptor(error)
);

export default axiosApi;