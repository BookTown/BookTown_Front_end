// 사용자 프로필 정보 인터페이스
export interface UserProfileData {
  id: number;
  email: string;
  provider?: string;
  providerId?: string;
  username: string;
  profileImage?: string;
  score: number;
  introduction?: string;
}

// 랭킹 사용자 인터페이스 정의
export interface RankUser {
  userId: number;
  username: string;
  score: number;
  profileImage: string;
}