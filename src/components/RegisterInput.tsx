import React, { useState } from 'react';
import Button from './Button';
import { applyBook } from '../api/api';

interface RegisterInputProps {
  onCancel: () => void;
  onSubmit: (title: string) => void;
}

const RegisterInput: React.FC<RegisterInputProps> = ({ onCancel, onSubmit }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (bookTitle.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await applyBook(bookTitle.trim());
        console.log('책 신청 완료:', response);
        onSubmit(bookTitle);
        setBookTitle('');
        alert('책 신청이 완료되었습니다!');
      } catch (error) {
        console.error('책 신청 실패:', error);
        alert('책 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 버튼 비활성화 여부 확인
  const isButtonDisabled = !bookTitle.trim() || isSubmitting;

  return (
    <div className='max-w-[37.5rem] mx-auto'>
      <div className="w-full bg-white rounded-xl shadow-sm p-4 mt-6">
        <h3 className="text-lg mb-4">고전 신청하기</h3>
        <div className="border-t border-black pt-4">
          <div className="mb-4 flex items-center border-b border-gray-300 pb-6">
            <label className="px-4">고전 이름</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="책 제목을 적어주세요"
              className="w-56 border border-gray-300 rounded p-2 text-sm"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>※ Gutenberg에 존재하는 고전 문학만 신청 가능합니다.</p>
            <p>※ 관리자 등록 시 까지 시간이 소요될 수 있습니다.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-8">
        <Button 
          color="pink" 
          size="md" 
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`px-8 !w-24 !h-12 !rounded-xl !text-2xl ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          신청
        </Button>
        <Button 
          color="white" 
          size="md" 
          onClick={onCancel}
          className="px-8 !w-24 !h-12 !rounded-xl !text-2xl"
          disabled={isSubmitting}
        >
          목록
        </Button>
      </div>
    </div>
  );
};

export default RegisterInput;