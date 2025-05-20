import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCw, BookOpenCheck, Volume2, Pause } from "lucide-react";
import { IScene } from "../../interfaces/bookInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchBookSummary } from "../../api/api";
import Button from "../../components/Button";
import TopTitle from "../../components/TopTitle";

// 장면 프레임 컴포넌트
const SceneFrame = ({
  illustrationUrl,
  onPrev,
  onNext,
  isFirst,
  isLast,
  currentPage,
  totalPages,
}: {
  illustrationUrl: string;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentPage: number;
  totalPages: number;
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // 최소 스와이프 거리 설정
  const minSwipeDistance = 50;

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      setTouchEnd(e.targetTouches[0].clientX);

      // 드래그 중 슬라이드 효과
      if (imageRef.current && touchStart !== null) {
        const xDiff = (e.targetTouches[0].clientX - touchStart) / 3; // 이동 거리 조절
        imageRef.current.style.transform = `translateX(${xDiff}px)`;
      }
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);

    // 이미지 위치 초기화 (부드러운 애니메이션 추가)
    if (imageRef.current) {
      imageRef.current.style.transition = "transform 0.3s ease";
      imageRef.current.style.transform = "translateX(0)";
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = "";
        }
      }, 300);
    }

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isLast) {
      onNext();
    } else if (isRightSwipe && !isFirst) {
      onPrev();
    }
  };

  // 마우스 이벤트 핸들러
  const [mouseStart, setMouseStart] = useState<number | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 드래그 동작 방지
    setMouseStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging && mouseStart !== null) {
      const xDiff = (e.clientX - mouseStart) / 3;
      if (imageRef.current) {
        imageRef.current.style.transform = `translateX(${xDiff}px)`;
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (isDragging && mouseStart !== null) {
      const distance = mouseStart - e.clientX;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && !isLast) {
        onNext();
      } else if (isRightSwipe && !isFirst) {
        onPrev();
      }
    }

    // 이미지 위치 초기화
    if (imageRef.current) {
      imageRef.current.style.transition = "transform 0.3s ease";
      imageRef.current.style.transform = "translateX(0)";
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = "";
        }
      }, 300);
    }

    setIsDragging(false);
    setMouseStart(null);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (imageRef.current) {
        imageRef.current.style.transition = "transform 0.3s ease";
        imageRef.current.style.transform = "translateX(0)";
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.style.transition = "";
          }
        }, 300);
      }
    }
    setMouseStart(null);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 이미지 컨테이너 */}
      <div
        className="w-full aspect-square relative overflow-hidden cursor-grab select-none touch-none"
        ref={imageRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <img
          src={illustrationUrl}
          alt="장면 이미지"
          className="w-full h-full object-cover absolute inset-0 select-none pointer-events-none will-change-transform"
          draggable="false"
        />
      </div>

      {/* 화살표 네비게이션 */}
      <div className="flex justify-between items-center mt-2 px-2">
        <div className="w-10 h-10 flex items-center justify-center">
          {!isFirst ? (
            <button
              onClick={onPrev}
              className="p-2 rounded-full opacity-70 hover:opacity-100 transition"
              aria-label="이전 페이지"
            >
              <ArrowLeft size={24} color="#333" />
            </button>
          ) : (
            <div></div> // 빈 공간 유지
          )}
        </div>

        {/* 페이지 인디케이터 - 중앙에 배치 */}
        <div className="flex-1 text-center">
          <span className="text-sm text-gray-600">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          {!isLast ? (
            <button
              onClick={onNext}
              className="p-2 rounded-full opacity-70 hover:opacity-100 transition"
              aria-label="다음 페이지"
            >
              <ArrowRight size={24} color="#333" />
            </button>
          ) : (
            <div></div> // 빈 공간 유지
          )}
        </div>
      </div>
    </div>
  );
};

