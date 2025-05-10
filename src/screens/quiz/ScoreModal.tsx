import { useEffect, useState } from "react";
import Button from "../../components/Button";

interface QuizResult {
  score?: number;
  totalScore?: number;
  correctCount?: number;
  totalQuestions?: number;
  correctAnswers?: boolean[]; // 각 문제별 정답 여부 배열
  userSubmissions?: {
    quizId: number;
    userAnswer: string;
  }[];
  [key: string]: any; // 서버에서 오는 추가 필드를 위한 인덱스 시그니처
}

interface ScoreModalProps {
  score: number;
  total: number;
  onClose: () => void;
  quizResult?: QuizResult; 
}

const ScoreModal = ({ score, total, onClose, quizResult }: ScoreModalProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // 서버에서 받은 점수가 있으면 사용, 없으면 클라이언트 계산 점수 사용
  const finalScore = quizResult?.score !== undefined ? quizResult.score : score;
  const finalTotal = quizResult?.totalScore !== undefined ? quizResult.totalScore : total;
  
  let feedback;
  let emoji;
  
  const scoreRatio = finalScore / finalTotal;
  
  if (scoreRatio === 1) {
    feedback = "완벽해요! 모든 문제를 맞히셨습니다!";
    emoji = "🏆";
  } else if (scoreRatio >= 0.7) {
    feedback = "훌륭해요! 대부분의 문제를 맞히셨습니다!";
    emoji = "🎉";
  } else if (scoreRatio >= 0.4) {
    feedback = "좋아요! 다음에는 더 잘할 수 있을 거예요.";
    emoji = "👍";
  } else {
    feedback = "아쉽네요. 다시 도전해보세요!";
    emoji = "🔄";
  }
  
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 정답 여부 배열이 있는지 확인
  const hasDetailedResults = quizResult?.correctAnswers && quizResult.correctAnswers.length > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl text-center max-w-md w-full animate-fadeIn">
        <div className="mb-6 text-6xl">{emoji}</div>
        <h3 className="text-2xl font-bold mb-2">퀴즈 결과</h3>
        <p className="text-gray-600 mb-6">{feedback}</p>
        
        <div className="bg-gray-50 p-5 rounded-lg mb-6">
          <p className="text-lg mb-1">당신의 점수</p>
          <p className="text-4xl font-bold text-[#C75C5C] mb-1">
            {finalScore}점 / {finalTotal}점
          </p>
          
          {quizResult?.correctCount !== undefined && (
            <p className="mt-2 text-sm text-gray-600">
              {quizResult.correctCount}문제 맞음 / {quizResult.totalQuestions || total/10}문제 중
            </p>
          )}
        </div>
        
        {hasDetailedResults && (
          <div className="mb-6">
            <button 
              onClick={() => setShowDetails(prev => !prev)}
              className="text-[#C75C5C] hover:underline text-sm flex items-center justify-center mx-auto"
            >
              {showDetails ? "결과 접기" : "상세 결과 보기"} 
            </button>
            
            {/* 상세 결과 표시 영역 */}
            {showDetails && quizResult?.correctAnswers && (
              <div className="mt-4 border rounded-lg p-4 text-left max-h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {quizResult.correctAnswers.map((isCorrect, index) => (
                    <li 
                      key={index}
                      className="flex items-center text-sm"
                    >
                      <span className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span>
                        {index + 1}번 문제: {isCorrect ? '정답' : '오답'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <Button
          onClick={onClose}
          size="lg"
          color="pink"
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default ScoreModal;