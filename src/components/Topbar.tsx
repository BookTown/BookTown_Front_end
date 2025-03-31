import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="flex justify-between items-center bg-[#FFFAF0] border-b border-gray-300">
      <div className="flex items-center">
        <img
          src="/images/logo.png"
          alt="책고을 로고"
          className="w-16 h-16 -my-3 -ml-1"
        />
        <h1 className="text-xl -ml-1 mt-1">책고을</h1>
      </div>
      <Link to="/search" className="pr-3">
        <Search size={28} />
      </Link>
    </div>
  );
};

export default TopBar;
