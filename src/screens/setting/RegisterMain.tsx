import React, { useState } from 'react';
import RegisterList from '../../components/RegisterList';
import RegisterInput from '../../components/RegisterInput';
import { Pencil } from 'lucide-react';

const RegisterMain: React.FC = () => {
  const [isInputMode, setIsInputMode] = useState(false);

  const handleSubmit = (title: string) => {
    // 여기서 신청 로직
    // 신청 완료 후 목록 모드로 전환
    setIsInputMode(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] text-black px-4 pt-14 pb-24 md:pt-12 md:px-6">
      <div className="flex justify-between items-center" style={{ paddingTop: '100px' }}>
          <div className="pt-4">
          <h1 className="text-3xl">원하는 고전 신청하기</h1>
          <p className="text-xl text-[#A39C9C] pb-2">보고싶은 책을 신청할 수 있어요</p>
        </div>
      </div>
      
      <div className="pt-0 md:pt-[100px]">
        {!isInputMode && (
          <div className='flex justify-between pt-4 pb-2 px-1 max-w-[37.5rem] mx-auto'>
            <div className="text-2xl">신청 리스트</div>
            <button
              onClick={() => setIsInputMode(true)}
              className="p-2 rounded-full hover:text-[#C75C5C] transition-colors duration-500"
            >
              <Pencil size={20} />
            </button>
          </div>
        )}
        <div style={{ paddingTop: isInputMode ? '100px' : '0' }}>
          {isInputMode ? (
          <RegisterInput 
            onCancel={() => setIsInputMode(false)} 
            onSubmit={handleSubmit}
          />
        ) : (
          <RegisterList />
        )}
        </div>
      </div>
    </div>
  );
};

export default RegisterMain;