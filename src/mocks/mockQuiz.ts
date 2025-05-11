import { mockBooks } from "./mockBook";

// 문제 유형과 난이도 타입 정의
type QuestionType = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "TRUE_FALSE";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

// 랜덤 문제 유형 생성 함수
const getRandomQuestionType = (): QuestionType => {
  const types: QuestionType[] = ["MULTIPLE_CHOICE", "SHORT_ANSWER", "TRUE_FALSE"];
  return types[Math.floor(Math.random() * types.length)];
};

// 랜덤 난이도 생성 함수
const getRandomDifficulty = (): Difficulty => {
  const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
};

// 샘플 퀴즈 데이터 (QuizModal에 필요한 형식)
export const sampleQuizData = {
  question: "로빈슨 크루소는 무인도에서 몇 년간 생활했나요?",
  options: [
    { id: 1, text: "20년", index: 0 },
    { id: 2, text: "28년", index: 1 },
    { id: 3, text: "15년", index: 2 },
    { id: 4, text: "10년", index: 3 }
  ],
  correctAnswerIndex: 1, // 두 번째 옵션(28년)이 정답
  explanation: "로빈슨 크루소는 무인도에서 총 28년간 생활했습니다."
};

// 퀴즈 히스토리 데이터 생성
export const mockQuizHistory = mockBooks.map(book => ({
  id: book.id,
  title: book.title,
  author: book.author,
  imageUrl: book.imageUrl,
  score: Math.floor(Math.random() * 10) + 1, // 1~10 사이 랜덤 점수
  quizDate: new Date(Date.now() - book.id * 86400000).toISOString(),
  questionType: getRandomQuestionType(), // 문제 유형 추가
  difficulty: getRandomDifficulty() // 난이도 추가
}));