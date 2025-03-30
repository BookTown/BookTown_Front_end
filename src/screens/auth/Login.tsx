import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="">
      <div className="w-full max-w-[28rem] min-h-[100dvh] border-x border-solid border-gray-300 bg-[#FFFAF0] flex flex-col justify-center pb-12 px-7 font-ongleaf">
        {/* 로고 + 타이틀 */}
        <div className="flex justify-center mt-16 mb-16 -ml-10">
          <img
            src="/images/logo.png"
            alt="책고을 로고"
            className="w-32 h-32 -mt-6 -mr-2"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-[72px] text-[#222] leading-none">
              책고을
            </h1>
            <p className="text-[15px] text-[#A39C9C] leading-tight w-[110px]">
              고전문학 그림책을 읽고
              <br />
              퀴즈로 학습해봅시다
            </p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <div className="w-full space-y-6">
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
          <button className="w-full h-[40px] bg-[#C75C5C] text-white rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80">
            로그인
          </button>
        </div>

        {/* 회원가입 링크 */}
        <div className="text-[18px] mt-11 mb-16 text-sm text-center text-[#232121] flex flex-col items-center">
          <span>아직 회원이 아니신가요?</span>
          <Link
            to={"/register"}
            className="text-[18px] text-cyan-400 mt-1 underline hover:opacity-60"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

