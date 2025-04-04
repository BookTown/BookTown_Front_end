import React from "react";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  onClick?: () => void;
  size?: "sm" | "lg";
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  imageUrl,
  onClick,
  size = "sm",
}) => {
  // 크기별 스타일 설정
  const cardStyles = {
    sm: {
      container: "w-full",
      image: "h-48",
      title: "text-sm md:text-base",
      author: "text-xs md:text-sm",
    },
    lg: {
      container: "w-full",
      image: "h-56",
      title: "text-base md:text-lg",
      author: "text-sm md:text-base",
    },
  };

  const styles = cardStyles[size];

  return (
    <div
      className={`${styles.container} cursor-pointer transition-transform duration-200 hover:scale-105`}
      onClick={onClick}
    >
      <div className={`${styles.image} relative rounded-lg overflow-hidden mb-2 shadow-md`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="text-left px-0.5">
        <h3 className={`${styles.title} font-medium truncate`}>{title}</h3>
        <p className={`${styles.author} text-gray-600 truncate`}>{author}</p>
      </div>
    </div>
  );
};

export default React.memo(BookCard);