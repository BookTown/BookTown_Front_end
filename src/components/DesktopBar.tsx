import React from "react";
import { Search, Clock, BarChart, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DesktopBar = () => {
  const location = useLocation();
  
  const menus = [
    { name: '히스토리', icon: <Clock size={24} />, path: '/history' },
    { name: '랭킹', icon: <BarChart size={24} />, path: '/ranking' },
    { name: '설정', icon: <Settings size={24} />, path: '/settings' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 max-w-[1440px] mx-auto bg-[#FFFAF0] px-4">
      <div className=" mx-auto flex justify-between items-center px-4">
        {/* 왼쪽: 로고+이름 (홈으로 이동) */}
        <Link to="/home" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="책고을 로고"
            className="w-20 h-20 -my-3"
          />
          <h1 className="text-2xl mt-1">책고을</h1>
        </Link>
        
        {/* 중앙: 검색창 */}
        <div className="flex-1 max-w-[800px] mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="책 이름을 입력하세요"
              className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        
        {/* 오른쪽: 네비게이션 메뉴 */}
        <div className="flex items-center gap-8">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                to={menu.path}
                key={menu.name}
                className={`flex flex-col items-center text-xs ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}
              >
                {menu.icon}
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DesktopBar;