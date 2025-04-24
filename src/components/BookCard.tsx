import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsLiked, addLike, removeLike } from "../redux/slices/likeSlice";

interface BookCardProps {
  bookId: number;
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
  bookId,
  title,
  author,
  thumbnailUrl,
  onClick,
  size = "sm",
}) => {
  const dispatch = useAppDispatch();
  
  // bookId가 유효한지 확인하여 selectIsLiked 호출
  const isLiked = useAppSelector(state => 
    typeof bookId === 'number' && !isNaN(bookId) ? 
    selectIsLiked(state, bookId) : false
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
    
    // bookId 유효성 검사 추가
    if (typeof bookId !== 'number' || isNaN(bookId)) {
      console.error('유효하지 않은 bookId:', bookId);
      return;
    }
    
    try {
      console.log(`좋아요 처리 시작: bookId=${bookId}, 현재 상태=${isLiked ? '좋아요 취소' : '좋아요 추가'}`);
      if (isLiked) {
        await dispatch(removeLike(bookId)).unwrap();
      } else {
        await dispatch(addLike(bookId)).unwrap();
      }
      console.log('좋아요 처리 완료');
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
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
