import React from "react";

type ButtonProps = {
  size?: "sm" | "md" | "lg";
  color?: "pink" | "white";
  type?: "button" | "submit"
  onClick?: () => void;
  children: React.ReactNode;
};

const sizeClasses = {
  sm: "w-[100px] h-[36px] text-[12px]",
  md: "w-[7rem] h-[28px] text-sm",
  lg: "w-full h-[40px] text-[20px]",
};

const colorClasses = {
  pink: "bg-[#C75C5C] text-white",
  white: "bg-white text-[#C75C5C]",
};

const Button: React.FC<ButtonProps> = ({
  size = "lg",
  color = "pink",
  type,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full 
        shadow-[4px_4px_8px_rgba(0,0,0,0.25)] 
        hover:opacity-80
        transition-opacity duration-300 ease-in-out
      `}
    >
      {children}
    </button>
  );
};

export default Button;