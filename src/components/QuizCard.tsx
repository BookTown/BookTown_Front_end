import React, { useCallback } from "react";

interface QuizCardProps {
  id: number;
  title: string;
  author: string;
  thumbnailUrl: string;
  onQuizSelect?: (quiz: { id: number; title: string; author: string; imageUrl: string }) => void;
  size?: "sm" | "lg";
  correctCount: number;
  totalCount: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  author,
  thumbnailUrl,
  onQuizSelect,
  size = "sm",
  correctCount,
  totalCount
}) => {
  // 크기별 스타일 설정
  const cardStyles = {
    sm: {
      container: "w-full",
      image: "h-48",
      title: "text-sm md:text-base",
      author: "text-xs md:text-sm",
      score: "text-xs md:text-sm font-semibold",
    },
    lg: {
      container: "w-full",
      image: "h-56",
      title: "text-base md:text-lg",
      author: "text-sm md:text-base",
      score: "text-sm md:text-base font-semibold",
    },
  };

  const styles = cardStyles[size];

  // onQuizSelect 핸들러 메모이제이션
  const handleCardClick = useCallback(() => {
    if (onQuizSelect) {
      onQuizSelect({
        id,
        title,
        author,
        imageUrl: thumbnailUrl
      });
    }
  }, [id, title, author, thumbnailUrl, onQuizSelect]);

  // 점수에 따른 색상 결정
  const getScoreColor = () => {
    const percentage = (correctCount / totalCount) * 100;
    if (percentage >= 80) return "text-[#4CAF50]"; // 80% 이상 초록색
    if (percentage >= 50) return "text-[#FFC107]"; // 50% 이상 노란색
    return "text-[#F44336]"; // 50% 미만 빨간색
  };

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
      </div>
      <div className="flex items-center pr-2">
        <div className="flex-1 min-w-0">
          <h3 className={`${styles.title} font-medium truncate`}>{title}</h3>
          <p className={`${styles.author} text-[#9CAAB9] truncate`}>{author}</p>
        </div>
        <span className={`${styles.score} ml-4 ${getScoreColor()} whitespace-nowrap`}>
          {correctCount}/{totalCount}
        </span>
      </div>
    </div>
  );
};

// React.memo를 사용하여 props가 변경될 때만 리렌더링
export default React.memo(QuizCard);