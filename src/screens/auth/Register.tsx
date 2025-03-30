import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[28rem] min-h-[100dvh] border-x border-solid border-gray-300 bg-[#FFFAF0] pb-12 px-7 font-ongleaf">
        {/* 뒤로 가기 */}
        <Link to={"/"} className="text-[32px] mt-10">
          ←
        </Link>
        <h1 className="px-2 pt-[8rem] pb-10 text-[48px]">회원가입</h1>
        <div className="flex flex-col items-center justify-center">
          {/* 로그인 폼 */}
          <div className="w-full sm:max-w-[360px] md:max-w-[500px] space-y-6">
            <input
              type="text"
              placeholder="닉네임"
              className="w-full h-[40px] px-4 rounded-full bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.25)] placeholder:text-[#A39C9C]"
            />
            <input
              type="text"
              placeholder="아이디"
              className="w-full h-[40px] px-4 rounded-full bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.25)] placeholder:text-[#A39C9C]"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full h-[40px] px-4 rounded-full bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.25)] placeholder:text-[#A39C9C]"
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full h-[40px] px-4 rounded-full bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.25)] placeholder:text-[#A39C9C]"
            />
            <button className="w-full h-[40px] bg-[#C75C5C] text-white rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

