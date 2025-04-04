import Modal from "./Modal";

type Book = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
};

const ModalOverlay = ({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 바깥 클릭 시 닫힘 */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* 모달 콘텐츠 */}
      <Modal book={book} />
    </div>
  );
};

export default ModalOverlay;