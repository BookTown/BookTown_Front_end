import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputComponent from "../../components/InputComponent";
import axiosApi from "../../axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

interface IRegister {
  loginId: string;
  name: string;
  password: string;
  confirmPassword: string;
}
function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IRegister>();

  const password = watch("password");

  const registerUser = async (data: IRegister) => {
    const { loginId, name, password } = data;
    const res = await axiosApi.post("/join", {
      loginId,
      name,
      password,
    });
    if (res.status === 200) {
      navigate("/");
    }
  };
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
          <form
            onSubmit={handleSubmit(registerUser)}
            className="w-full sm:max-w-[360px] md:max-w-[500px] space-y-6"
          >
            <InputComponent
              id="name"
              label="닉네임"
              type="text"
              register={register}
            />
            {errors.name && (
              <span className="px-4 text-red-600 w-[60%] font-bold text-center">
                {errors.name.type === "required" && "닉네임을 입력해주세요"}
              </span>
            )}
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
                {errors.password.type === "required" &&
                  "비밀번호를 입력해주세요"}
              </span>
            )}
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              className="w-full h-[40px] px-4 rounded-full bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.25)] placeholder:text-[#A39C9C]"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === password,
              })}
            />
            {errors.confirmPassword && (
              <span className="px-4 text-red-600 w-[60%] font-bold text-center">
                {errors.confirmPassword.type === "required" &&
                  "비밀번호를 한번 더 입력해주세요"}
                {errors.confirmPassword.type === "validate" &&
                  "비밀번호가 일치 하지 않습니다."}
              </span>
            )}
            <Button size="lg" color="pink" type="submit">회원가입</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
