import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { updateProfileInfo } from '../../api/user';

interface EditProfileInfoProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentIntro: string;
  onSave: (name: string, intro: string) => void;
  userId: number;
}

const EditProfileInfo = ({ isOpen, onClose, currentName, currentIntro, onSave, userId }: EditProfileInfoProps) => {
  const [name, setName] = useState(currentName);
  const [intro, setIntro] = useState(currentIntro);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setIntro(currentIntro);
    }
  }, [isOpen, currentName, currentIntro]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfileInfo(userId, {
        username: name,
        introduction: intro,
        score: 0,
        difficulty: 'EASY'
      });
      onSave(name, intro);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-2xl text-black text-center mb-5">
          프로필 정보 수정
        </h2>
        
        <div className="mb-4">
          <label className="block text-black mb-2">이름</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-brown-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">자기소개</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="자기소개를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:border-brown-500"
          />
        </div>

        <div className="flex justify-between gap-2 mx-auto">
          <Button onClick={onClose} color="white" size='md'>취소</Button>
          <Button 
            onClick={handleSave} 
            color="pink" 
            size='md' 
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileInfo;