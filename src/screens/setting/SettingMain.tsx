import React from "react";
import {
  HeartIcon,
  BarChart3Icon,
  BookOpenIcon,
  Trash2Icon,
  LogOutIcon,
  PencilIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockUser } from "../../mocks/mockUser";

interface User {
  email: string;
  name: string;
  socre?: number;
  introduce: string;
  profileImage: string;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  textColor?: string;
  iconBg?: string;
}

const user: User = mockUser[0];

const SettingMain = () => {
  return (
    <div className="min-h-screen bg-[#fef9f3] text-black px-4 pt-20 pb-24 md:pt-20 md:px-6">
      {/* 프로필 섹션 */}
      <section className="w-full max-w-sm mx-6 md:mx-auto mb-8 md:mb-12 md:max-w-md relative">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <img
            src={user.profileImage}
            alt="profile"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-300"
          />

          {/* 이름 + ID */}
          <div className="flex flex-col">
            <span className="text-lg md:text-xl">
              {user.name}
            </span>
            <p className="text-sm md:text-base text-[#9CAAB9]">
              ID: {user.email}
            </p>
          </div>
        </div>

        {/* 연필 아이콘 (우측 상단 고정) */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="프로필 편집"
        >
          <PencilIcon className="w-5 h-5 text-[#9CAAB9]" />
        </button>
      </section>

      {/* 메뉴 카드 */}
      <section className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4 md:max-w-md">
        <Link to="/home">
          <MenuItem
            icon={<HeartIcon className="w-6 h-6 text-white" />}
            label="관심작품"
            iconBg="bg-[#F9A8A8]"
          />
        </Link>
        <button className="w-full">
          <MenuItem
            icon={<BarChart3Icon className="w-6 h-6 text-white" />}
            label="난이도 설정"
            iconBg="bg-[#F9A8A8]"
          />
        </button>
        <button className="w-full">
          <MenuItem
            icon={<BookOpenIcon className="w-6 h-6 text-white" />}
            label="원하는 고전 신청하기"
            iconBg="bg-[#F9A8A8]"
          />
        </button>
        <button className="w-full">
          <MenuItem
            icon={<Trash2Icon className="w-6 h-6 text-white" />}
            label="회원탈퇴"
            textColor="text-red-500"
            iconBg="bg-[#C75C5C]"
          />
        </button>

        <div className="pt-3 border-t border-gray-200">
          <button className="w-full flex items-center gap-2 justify-center text-[#9CAAB9] hover:text-gray-700 transition-colors duration-200 pt-1 rounded-lg">
            <span className="text-base">로그아웃</span>
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

function MenuItem(props: MenuItemProps) {
  const {
    icon,
    label,
    textColor = "text-black",
    iconBg = "bg-[#FDE8E8]",
  } = props;

  return (
    <div className="flex items-center justify-between w-full py-4 px-5 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center gap-5">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg} transition-transform duration-200 hover:scale-105`}
        >
          {icon}
        </div>
        <span className={`text-lg font-medium ${textColor}`}>{label}</span>
      </div>
      <span className="text-[#9CAAB9]">&gt;</span>
    </div>
  );
}

export default SettingMain;
