import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopTitle from "../../components/TopTitle";

const QuizEntry = () => {
  const navigate = useNavigate();
  const { bookId } = useParams(); // URL에서 bookId 파라미터 가져오기
  const [step, setStep] = useState<"difficulty" | "type">("difficulty");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | null>(null);
  const [type, setType] = useState<"MULTIPLE_CHOICE" | "SHORT_ANSWER" | "TRUE_FALSE" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const difficultyLabels = {
    "EASY": "쉬움",
    "MEDIUM": "보통",
    "HARD": "어려움"
  };

  // 퀴즈 시작 함수
  const handleSubmit = () => {
    if (difficulty && type) {
      setIsLoading(true);
      
      const numericBookId = bookId ? parseInt(bookId) : undefined;
      
      // 퀴즈 화면으로 바로 이동 (API는 Quiz.tsx에서 호출)
      navigate("/quiz", {
        state: {
          quizParams: {
            bookId: numericBookId,
            type,
            difficulty
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <TopTitle />
      
      {/* 북타운 마스코트 배경 */}
      <div className="fixed inset-0 flex flex-col items-center z-0">
        <div className="w-64 h-64 md:w-80 md:h-80 mt-36">
          <img 
            src="/images/Loader.gif" 
            alt="북타운 마스코트" 
            className="w-full h-full"
          />
        </div>
      </div>
      
      {/* 바텀시트 모달 */}
      <div className="fixed inset-0 flex items-end md:items-end justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto bg-white w-full md:w-[480px] lg:w-[560px] max-h-[50vh] md:max-h-[60vh] 
                      rounded-t-2xl md:rounded-xl shadow-xl md:mb-8 border border-black/20">
          
          <div className="pt-8 px-6 pb-6 md:p-8">
            {step === "difficulty" && (
              <>
                <h2 className="text-xl font-bold mb-6">난이도를 선택하세요 !!!</h2>
                <div className="flex flex-col gap-4">
                  {Object.entries(difficultyLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setDifficulty(value as any)}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        difficulty === value 
                          ? "bg-[#F9A8A8] text-white border-[#F9A8A8]" 
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!difficulty}
                  onClick={() => setStep("type")}
                  className={`mt-8 w-full py-3 rounded-lg font-medium transition ${
                    difficulty 
                      ? "bg-[#C75C5C] text-white hover:bg-[#b54d4d]" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  다음
                </button>
              </>
            )}

            {step === "type" && (
              <>
                <h2 className="text-xl font-bold mb-6">문제 유형을 선택하세요 !!!</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "객관식", value: "MULTIPLE_CHOICE" },
                    { label: "주관식", value: "SHORT_ANSWER" },
                    { label: "O/X", value: "TRUE_FALSE" }
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setType(value as any)}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        type === value 
                          ? "bg-[#F9A8A8] text-white border-[#F9A8A8]" 
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => {
                      setStep("difficulty");
                      setType(null);
                    }}
                    className="flex-1 py-3 rounded-lg border border-gray-300 bg-[#F4F7F9] hover:bg-gray-100 transition"
                  >
                    이전
                  </button>
                  <button
                    disabled={!type || isLoading}
                    onClick={handleSubmit}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      type && !isLoading
                        ? "bg-[#C75C5C] text-white hover:bg-[#b54d4d]" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    퀴즈 시작
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEntry;