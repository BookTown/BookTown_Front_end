import React from "react";

const Login = () => {
  return (
    <div className="w-full max-w-[28rem] min-h-[100dvh] bg-[#FFFAF0] flex flex-col items-center px-7 py-16 font-ongleaf">
      {/* 마스코트 */}
      <div className="mb-6">
        <img 
          src="/images/Mascot.png" 
          alt="책고을 마스코트" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* 로고 + 타이틀 */}
      <div className="flex items-center mb-8">
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

      {/* 소셜 로그인 버튼 */}
      <div className="w-full space-y-4 mt-10">
        {/* 카카오 로그인 */}
        <button
          className="w-full h-[40px] bg-[#FEE500] text-[#3A1D1E] rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80 transition-opacity duration-300 ease-in-out flex items-center justify-center text-[16px] font-medium"
        >
          <img 
            src="/images/Kakao Logo.png" 
            alt="카카오 로고" 
            className="w-5 h-5 mr-2" 
          />
          카카오로 시작하기
        </button>
        
        {/* 구글 로그인 */}
        <button
          className="w-full h-[40px] bg-white text-[#3A1D1E] border border-gray-300 rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80 transition-opacity duration-300 ease-in-out flex items-center justify-center text-[16px] font-medium"
        >
          <img 
            src="/images/Google Logo.png" 
            alt="구글 로고" 
            className="w-5 h-5 mr-2" 
          />
          google로 시작하기
        </button>
        
        {/* 네이버 로그인 */}
        <button
          className="w-full h-[40px] bg-[#03C75A] text-white rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80 transition-opacity duration-300 ease-in-out flex items-center justify-center text-[16px] font-medium"
        >
          <img 
            src="/images/Naver Logo.png" 
            alt="네이버 로고" 
            className="w-5 h-5 mr-2" 
          />
          네이버로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;

