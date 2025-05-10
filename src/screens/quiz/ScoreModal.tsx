import { useEffect } from "react";

// quizResult 타입 추가
interface QuizResult {
  score?: number;
  totalScore?: number;
  correctCount?: number;
  totalQuestions?: number;
  [key: string]: any; // 서버에서 오는 추가 필드를 위한 인덱스 시그니처
}

interface ScoreModalProps {
  score: number;
  total: number;
  onClose: () => void;
  quizResult?: QuizResult; 
}

const ScoreModal = ({ score, total, onClose, quizResult }: ScoreModalProps) => {
  // 서버에서 받은 점수가 있으면 사용, 없으면 클라이언트 계산 점수 사용
  const finalScore = quizResult?.score !== undefined ? quizResult.score : score;
  const finalTotal = quizResult?.totalScore !== undefined ? quizResult.totalScore : total;
  
  const percentage = (finalScore / finalTotal) * 100;
  
  // 점수별 피드백 메시지와 이모티콘
  let feedback;
  let emoji;
  
  if (percentage === 100) {
    feedback = "완벽해요! 모든 문제를 맞히셨습니다!";
    emoji = "🏆";
  } else if (percentage >= 70) {
    feedback = "훌륭해요! 대부분의 문제를 맞히셨습니다!";
    emoji = "🎉";
  } else if (percentage >= 40) {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl text-center max-w-md w-full animate-fadeIn">
        <div className="mb-6 text-6xl">{emoji}</div>
        <h3 className="text-2xl font-bold mb-2">퀴즈 결과</h3>
        <p className="text-gray-600 mb-6">{feedback}</p>
        
        <div className="bg-gray-50 p-5 rounded-lg mb-8">
          <p className="text-lg mb-1">당신의 점수</p>
          <p className="text-4xl font-bold text-[#C75C5C] mb-1">
            {finalScore}점 / {finalTotal}점
          </p>
          <p className="text-sm text-gray-500">
            정답률: {percentage.toFixed(0)}%
          </p>
          
          {/* 서버 결과에 정답 개수가 있는 경우 추가 정보 표시 */}
          {quizResult?.correctCount !== undefined && (
            <p className="mt-2 text-sm text-gray-600">
              {quizResult.correctCount}문제 정답 / {quizResult.totalQuestions || total/10}문제 중
            </p>
          )}
        </div>
        
        <button
          className="w-full bg-[#C75C5C] hover:bg-[#b54d4d] text-white py-3 rounded-lg text-lg font-medium transition"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ScoreModal;