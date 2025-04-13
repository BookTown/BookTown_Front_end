import React, { useRef, useState } from 'react';
import Button from '../../components/Button';
import { updateProfileImage } from '../../api/user';

interface EditProfileImageProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}

const EditProfileImage = ({ isOpen, onClose, onSave }: EditProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      await updateProfileImage(selectedFile);
      onSave(selectedFile);
      onClose();
    } catch (error) {
      console.error('Failed to update profile image:', error);
      alert('프로필 이미지 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-2xl text-black text-center mb-5">
          프로필 이미지 변경
        </h2>
        
        <div className="w-48 h-48 mx-auto mb-5 border-2 border-dashed border-gray-300 rounded-full flex justify-center items-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">이미지를 선택해주세요</span>
          )}
        </div>

        <div className="text-center mb-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            이미지 선택
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex justify-between gap-2 mx-auto">
          <Button onClick={onClose} color="white" size='md'>취소</Button>
          <Button 
            onClick={handleSave} 
            color="pink" 
            size='md' 
            disabled={!previewUrl || isLoading}
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileImage;