import { useEffect } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartoon } from "../redux/slices/cartoonSlice";
import { fetchBookSummary } from "../api/api";
import { IBookDetail } from "../interfaces/bookInterface";

interface BookModalProps {
  book: {
    id: number;         // 백엔드 API에서 id로 사용
    title: string;
    author: string;
    imageUrl: string;   // 백엔드 API에서는 thumbnailUrl로 사용
  };
  onClose: () => void;
  requireSubmit?: boolean;
}

const BookModal = ({ book, onClose, requireSubmit = false }: BookModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ESC 키로 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !requireSubmit) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose, requireSubmit]);

  // 바깥 클릭 시 닫기
  const handleOutsideClick = () => {
    if (!requireSubmit) {
      onClose();
    }
  };

  // 줄거리 보기 버튼 클릭 핸들러
  const handleViewSummary = async () => {
    // book.id 확인
    if (!book || book.id === undefined) {
      console.error('📚 오류: 책 ID가 없습니다.', book);
      return; // 함수 실행 중단
    }
    
    console.log('📚 줄거리 보기 버튼 클릭', { id: book.id });
    
    // 먼저 모달 닫기
    onClose();
    
    // 로딩 화면으로 이동
    console.log('📚 로딩 화면으로 이동');
    navigate('/loading');
    
    // 백그라운드에서 API 호출 시작
    try {
      console.log('📚 줄거리 데이터 요청 시작');
      
      // 줄거리 데이터 불러오기
      const summaryData = await fetchBookSummary(book.id.toString());
      
      console.log('📚 줄거리 데이터 수신 완료', { 
        sceneCount: summaryData.length,
        firstScene: summaryData[0]
      });
      
      console.log('📚 Redux 스토어에 데이터 저장 시작');
      // 책 정보와 줄거리 데이터를 Redux 스토어에 저장
      const bookDetail: IBookDetail = {
        id: book.id,
        title: book.title,
        author: book.author,
        summaryUrl: "",
        thumbnailUrl: book.imageUrl,
        createdAt: new Date().toISOString(),
        scenes: summaryData,
        likeCount: 0
      };
      
      dispatch(setCartoon(bookDetail));
      
      console.log('📚 Redux 스토어 저장 완료, 페이지 이동 준비');
      
      console.log(`📚 줄거리 페이지로 이동: /cartoon/${book.id}`);
      navigate(`/cartoon/${book.id}`); // 줄거리 화면으로 이동
    } catch (error) {
      console.error("줄거리를 불러오는 중 오류가 발생했습니다:", error);
      // 오류 발생 시 홈으로 이동하거나 에러 페이지로 이동
      navigate('/home');
      // 오류 알림 표시 (alert 또는 toast 메시지)
      alert("줄거리를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 퀴즈 풀기 버튼 클릭 핸들러
  const handleStartQuiz = () => {
    onClose(); // 모달 닫기
    navigate(`/quizStart/${book.id}`); // 퀴즈 시작 화면으로 이동
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* dim 배경 바깥 클릭 */}
      <div className="absolute inset-0" onClick={handleOutsideClick} />

      {/* 모달 본문 */}
      <div className="bg-white rounded-xl p-4 md:py-6 w-[90%] max-w-sm md:max-w-md lg:max-w-lg shadow-lg z-10">
        <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="ml-3 w-16 h-16 md:w-24 md:h-24 object-cover rounded"
          />
          <div>
            <h2 className="text-xl md:text-2xl">{book.title}</h2>
            <p className="text-sm md:text-base text-[#A39C9C]">{book.author}</p>
          </div>
        </div>

        <div className="flex justify-between md:justify-around gap-4 md:gap-12 px-3">
          <Button size="md" color="white" type="button" onClick={handleViewSummary}>
            줄거리 보기
          </Button>
          <Button size="md" color="pink" type="button" onClick={handleStartQuiz}>
            퀴즈 풀기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookModal;