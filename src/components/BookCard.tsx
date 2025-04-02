type BookCardProps = {
  title: string;
  author: string;
  imageUrl: string;
  onClick?: () => void;
  size?: "sm" | "lg";
};

const cardSize = {
  sm: "w-40",
  lg: "w-full",
}

const BookCard = ({ title, author, imageUrl, onClick, size = "sm" }: BookCardProps) => {
  return (
    <div 
      className={`${cardSize[size]} h-50 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition hover:scale-[1.02]`}
      onClick={onClick}
    >  
      <img src={imageUrl} alt={title} className="w-11/12 mt-2 rounded-xl mx-auto h-28 object-cover pb-1" />
      <div className="p-1">
        <p className="pl-2 text-base">{title}</p>
        <p className="pl-2 text-sm text-[#A39C9C]">{author}</p>
      </div>
    </div>
  );
};

export default BookCard;