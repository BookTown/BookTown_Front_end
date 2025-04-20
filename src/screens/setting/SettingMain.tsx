import React, { useState, useEffect } from "react";
import {
  HeartIcon,
  BarChart3Icon,
  BookOpenIcon,
  Trash2Icon,
  LogOutIcon,
  PencilIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../api/user";
import basicProfile from "../../assets/basicProfile.png";
import { logoutUser } from "../../api/user";
import EditProfileInfo from './EditProfileInfo';
import EditProfileImage from './EditProfileImage';
import ExitMember from './ExitMember';
import { updateProfileImage } from "../../api/user";

interface UserProfile {
  id: number;
  email: string;
  provider: string;
  providerId: string;
  username: string;
  profileImage: string | null;
  difficulty: string;
  score: number;
  introduction: string | null;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  textColor?: string;
  iconBg?: string;
}

const SettingMain = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    const isConfirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!isConfirmed) return;
  
    try {
      await logoutUser();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("서버 오류가 발생했습니다. 강제로 로그아웃합니다.");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };

  const handleProfileUpdate = async (name: string, intro: string) => {
    try {
      // API 호출 로직 구현
      console.log('Profile updated:', { name, intro });
      // 성공 시 프로필 다시 불러오기
      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageUpdate = async (file: File) => {
    try {
      await updateProfileImage(file);
      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to update image:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] text-black px-4 pt-20 pb-24 md:pt-20 md:px-6">
      {/* 프로필 섹션 */}
      <section className="w-full max-w-sm mx-6 md:mx-auto mb-8 md:mb-12 md:max-w-md relative">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <div className="relative">
            <img
              src={userProfile?.profileImage || basicProfile}
              alt="profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-300"
            />
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="text-sm text-gray-500 hover:text-gray-700 mt-2 w-full text-center"
            >
              이미지 변경
            </button>
          </div>

          {/* 이름 + ID */}
          <div className="flex flex-col">
            <span className="text-lg md:text-xl">
              {userProfile?.username || "사용자"}
            </span>
            <p className="text-sm md:text-base text-[#9CAAB9]">
              ID: {userProfile?.email || "이메일 없음"}
            </p>
          </div>
        </div>

        {/* 연필 아이콘 (우측 상단 고정) */}
        <button
          onClick={() => setIsInfoModalOpen(true)}
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
        <button 
          onClick={() => setIsExitModalOpen(true)}
          className="w-full">
          <MenuItem
            icon={<Trash2Icon className="w-6 h-6 text-white" />}
            label="회원탈퇴"
            textColor="text-red-500"
            iconBg="bg-[#C75C5C]"
          />
        </button>

        <div className="pt-3 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center text-[#9CAAB9] hover:text-gray-700 transition-colors duration-200 pt-1 rounded-lg">
            <span className="text-base">로그아웃</span>
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </section>
      
      <EditProfileInfo 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
        currentName={userProfile?.username || ""}
        currentIntro={userProfile?.introduction || ""}
        onSave={handleProfileUpdate}
        userId={userProfile?.id || 0}
      />
      {/* 프로필 이미지 수정 모달 */}
      <EditProfileImage
        isOpen={isImageModalOpen} 
        onClose={() => setIsImageModalOpen(false)} 
        onSave={handleImageUpdate}  
      />
      {isExitModalOpen && (
      <ExitMember onClose={() => setIsExitModalOpen(false)} />
      )}
    </div>
  );
};

const MenuItem = (props: MenuItemProps) => {
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