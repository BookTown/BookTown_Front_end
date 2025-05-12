// API에서 가져오는 데이터 타입 정의
export interface QuizSubmission {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  correct: boolean;
  options?: string[] | null;
  explanation?: string;
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
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',  // 객관식
  TRUE_FALSE = 'TRUE_FALSE',           // OX 퀴즈
  SHORT_ANSWER = 'SHORT_ANSWER'        // 주관식
}

// 퀴즈 유형 판별 함수
export const determineQuizType = (submission: QuizSubmission): QuizType => {
  console.log("퀴즈 유형 판별 함수 실행:", { submission });
  
  // 객관식 퀴즈인 경우 (options 배열이 있음)
  if (Array.isArray(submission.options) && submission.options.length > 0) {
    console.log("객관식 문제로 판별", { options: submission.options });
    return QuizType.MULTIPLE_CHOICE;
  }
  // OX 퀴즈인 경우 (정답이 TRUE 또는 FALSE)
  else if (submission.correctAnswer === 'TRUE' || submission.correctAnswer === 'FALSE') {
    console.log("OX 문제로 판별", { correctAnswer: submission.correctAnswer });
    return QuizType.TRUE_FALSE;
  }
  // 그 외는 주관식으로 처리
  else {
    console.log("주관식 문제로 판별", { correctAnswer: submission.correctAnswer });
    return QuizType.SHORT_ANSWER;
  }
};