export const mockUser = [
  {
    email: "God-Sung-uuuu",
    name: "장성우",
    introduce: `백운동 전설의 개발자 장성우`,
    score: 24,
    profileImage: "/images/sungwoo.png",
  },
  {
    email: "0000-0000",
    name: "김성기",
    introduce: "조선대학교 교수님",
    score: 20,
    profileImage: "/images/professorKim.png",
  },
  {
    email: "1111-1111",
    name: "정현숙",
    introduce: "조선대학교 교수님",
    score: 18,
    profileImage: "/images/professorJung.png",
  },
  {
    email: "user4@booktown.com",
    name: "이지민",
    introduce: "책 읽는 것을 좋아하는 대학생",
    score: 17,
    profileImage: "/images/default-profile.png",
  },
  {
    email: "user5@booktown.com",
    name: "김태현",
    introduce: "문학 전공 대학원생",
    score: 16,
    profileImage: "/images/default-profile.png",
  },
  ...[...Array(45)].map((_, i) => ({
    email: `user${i + 6}@booktown.com`,
    name: `사용자${i + 6}`,
    introduce: `책읽기를 즐기는 북타운 ${i + 6}번째 회원입니다.`,
    score: Math.max(1, 15 - Math.floor(i / 3)),
    profileImage: "/images/default-profile.png",
  }))
];