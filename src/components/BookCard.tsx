type BookCardProps = {
  title: string;
  author: string;
  imageUrl: string;
  onClick?: () => void;
};

const BookCard = ({ title, author, imageUrl, onClick }: BookCardProps) => {
  return (
    <div 
      className="w-40 h- flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition hover:scale-[1.02]"
      onClick={onClick}
    >  
      <img src={imageUrl} alt={title} className="w-11/12 mt-2 rounded-xl mx-auto h-28 object-cover pb-1" />
      <div className="p-1">
        <p className="text-base">{title}</p>
        <p className="text-sm text-[#A39C9C]">{author}</p>
      </div>
    </div>
  );
};

export default BookCard;