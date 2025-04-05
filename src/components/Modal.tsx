import Button from "./Button";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const Modal = ({ book }: { book: Book }) => {
  if (!book) return null;

  return (
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
        <Button size="md" color="white" type="button">
          줄거리 보기
        </Button>
        <Button size="md" color="pink" type="button">
          퀴즈 풀기
        </Button>
      </div>
    </div>
  );
};

export default Modal;
