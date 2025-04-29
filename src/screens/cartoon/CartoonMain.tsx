import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IScene } from "../../interfaces/bookInterface";

// 장면 프레임 컴포넌트
const SceneFrame = ({ imageUrl, onPrev, onNext, isFirst, isLast }: {
  imageUrl: string;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
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
      imageRef.current.style.transition = 'transform 0.3s ease';
      imageRef.current.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = '';
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
      imageRef.current.style.transition = 'transform 0.3s ease';
      imageRef.current.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = '';
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
        imageRef.current.style.transition = 'transform 0.3s ease';
        imageRef.current.style.transform = 'translateX(0)';
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.style.transition = '';
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
          src={imageUrl} 
          alt="장면 이미지" 
          className="w-full h-full object-cover absolute inset-0 select-none pointer-events-none will-change-transform"
          draggable="false"
        />
      </div>
      
      {/* 화살표 네비게이션 */}
      <div className="flex justify-between items-center mt-2 px-2">
        <div>
          {!isFirst && (
            <button 
              onClick={onPrev} 
              className="p-2 rounded-full opacity-70 hover:opacity-100 transition"
              aria-label="이전 페이지"
            >
              <ArrowLeft size={24} color="#333" />
            </button>
          )}
        </div>
        
        <div>
          {!isLast && (
            <button 
              onClick={onNext} 
              className="p-2 rounded-full opacity-70 hover:opacity-100 transition"
              aria-label="다음 페이지"
            >
              <ArrowRight size={24} color="#333" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 텍스트 프레임 컴포넌트
const PromptFrame = ({ content }: { content: string }) => {
  return (
    <div className="w-full p-4 my-2 bg-[#F4F7F9] border border-black border-opacity-20 rounded-lg">
      <p className="text-base text-gray-800">{content}</p>
    </div>
  );
};

const CartoonMain = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState(""); // 책 제목 상태 추가
  const [scenes, setScenes] = useState<IScene[]>([
    // 임시 데이터 (실제로는 API에서 가져올 것입니다)
    {
      id: 1,
      pageNumber: 1,
      content: "나뭇가지와 나뭇잎으로 임시 피난처를 만드는 청년의 얼굴에는 결연한 의지가 담겨있으며, 흡사 만화에서 본것처럼 묘사되어 있습니다. 나뭇가지와 나뭇잎으로 임시 피난처를 만드는 청년의 얼굴에는 결연한 의지가 담겨있으며, 흡사 만화에서 본것처럼 묘사되어 있습니다. 나뭇가지와 나뭇잎으로 임시 피난처를 만드는 청년의 얼굴에는 결연한 의지가 담겨있으며, 흡사 만화에서 본것처럼 묘사되어 있습니다.",
      imageUrl: "/images/Lusts of the Libertines.png",
    },
    {
      id: 2,
      pageNumber: 2,
      content: "두 번째 장면입니다. 스토리가 계속됩니다.",
      imageUrl: "/images/Die Verwandlung.png",
    },
    {
      id: 3,
      pageNumber: 3,
      content: "세 번째 장면입니다. 더 많은 내용이 이어집니다.",
      imageUrl: "/images/demian.png",
    },
  ]);
  
  useEffect(() => {
    // 실제로는 여기서 책 ID로 장면 데이터를 가져옵니다
    console.log(`책 ID ${bookId}에 대한 장면 데이터를 가져옵니다`);
    
    // 예시: API 호출
    // fetchBookDetail(bookId).then(data => {
    //   setScenes(data.scenes);
    //   setBookTitle(data.title);
    // });
    
    // 임시로 책 제목 설정
    setBookTitle("로빈슨 크루소");
  }, [bookId]);
  
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
  
  if (scenes.length === 0) {
    return <div className="pt-14 text-center">줄거리 정보를 불러올 수 없습니다.</div>;
  }
  
  const currentScene = scenes[currentPage];
  const isFirstScene = currentPage === 0;
  const isLastScene = currentPage === scenes.length - 1;
  
  return (
    <div className="pt-[4.5rem] pb-4 px-4 flex flex-col items-center">
      <div className="w-full max-w-[24rem] md:max-w-[32rem] lg:max-w-[36rem]">
        {/* 만화 장면 */}
        <SceneFrame 
          imageUrl={currentScene.imageUrl || `/images/${bookTitle}.png`} 
          onPrev={goToPrevPage} 
          onNext={goToNextPage}
          isFirst={isFirstScene}
          isLast={isLastScene}
        />
        
        {/* 텍스트 내용 */}
        <PromptFrame content={currentScene.content} />
        
        {/* 페이지 인디케이터 */}
        <div className="my-2 text-center">
          <span className="text-sm text-gray-600">
            {currentPage + 1} / {scenes.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartoonMain;
