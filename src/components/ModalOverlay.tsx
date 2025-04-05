import { useEffect } from "react";
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
  requireSubmit = false,
}: {
  book: Book;
  onClose: () => void;
  requireSubmit?: boolean;
}) => {
  // ESC 키 이벤트 핸들러 추가
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !requireSubmit) {
        onClose();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleEscKey);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, requireSubmit]);

  // 바깥 클릭 핸들러
  const handleOutsideClick = () => {
    if (!requireSubmit) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 바깥 클릭 시 닫힘 (requireSubmit이 false일 때만) */}
      <div className="absolute inset-0" onClick={handleOutsideClick}></div>

      {/* 모달 콘텐츠 */}
      <Modal book={book} />
    </div>
  );
};

export default ModalOverlay;