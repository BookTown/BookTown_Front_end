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

// 퀴즈 타입 정의
export enum QuizType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // 4지선다형
  OX_QUIZ = 'OX_QUIZ',                // OX 퀴즈
  SHORT_ANSWER = 'SHORT_ANSWER'       // 주관식
}

// 퀴즈 유형 판별 함수
export const determineQuizType = (submission: QuizSubmission): QuizType => {
  // OX 퀴즈인 경우
  if (submission.correctAnswer === 'TRUE' || submission.correctAnswer === 'FALSE') {
    return QuizType.OX_QUIZ;
  }
  // 4지선다형 퀴즈인 경우
  else if (Array.isArray(submission.options) && submission.options.length > 0) {
    return QuizType.MULTIPLE_CHOICE;
  }
  // 그 외는 주관식으로 처리
  else {
    return QuizType.SHORT_ANSWER;
  }
};