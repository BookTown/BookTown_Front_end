import { useState, useEffect } from 'react';
import { Medal, Trophy, Award } from "lucide-react";
import { fetchTop3Ranks, fetchAllRanks } from '../../api/api';
import { fetchUserProfileById } from '../../api/user';
import { RankUser, UserProfileData } from '../../interfaces/rankInterface';
import UserProfile from './UserProfile';
import basicProfile from '../../assets/basicProfile.png';
import Loader from '../../components/Loader/Loader';

const RankMain = () => {
  const [top3Users, setTop3Users] = useState<RankUser[]>([]);
  const [rankList, setRankList] = useState<RankUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true);
        const [top3Data, allRanksData] = await Promise.all([
          fetchTop3Ranks(),
          fetchAllRanks()
        ]);
        setTop3Users(top3Data);
        setRankList(allRanksData);
      } catch (err) {
        console.error('랭킹 데이터 가져오기 실패:', err);
        setError('랭킹 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  const handleUserClick = async (user: RankUser) => {
    try {
      const userProfile = await fetchUserProfileById(user.userId);
      setSelectedUser(userProfile);
      setShowModal(true);
    } catch (err) {
      console.error('사용자 프로필 가져오기 실패:', err);
      // 에러가 발생해도 기본 정보라도 보여주기 위해
      setSelectedUser({
        id: user.userId,
        username: user.username,
        email: '',
        score: user.score,
        profileImage: user.profileImageUrl ?? null
      });
      setShowModal(true);
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
        <div className="flex flex-col justify-center items-center h-[100dvh] text-2xl">
          <Loader />
          <div className="pt-5">데이터를 불러오는 중...</div>
        </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-[100dvh] text-2xl">데이터를 불러오는데 실패했습니다.</div>
    );
  }

  // 랭킹에 아무도 없을 때 빈화면 처리
  if (rankList.length === 0) {
    return (
      <div className="w-full py-10 flex justify-center items-center h-[100dvh]">
        <div className="text-center">
          <p className="text-2xl">아직 랭킹에 등록된 사용자가 없습니다.</p>
          <p className="mt-2 text-xl text-[#9CAAB9]">퀴즈를 풀고 랭킹에 도전해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 md:pt-12">
      <div className="pl-6 pt-4 mb-6">
        <h1 className="text-3xl">랭킹</h1>
        <p className="text-xl text-[#A39C9C] pb-2">가장 퀴즈를 많이 푼 유저를 확인하세요</p>
      </div>

      <section className="w-full max-w-6xl mx-auto px-4 pb-20 flex flex-col md:flex-row md:justify-between items-center md:items-start gap-6">
        {/* Top 3 시상대 */}
        <div className="relative flex flex-col items-center md:w-3/5 md:pt-24">
          <div className="flex items-end justify-center gap-6 mb-8">
            {/* 2등 - top3가 2명 이상 있을 경우에만 표시 */}
            {top3Users.length > 1 && (
              <div 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => handleUserClick(top3Users[1])}
              >
                <img
                  src={top3Users[1].profileImageUrl ?? basicProfile}
                  alt="2등"
                  className="w-24 h-24 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-4 border-gray-400 mb-4"
                  onError={(e) => {
                    e.currentTarget.src = basicProfile;
                  }}
                />
                <div className="bg-[#C75C5C] text-white rounded-lg px-6 py-4 text-center w-24 h-28">
                  <Medal className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-base font-bold">{top3Users[1].score}점</div>
                  <div className="text-sm truncate">{top3Users[1].username}</div>
                </div>
              </div>
            )}
            
            {/* 1등 - top3가 1명 이상 있을 경우에만 표시 */}
            {top3Users.length > 0 && (
              <div 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => handleUserClick(top3Users[0])}
              >
                <img
                  src={top3Users[0].profileImageUrl ?? basicProfile}
                  alt="1등"
                  className="w-28 h-28 md:w-28 md:h-28 lg:w-40 lg:h-40 rounded-full border-4 border-yellow-400 mb-4"
                  onError={(e) => {
                    e.currentTarget.src = basicProfile;
                  }}
                />
                <div className="bg-[#C75C5C] text-white rounded-lg px-6 pt-8 text-center w-28 h-36">
                  <Trophy className="w-10 h-10 mx-auto mb-2" />
                  <div className="text-lg font-bold">{top3Users[0].score}점</div>
                  <div className="text-base truncate">{top3Users[0].username}</div>
                </div>
              </div>
            )}
            
            {/* 3등 - top3가 3명 있을 경우에만 표시 */}
            {top3Users.length > 2 && (
              <div 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleUserClick(top3Users[2])}
              >
                <img
                  src={top3Users[2].profileImageUrl ?? basicProfile}
                  alt="3등"
                  className="w-20 h-20 md:w-20 md:h-20 lg:w-28 lg:h-28 rounded-full border-4 border-orange-400 mb-4"
                  onError={(e) => {
                    e.currentTarget.src = basicProfile;
                  }}
                />
                <div className="bg-[#C75C5C] text-white rounded-lg px-6 py-3 text-center w-20 h-26">
                  <Award className="w-7 h-7 mx-auto mb-2" />
                  <div className="text-base font-bold">{top3Users[2].score}점</div>
                  <div className="text-sm truncate">{top3Users[2].username}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 전체 랭킹 리스트 */}
        <div className="w-full md:w-1/2">
          <div className="shadow rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full bg-white text-sm">
                <thead className="bg-gray-100 text-gray-700 sticky top-0">
                  <tr>
                    <th className="w-16 px-4 py-2 text-center">순위</th>
                    <th className="w-12 px-2 py-2">프로필</th>
                    <th className="px-2 py-2 text-left">이름</th>
                    <th className="w-20 px-4 py-2 text-center">점수</th>
                  </tr>
                </thead>
                <tbody>
                  {rankList.map((user, index) => (
                    <tr 
                      key={user.userId}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-4 py-2 text-center font-medium text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-2 py-2">
                        <img 
                          src={user.profileImageUrl ?? basicProfile} 
                          alt="프로필사진" 
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = basicProfile;
                          }}
                        />
                      </td>
                      <td className="px-2 py-2 font-medium">
                        {user.username}
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
    </div>
  );
};

export default RankMain;