import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthRedirectGuard } from "./hooks/useAuthRedirectGuard";
import { useFetchLikedBooks } from "./hooks/useFetchLikedBooks";

function App() {
  // 인증 가드 훅 사용
  useAuthRedirectGuard();
  
  // 좋아요 목록 불러오기 훅 사용
  useFetchLikedBooks();

  return (
    <div className="flex justify-center bg-[#FFFAF0]">
      <div className="w-full max-w-[28rem] min-h-[100dvh] flex flex-col md:max-w-[1440px] md:mx-auto md:px-6">
        <Outlet/>
      </div>
    </div>
  );
}

export default App;