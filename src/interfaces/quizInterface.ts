// API에서 가져오는 데이터 타입 정의
export interface QuizOption {
  id: number;
  index: number;
  text: string;
}

export interface QuizSubmission {
  id: number;                
  bookSummary: string | null;
  user: any | null;          
  questionType: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "TRUE_FALSE"; 
  difficulty: "EASY" | "MEDIUM" | "HARD"; 
  question: string;          
  correctAnswer: string;     
  userAnswer?: string;       
  score: number;            
  correct?: boolean;        
  explanation: string;    
  options: QuizOption[] | null; 
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
  TRUE_FALSE = 'TRUE_FALSE',            // OX 퀴즈
  SHORT_ANSWER = 'SHORT_ANSWER'         // 주관식
}

// 퀴즈 유형 판별 함수
export const determineQuizType = (submission: QuizSubmission): QuizType => {
  // API 응답에서 직접 questionType을 가져올 수 있음
  if (submission.questionType) {
    return submission.questionType as QuizType;
  }
  
  // 객관식 퀴즈인 경우 (options 배열이 있음)
  if (Array.isArray(submission.options) && submission.options.length > 0) {
    return QuizType.MULTIPLE_CHOICE;
  }
  // OX 퀴즈인 경우 (정답이 TRUE 또는 FALSE)
  else if (submission.correctAnswer === 'TRUE' || submission.correctAnswer === 'FALSE') {
    return QuizType.TRUE_FALSE;
  }
  // 그 외는 주관식으로 처리
  else {
    return QuizType.SHORT_ANSWER;
  }
};