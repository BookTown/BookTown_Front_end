import React, { useRef, useState, useEffect } from 'react';
import Button from '../../components/Button';
import axiosApi from "../../axios"

interface EditProfileImageProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  currentImage?: string | null; // 현재 프로필 이미지 URL 추가
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const EditProfileImage = ({ isOpen, onClose, onSave, currentImage }: EditProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const controllerRef = useRef<AbortController | null>(null); // AbortController 저장용 ref

  // 모달이 열릴 때 현재 이미지 설정
  useEffect(() => {
    if (isOpen && currentImage) {
      setPreviewUrl(currentImage);
    }
  }, [isOpen, currentImage]);
  
  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsLoading(false);
      controllerRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기는 1MB를 초과할 수 없습니다.');
        return;
      }
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

      const formData = new FormData();
      formData.append('file', selectedFile);

      const controller = new AbortController();
      controllerRef.current = controller;

      await axiosApi.post('/profile/update/image', formData, {
        signal: controller.signal,
      });

      onSave(selectedFile);
      onClose();
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.warn('❌ 업로드가 취소되었습니다.');
      } else {
        console.error('❌ 프로필 이미지 업데이트 실패:', error);
        alert('프로필 이미지 업데이트에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    // 새로 선택한 이미지가 있는 경우 - 선택 취소
    if (selectedFile) {
      setSelectedFile(null);
      setPreviewUrl(currentImage || null);
    return;
  }

    try {
      setIsLoading(true);
      await axiosApi.delete('/profile/delete/image');
      setSelectedFile(null);
      setPreviewUrl(null);
      onSave(null as unknown as File);
      onClose();
    } catch (error) {
      console.error('❌ 프로필 이미지 삭제 실패:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    controllerRef.current?.abort();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-2xl text-black text-center mb-5">
          프로필 이미지 변경
        </h2>

        <div className="w-48 h-48 mx-auto mb-3 border-2 border-dashed border-gray-300 rounded-full flex justify-center items-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">이미지를 선택해주세요</span>
          )}
        </div>

        {selectedFile && (
          <p className="text-center text-sm text-gray-500 mb-4">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}

        <div className="text-center mb-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            이미지 선택
          </button>
          {(previewUrl || selectedFile) && (
            <button
              onClick={handleDeleteImage}
              className="ml-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-600 transition-colors"
            >
              {selectedFile ? '선택 취소' : '이미지 제거'}
            </button>
          )}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex justify-between gap-2 mx-auto">
          <Button onClick={handleCancel} color="white" size="md">
            {isLoading ? '업로드 취소' : '취소'}
          </Button>
          <Button 
            onClick={handleSave} 
            color="pink" 
            size="md" 
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