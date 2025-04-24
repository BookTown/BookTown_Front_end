import React from "react";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsLiked, toggleLike } from "../redux/slices/likeSlice";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  thumbnailUrl: string;
  onClick?: () => void;
  size?: "sm" | "lg";
  summaryUrl?: string;
  createdAt?: string;
  likeCount?: number;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  thumbnailUrl,
  onClick,
  size = "sm",
}) => {
  const dispatch = useAppDispatch();
  
  // 컴포넌트 렌더링시 book 객체 구조 확인
  console.log("BookCard 렌더링 - id:", id, "책 제목:", title, "저자:", author, "썸네일 URL:", thumbnailUrl);
  
  // id가 유효한지 확인하여 selectIsLiked 호출
  const isLiked = useAppSelector(state => 
    typeof id === 'number' && !isNaN(id) ? 
    selectIsLiked(state, id) : false
  );
  
  // 크기별 스타일 설정
  const cardStyles = {
    sm: {
      container: "w-full",
      image: "h-48",
      title: "text-sm md:text-base",
      author: "text-xs md:text-sm",
      heartSize: 20,
    },
    lg: {
      container: "w-full",
      image: "h-56",
      title: "text-base md:text-lg",
      author: "text-sm md:text-base",
      heartSize: 24,
    },
  };

  const styles = cardStyles[size];

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 북카드 온클릭 이벤트 발생 X
    
    console.log("👆 좋아요 버튼 클릭 - id:", id, "타입:", typeof id);
    
    // id 유효성 검사 추가
    if (typeof id !== 'number' || isNaN(id)) {
      console.error('유효하지 않은 도서 ID:', id);
      return;
    }
    
    try {
      console.log(`🔄 좋아요 토글 처리 시작: id=${id}, 현재 상태=${isLiked ? '좋아요 상태' : '좋아요 안함 상태'}`);
      // 토글 액션 디스패치
      const result = await dispatch(toggleLike(id)).unwrap();
      console.log('좋아요 토글 처리 완료:', result);
    } catch (error) {
      console.error("좋아요 토글 처리 실패:", error);
    }
  };

  return (
    <div
      className={`${styles.container} cursor-pointer transition-transform duration-200 hover:scale-105`}
      onClick={onClick}
    >
      <div className={`${styles.image} relative rounded-lg overflow-hidden mb-2 shadow-md group`}>
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        >
          <Heart
            size={styles.heartSize}
            className={`${isLiked ? "fill-[#C75C5C] stroke-[#C75C5C]" : "stroke-[#C75C5C]"}`}
          />
        </button>
      </div>
      <div className="text-left px-0.5">
        <h3 className={`${styles.title} font-medium truncate`}>{title}</h3>
        <p className={`${styles.author} text-[#9CAAB9] truncate`}>{author}</p>
      </div>
    </div>
  );
};

export default React.memo(BookCard);