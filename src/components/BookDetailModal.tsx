import Button from "./Button";


type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};


const BookDetailModal = ({ book, onClose }: { book: Book; onClose: () => void }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-4 w-[90%] max-w-sm shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <img src={book.imageUrl} alt={book.title} className="ml-3 w-16 h-16 object-cover rounded" />
          <div>
            <h2 className="text-xl">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        </div>

        <div className="flex justify-between px-3">
          <Button
            size="md"
            color="white"
            type="submit"
          >
            줄거리 보기
          </Button>
          <Button
            size="md"
            color="pink"
            type="submit"
          >
            퀴즈 풀기
          </Button>
        </div>
      </div>

      {/* 바깥 영역 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
};

export default BookDetailModal;