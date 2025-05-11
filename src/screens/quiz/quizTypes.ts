export type QuestionType = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "TRUE_FALSE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuizOption {
  id: number;
  text: string;
  index: number;
}

export interface QuizQuestionBase {
  id: number;
  bookSummary: string | null;
  questionType: QuestionType;
  difficulty: Difficulty;
  question: string;
  correctAnswer: string;
  score: number;
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  questionType: "MULTIPLE_CHOICE";
  options: QuizOption[];
}

export interface ShortAnswerQuestion extends QuizQuestionBase {
  questionType: "SHORT_ANSWER";
  options: null;
}

export interface TrueFalseQuestion extends QuizQuestionBase {
  questionType: "TRUE_FALSE";
  options: null;
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | TrueFalseQuestion;

export interface UserAnswer {
  quizId: number;
  userAnswer: string;
}

export interface QuizParams {
  bookId?: number;
  type: QuestionType;
  difficulty: Difficulty;
}

export interface QuizResult {
  score?: number;
  totalScore?: number;
  correctCount?: number;
  totalQuestions?: number;
  correctAnswers?: boolean[];
  userSubmissions?: UserAnswer[];
  [key: string]: any;
}

export interface QuestionComponentProps {
  questionData: QuizQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion?: boolean;
  current: number;
  score: number;
}
