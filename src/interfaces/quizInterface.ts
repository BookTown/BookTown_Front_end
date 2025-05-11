// API에서 가져오는 데이터 타입 정의
export interface QuizSubmission {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  correct: boolean;
  options: string[] | null;
}

export interface QuizHistoryDetail {
  historyId: number | null;
  bookTitle: string;
  totalScore: number;
  submittedAt: string;
  submissions: QuizSubmission[];
}