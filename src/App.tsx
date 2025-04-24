import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { fetchLikedBooks } from "./redux/slices/likeSlice";

function App() {
  const dispatch = useAppDispatch();

  // 앱 초기화 시 사용자가 로그인 상태라면 좋아요 목록 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('토큰 존재: 좋아요 목록 불러오기 시도');
      // 먼저 비동기 액션을 디스패치하고 Promise를 반환받음
      dispatch(fetchLikedBooks())
        .then((result) => {
          // 성공한 경우
          if (fetchLikedBooks.fulfilled.match(result)) {
            console.log('좋아요 목록 로드 성공:', result.payload);
          } 
          // 실패한 경우
          else {
            console.error('좋아요 목록 로드 실패:', result.payload);
          }
        })
        .catch(error => {
          console.error('좋아요 목록 요청 오류:', error);
        });
    }
  }, [dispatch]);

  return (
    <div className="flex justify-center md:bg-[#FFFAF0]">
      <div className="w-full max-w-[28rem] min-h-[100dvh] bg-[#FFFAF0] flex flex-col font-ongleaf  md:max-w-[1440px] md:mx-auto md:px-6">
        <Outlet/>
      </div>
    </div>
  );
}

export default App;
