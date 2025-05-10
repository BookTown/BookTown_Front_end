import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[#FFFAF0] pt-8 px-6">
      {/* 뒤로 가기 버튼 */}
      <div className="">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-gray-200/70 transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeft size={32} />
        </button>
        {/* 북타운 마스코트 */}
        <div className="flex flex-col items-center justify-center mt-6 mb-8">
          <div className="w-64 h-64 md:w-80 md:h-80">
            <img 
              src="/images/Loader.gif" 
              alt="북타운 마스코트" 
              className="w-full h-full"
            />
          </div>
          
          {/* 안내 텍스트 추가 (스크린샷처럼) */}
          <p className="text-4xl md:text-5xl mt-10 mb-4 text-center">
            {step === "difficulty" 
              ? "난이도를 골라주세요 !!"
              : "퀴즈 유형을 골라주세요 !!"
            }
          </p>
        </div>
        
        {/* 선택 버튼 영역 */}
        <div className="flex flex-col items-center">
          {step === "difficulty" && (
            <>
              <div className="flex justify-center gap-4 mb-10 md:mb-14">
                {Object.entries(difficultyLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value as any)}
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-2xl border-2 ${
                      difficulty === value 
                        ? "border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]" 
                        : "border-black bg-white text-black hover:border-[#C75C5C] hover:text-[#C75C5C]"
                    } flex items-center justify-center text-3xl md:text-4xl shadow-xl`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4 md:gap-8">
                <div className="w-40 h-10 md:w-48 md:h-12"></div>
                <button
                  onClick={() => setStep("type")}
                  disabled={!difficulty}
                  className={`w-40 h-10 md:w-48 md:h-12 rounded-xl text-xl md:text-2xl bg-[#C75C5C] text-white transition-all duration-200 ease-in-out shadow-lg ${
                    difficulty 
                      ? " hover:bg-[#b54d4d] cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-lg" 
                      : "opacity-50 transform-none cursor-not-allowed"
                  }`}
                >
                  다음
                </button>
              </div>
            </>
          )}

          {step === "type" && (
            <>
              <div className="flex justify-center gap-4 mb-8 md:mb-14">
                {[
                  { label: "객관식", value: "MULTIPLE_CHOICE" },
                  { label: "주관식", value: "SHORT_ANSWER" },
                  { label: "O/X", value: "TRUE_FALSE" }
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setType(value as any)}
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-2xl border-2 ${
                      type === value 
                        ? "border-[#C75C5C] bg-[#FDECEC] text-[#C75C5C]" 
                        : "border-black bg-white text-black hover:border-[#C75C5C] hover:text-[#C75C5C]"
                    } flex items-center justify-center text-3xl md:text-4xl shadow-xl`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4 md:gap-8">
                <button
                  onClick={() => {
                    setStep("difficulty");
                    setType(null);
                  }}
                  className="w-40 h-10 md:w-48 md:h-12 rounded-xl text-xl md:text-2xl bg-white text-[#C75C5C] 
                  border-2 border-[#C75C5C] transition-all duration-200 ease-in-out 
                  shadow-lg hover:bg-[#FDECEC] cursor-pointer hover:scale-[1.02] 
                  hover:shadow-xl active:scale-[0.98] active:shadow-lg"
                >
                  이전
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!type || isLoading}
                  className={`w-40 h-10 md:w-48 md:h-12 rounded-xl text-xl md:text-2xl bg-[#C75C5C] text-white transition-all duration-200 ease-in-out shadow-lg ${
                    type && !isLoading 
                      ? " hover:bg-[#b54d4d] cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-lg" 
                      : "opacity-50 transform-none cursor-not-allowed"
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
  );
};

export default QuizEntry;