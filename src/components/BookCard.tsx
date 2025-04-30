import React, { useCallback, useMemo, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAppSelector } from "../redux/hooks";
import { makeSelectIsLiked } from "../redux/slices/likeSlice";
import useLikeToggle from "../hooks/useLikeToggle";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  thumbnailUrl: string;
  onBookSelect?: (book: { id: number; title: string; author: string; imageUrl: string }) => void;
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
  onBookSelect,
  size = "sm",
}) => {
  // 커스텀 훅을 사용하여 좋아요 토글 기능 가져오기
  const { toggleLike } = useLikeToggle();

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
      image: "h-56",
      title: "text-base md:text-lg",
      author: "text-sm md:text-base",
      heartSize: 24,
    },
  };

  const styles = cardStyles[size];

  // useCallback으로 핸들러 함수 메모이제이션
  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // 북카드 온클릭 이벤트 발생 방지
    
    // id 유효성 검사 추가
    if (typeof id !== 'number' || isNaN(id)) {
      console.error('유효하지 않은 도서 ID:', id);
      return;
    }
    
    // 새로운 훅의 toggleLike 함수 사용
    toggleLike(id);
  }, [id, toggleLike]);

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