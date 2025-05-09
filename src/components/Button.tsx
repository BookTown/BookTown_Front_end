import React from "react";

type ButtonProps = {
  size?: "sm" | "md" | "lg";
  color?: "pink" | "white" | "gray";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean; // ✅ 추가
  children: React.ReactNode;
  className?: string;
};

const sizeClasses = {
  sm: "w-[90px] h-[32px] text-[12px] md:w-[100px] md:h-[36px] md:text-[14px] lg:w-[120px] lg:h-[40px]",
  md: "w-[120px] h-[36px] text-[14px] md:w-[160px] md:h-[40px] md:text-[16px] lg:w-[200px] lg:h-[44px]",
  lg: "w-full max-w-[340px] h-[40px] text-[24px] rounded-xl",
};

const colorClasses = {
  pink: "bg-[#C75C5C] text-white hover:bg-[#b54d4d] active:bg-[#a44444]",
  white: "bg-white text-[#C75C5C] border border-[#C75C5C] hover:bg-[#fff8f8] hover:border-[#b54d4d] hover:text-[#b54d4d] active:bg-[#fff0f0]",
  gray: "bg-[#95A5A6] text-white hover:bg-[#7f8c8d] active:bg-[#6c7879]",
};

const Button: React.FC<ButtonProps> = ({
  size = "lg",
  color = "pink",
  type = "button",
  onClick,
  disabled = false, // 기본값 설정
  children,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled} 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full
        font-medium
        shadow-sm
        transition-all duration-200 ease-in-out
        hover:transform hover:scale-[1.02] hover:shadow-md
        active:transform active:scale-[0.98] active:shadow-sm
        outline-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;