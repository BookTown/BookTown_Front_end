import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  return (
    <div className="w-full flex flex-col">  
      {/* 이미지 컨테이너 */}
      <div className="w-full aspect-square relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt="장면 이미지" 
          className="w-full h-full object-cover absolute inset-0" 
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
      content: "나중까지나 너클로오스 왕사 피단치를 들여다 보언든 청년의 얼굴이는 경악한 표정이었다. 몸가 앞화에서 탈출하려와 덮으나.나중까지나 너클로오스 왕사 피단치를 들여다 보언든 청년의 얼굴이는 경악한 표정이었다. 몸가 앞화에서 탈출하려와 덮으나.나중까지나 너클로오스 왕사 피단치를 들여다 보언든 청년의 얼굴이는 경악한 표정이었다. 몸가 앞화에서 탈출하려와 덮으나.",
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
    <div className="pt-14 pb-4 px-4 flex flex-col items-center">
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
