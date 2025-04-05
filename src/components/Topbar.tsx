import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[28rem] flex justify-between items-center bg-[#FFFAF0] border-b border-gray-300">
      {/* 로고+이름 누르면 홈화면으로 이동 */}
      <Link to="/home" className="flex items-center">
        <img
          src="/images/logo.png"
          alt="책고을 로고"
          className="w-20 h-20 -my-3 -ml-1"
        />
        <h1 className="text-2xl -ml-1 mt-1">책고을</h1>
      </Link>

      <Link to="/search" className="pr-3">
        <Search size={32} />
      </Link>
    </div>
  );
};

export default TopBar;
