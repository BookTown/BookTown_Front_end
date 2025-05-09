import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopTitle from "../../components/TopTitle";

const QuizEntry = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"difficulty" | "type">("difficulty");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | null>(null);
  const [type, setType] = useState<"MULTIPLE_CHOICE" | "SHORT_ANSWER" | "TRUE_FALSE" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const difficultyLabels = {
    "EASY": "쉬움",
    "MEDIUM": "보통",
    "HARD": "어려움"
  };

  const handleSubmit = async () => {
    if (difficulty && type) {
      setIsLoading(true);
      
      try {
        // 퀴즈 화면으로 이동
        navigate("/quiz", {
          state: {
            difficulty,
            type
          }
        });
      } catch (error) {
        console.error("퀴즈 생성 중 오류 발생:", error);
        alert("퀴즈를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <TopTitle />
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="w-[90%] max-w-[480px] md:max-w-[600px] lg:max-w-[720px] space-y-6 text-center">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            {step === "difficulty" && (
              <>
                <h2 className="text-xl font-bold mb-6">난이도를 선택하세요</h2>
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
                <h2 className="text-xl font-bold mb-6">문제 유형을 선택하세요</h2>
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
                    className="flex-1 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
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
                    {isLoading ? "퀴즈 생성 중..." : "퀴즈 시작"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizEntry;