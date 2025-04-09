import Button from '../../components/Button';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    profileImage: string;
    score: number;
    introduce?: string;
  };
  onClose: () => void;
}

export const UserProfile = ({ user, onClose }: UserProfileProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl">사용자 프로필</h2>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <img 
            src={user.profileImage} 
            alt={user.name} 
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <div className="text-center">
            <h3 className="text-lg font-bold">{user.name}</h3>
            <p className="text-[#C75C5C] font-bold">현재 점수: {user.score}점</p>
          </div>
          <div className="w-full">
            <h4 className="font-medium mb-2">자기소개</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {user.introduce || "아직 자기소개가 없습니다."}
            </p>
          </div>
          <Button 
            onClick={onClose}
            size="md"
            color="pink"
            className="w-full"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

export {};