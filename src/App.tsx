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
      dispatch(fetchLikedBooks());
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
