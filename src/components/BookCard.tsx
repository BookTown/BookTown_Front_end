import React, { useCallback, useMemo, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { makeSelectIsLiked, toggleLike } from "../redux/slices/likeSlice";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  thumbnailUrl: string;
  onBookSelect?: (book: { id: number; title: string; author: string; imageUrl: string }) => void; // onClick 대신 onBookSelect로 변경
  size?: "sm" | "lg";
  summaryUrl?: string;
  likeCount?: number;
  onToggleLike?: (bookId: number) => void; // 추가
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  thumbnailUrl,
  onBookSelect,
  size = "sm",
  onToggleLike
}) => {
  const dispatch = useAppDispatch();

   // 리렌더링 확인용 로그
  useEffect(() => {
    console.log(`📘 BookCard [${id}] "${title}" 렌더링됨`);
  });
  
  // 메모이제이션된 선택자 생성 (컴포넌트 내에서)
  const selectIsBookLiked = useMemo(makeSelectIsLiked, []);
  
  // 이 특정 책에 대한 좋아요 상태만 구독
  const isLiked = useAppSelector(state => 
    typeof id === 'number' && !isNaN(id) ? 
    selectIsBookLiked(state, id) : false
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
      image: "h-40 md:h-56",
      title: "text-base md:text-lg",
      author: "text-sm md:text-base",
      heartSize: 24,
    },
  };

  const styles = cardStyles[size];

  // useCallback으로 핸들러 함수 메모이제이션
  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (typeof id !== 'number' || isNaN(id)) {
      console.error('유효하지 않은 도서 ID:', id);
      return;
    }
    
    try {
      console.log(`🔄 좋아요 토글 처리 시작: id=${id}`);
      
      // onToggleLike가 제공된 경우 해당 핸들러 사용, 아니면 기본 토글 동작
      if (onToggleLike) {
        await onToggleLike(id);
      } else {
        await dispatch(toggleLike(id)).unwrap();
      }
    } catch (error) {
      console.error("좋아요 토글 처리 실패:", error);
    }
  }, [id, dispatch, onToggleLike]);

  // onBookSelect 핸들러 메모이제이션
  const handleCardClick = useCallback(() => {
    if (onBookSelect) {
      onBookSelect({
        id,
        title,
        author,
        imageUrl: thumbnailUrl
      });
    }
  }, [id, title, author, thumbnailUrl, onBookSelect]);

  return (
    <div
      className={`${styles.container} cursor-pointer transition-transform duration-200 hover:scale-105`}
      onClick={handleCardClick}
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

// React.memo를 사용하여 props가 변경될 때만 리렌더링
export default React.memo(BookCard);