// 텍스트 프레임 컴포넌트
const PromptFrame = ({ content }: { content: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // 여기에 실제 TTS 호출/정지 로직 추가 예정
    console.log(isPlaying ? "TTS 정지" : "TTS 재생");
  };

  return (
    <div className="w-full p-4 my-2 bg-[#F4F7F9] border border-black border-opacity-20 rounded-lg">
      <div className="flex items-center">
        <p className="text-base text-gray-800 flex-1">{content}</p>
        <button
          onClick={togglePlayPause}
          className="ml-3 p-1 text-[#C75C5C] hover:scale-110 transition-all duration-200 rounded-full"
          aria-label={isPlaying ? "음성 정지" : "음성 듣기"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

const CartoonMain = () => {
  const { bookId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Redux 스토어에서 cartoon 데이터 가져오기
  const { cartoon } = useSelector((state: RootState) => state.cartoon);
  const [scenes, setScenes] = useState<IScene[]>([]);

  // 컴포넌트가 마운트될 때 히스토리 스택 조작
  useEffect(() => {
    console.log("📚 CartoonMain 페이지 마운트");
    
    // 히스토리 스택에서 loading 항목 제거 - 두 가지 방법 모두 적용
    
    // 1. 현재 상태를 새로운 상태로 교체하여 이전 히스토리 로그 덮어쓰기
    window.history.replaceState(
      { ...window.history.state }, 
      '', 
      window.location.pathname
    );
    
    // 2. 뒤로가기 시 홈으로 이동하는 스크립트를 페이지 상태에 저장
    window.history.pushState(
      { preventGoBack: true }, 
      '', 
      window.location.pathname
    );
    
    console.log("📚 히스토리 스택 정리 완료");
  }, []);

  // 뒤로가기 처리를 위한 핸들러
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log("📚 뒤로가기 감지됨", event.state);
      
      // 뒤로가기 이벤트 캡처하여 홈으로 리다이렉트
      event.preventDefault();
      console.log("📚 홈으로 리다이렉트");
      navigate('/home', { replace: true });
    };

    // 뒤로가기 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    // 스토어에 데이터가 있으면 사용, 없으면 API 호출
    if (cartoon.scenes.length > 0 && cartoon.id.toString() === bookId) {
      setScenes(cartoon.scenes);
    } else {
      // API에서 줄거리 데이터 불러오기
      const loadSummary = async () => {
        try {
          const summaryData = await fetchBookSummary(bookId);
          setScenes(summaryData);
        } catch (error) {
          console.error("줄거리를 불러오는 중 오류가 발생했습니다:", error);
        }
      };

      loadSummary();
    }
  }, [bookId, cartoon]);

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < scenes.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 다시 보기 핸들러 - 첫 페이지로 이동
  const handleViewSummaryAgain = () => {
    setCurrentPage(0);
  };

  // 퀴즈 풀기 핸들러 - 퀴즈 페이지로 이동
  const handleSolveQuiz = () => {
    navigate(`/quizStart/${bookId}`);
  };

  if (scenes.length === 0) {
    return (
      <div className="pt-14 text-center">줄거리 정보를 불러올 수 없습니다.</div>
    );
  }

  const currentScene = scenes[currentPage];
  const isFirstScene = currentPage === 0;
  const isLastScene = currentPage === scenes.length - 1;

  return (
    <div className="pb-4 px-4 flex flex-col items-center">
      <TopTitle />
      <div className="w-full max-w-[24rem] md:max-w-[32rem] lg:max-w-[36rem]">
        {/* 만화 장면 */}
        <SceneFrame
          illustrationUrl={
            currentScene.illustrationUrl ||
            (cartoon.thumbnailUrl
              ? cartoon.thumbnailUrl
              : "/images/default-book.png")
          }
          onPrev={goToPrevPage}
          onNext={goToNextPage}
          isFirst={isFirstScene}
          isLast={isLastScene}
          currentPage={currentPage}
          totalPages={scenes.length}
        />

        {/* 텍스트 내용 */}
        <PromptFrame content={currentScene.content} />

        {/* 마지막 페이지일 때만 버튼 표시 */}
        {isLastScene && (
          <div className="mt-4 flex justify-center gap-8 md:gap-12 lg:gap-20">
            <Button
              size="md"
              color="white"
              type="button"
              onClick={handleViewSummaryAgain}
              className="flex items-center justify-center"
            >
              <RotateCw
                className="mr-1.5 md:mr-2 lg:mr-4 stroke-[#C75C5C]"
                size={16}
                strokeWidth={2}
              />
              다시 보기
            </Button>

            <Button
              size="md"
              color="pink"
              type="button"
              onClick={handleSolveQuiz}
              className="flex items-center justify-center"
            >
              <BookOpenCheck
                className="mr-1.5 md:mr-2 lg:mr-4 stroke-[#FFFFFF]"
                size={16}
                strokeWidth={2}
              />
              퀴즈 풀기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartoonMain;
