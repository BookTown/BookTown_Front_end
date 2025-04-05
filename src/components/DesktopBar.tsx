import React, { useState } from "react";
import { Search, Clock, BarChart, Settings, Home, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DesktopBar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const menus = [
    { name: '홈', icon: <Home size={28} />, path: '/home' },
    { name: '히스토리', icon: <Clock size={28} />, path: '/history' },
    { name: '랭킹', icon: <BarChart size={28} />, path: '/ranking' },
    { name: '설정', icon: <Settings size={28} />, path: '/settings' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 max-w-[1440px] mx-auto bg-[#FFFAF0] px-4">
        <div className="mx-auto flex justify-between items-center px-4">
          {/* 왼쪽: 햄버거 메뉴 + 로고 */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:opacity-80 rounded-full"
            >
              <Menu size={24} />
            </button>
            <Link to="/home" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="책고을 로고"
                className="w-20 h-20 -my-3"
              />
              <h1 className="text-2xl mt-1">책고을</h1>
            </Link>
          </div>
          
          {/* 오른쪽: 검색 버튼 */}
          <Link to="/search" className="p-2 hover:opacity-80 rounded-full">
            <Search size={24} />
          </Link>
        </div>
      </div>

      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-all duration-500 ease-in-out"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
          
      {/* 사이드바 내용 */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-56 bg-white z-50 p-4 shadow-lg transition-transform duration-500 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:opacity-80 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                to={menu.path}
                key={menu.name}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {menu.icon}
                <span className="text-base">{menu.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DesktopBar;