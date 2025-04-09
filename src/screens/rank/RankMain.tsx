import { useState } from 'react';
import { Medal, Trophy } from "lucide-react";
import { mockUser } from '../../mocks/mockUser';
import UserProfile from './UserProfile';

interface RankUser {
  email: string;
  name: string;
  introduce?: string;
  score: number;
  profileImage: string;
}

const RankMain = () => {
  const [selectedUser, setSelectedUser] = useState<RankUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  // API 호출 주석 처리
  /*
  useEffect(() => {
    fetch('http://localhost:8080/rank/top3')
      .then(res => res.json())
      .then(data => setTop3Users(data))
      .catch(err => console.error('Error fetching top 3:', err));

    fetch('http://localhost:8080/rank/top100')
      .then(res => res.json())
      .then(data => setRankList(data))
      .catch(err => console.error('Error fetching rankings:', err));
  }, []);
  */


  // 랭킹에 아무도 없을 때 빈화면 처리
  // EX) 랭킹에 아무도 없습니다. 도전해보세여

  const handleUserClick = (user: RankUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-56 flex flex-col md:flex-row md:justify-between items-center md:items-start gap-8">
      {/* Top 3 시상대 */}
      <div className="relative flex flex-col items-center md:w-3/5 md:pt-24">
        <div className="flex items-end justify-center gap-8 mb-8">
          {/* 2등 */}
          <div 
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => handleUserClick(mockUser[1])}
          >
            <img
              src={mockUser[1].profileImage}
              alt="2등"
              className="w-24 h-24 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-4 border-gray-400 mb-4"
            />
            <div className="bg-[#C75C5C] text-white rounded-lg px-6 py-4 text-center w-24 h-28">
              <Medal className="w-8 h-8 mx-auto mb-2" />
              <div className="text-base font-bold">{mockUser[1].score}점</div>
              <div className="text-sm truncate">{mockUser[1].name}</div>
            </div>
          </div>
          
          {/* 1등 */}
          <div 
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => handleUserClick(mockUser[0])}
          >
            <img
              src={mockUser[0].profileImage}
              alt="1등"
              className="w-28 h-28 md:w-28 md:h-28 lg:w-40 lg:h-40 rounded-full border-4 border-yellow-400 mb-4"
            />
            <div className="bg-[#C75C5C] text-white rounded-lg px-6 pt-8 text-center w-28 h-36">
              <Trophy className="w-10 h-10 mx-auto mb-2" />
              <div className="text-lg font-bold">{mockUser[0].score}점</div>
              <div className="text-base truncate">{mockUser[0].name}</div>
            </div>
          </div>
          
          {/* 3등 */}
          <div 
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleUserClick(mockUser[2])}
          >
            <img
              src={mockUser[2].profileImage}
              alt="3등"
              className="w-20 h-20 md:w-20 md:h-20 lg:w-28 lg:h-28 rounded-full border-4 border-orange-400 mb-4"
            />
            <div className="bg-[#C75C5C] text-white rounded-lg px-6 py-2 text-center w-20 h-24">
              <Medal className="w-7 h-7 mx-auto mb-2" />
              <div className="text-base font-bold">{mockUser[2].score}점</div>
              <div className="text-sm truncate">{mockUser[2].name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 전체 랭킹 리스트 */}
      <div className="w-full md:w-1/2">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th className="w-16 px-4 py-2 text-center">순위</th>
                  <th className="w-12 px-2 py-2">프로필</th>
                  <th className="px-2 py-2 text-left">이름</th>
                  <th className="w-20 px-4 py-2 text-center">점수</th>
                </tr>
              </thead>
              <tbody>
                {mockUser.map((user, index) => (
                  <tr 
                    key={user.email}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-4 py-2 text-center font-medium text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-2 py-2">
                      <img src={user.profileImage} alt="프로필사진" className="w-8 h-8 rounded-full" />
                    </td>
                    <td className="px-2 py-2 font-medium">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="text-red-500 font-bold">{user.score}점</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 사용자 프로필 모달 */}
      {showModal && selectedUser && (
        <UserProfile 
          user={selectedUser} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </section>
  );
};

export default RankMain;
