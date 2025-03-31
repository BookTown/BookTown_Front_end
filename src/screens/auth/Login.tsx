import React from "react";
import { Link, useNavigate } from "react-router-dom";
import InputComponent from "../../components/InputComponent";
import { useForm } from "react-hook-form";
import axiosApi from "../../axios";
import Button from "../../components/Button";

interface ILogin {
  loginId: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const navigate = useNavigate();

  const loginUser = async (data: ILogin) => {
    try {
      const { loginId, password } = data;
      const res = await axiosApi.post("/users/login", {
        username: loginId,
        password
      });
      
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/home");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[28rem] min-h-[100dvh] bg-[#FFFAF0] flex flex-col justify-center pb-12 px-7 font-ongleaf">
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
        <form 
          onSubmit={handleSubmit(loginUser)}
          className="w-full space-y-6">
          <InputComponent
            id="loginId"
            label="아이디"
            type="text"
            register={register}
          />
          {errors.loginId && (
          <span className="px-4 text-red-600 w-[60%] font-bold text-center">
            {errors.loginId.type === "required" && "아이디를 입력해주세요"}
          </span>
          )}
          <InputComponent
            id="password"
            label="비밀번호"
            type="password"
            register={register}
          />
          {errors.password && (
          <span className="px-4 text-red-600 w-[60%] font-bold text-center">
            {errors.password.type === "required" && "비밀번호를 입력해주세요"}
          </span>
          )}
          {/* <button className="w-full h-[40px] bg-[#C75C5C] text-white rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80">
            로그인
          </button> */}
          <Button size="lg" color="pink" type="submit">로그인</Button>
        </form>

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

