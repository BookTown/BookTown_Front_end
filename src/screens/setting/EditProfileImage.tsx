import React, { useRef, useState, useEffect } from 'react';
import Button from '../../components/Button';
import axiosApi from "../../axios";
import basicProfile from "../../assets/basicProfile.png";

interface EditProfileImageProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File | string) => void; // string으로 타입 변경
  currentImage?: string | null; // 현재 프로필 이미지 URL (없으면 기본 이미지)
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const EditProfileImage = ({ isOpen, onClose, onSave, currentImage }: EditProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDefaultSelected, setIsDefaultSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setIsDefaultSelected(false);
      if (currentImage) {
        setPreviewUrl(currentImage);
      } else {
        setPreviewUrl(null);
      }
      setSelectedFile(null);
    }
  }, [isOpen, currentImage]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsDefaultSelected(false);
      setIsLoading(false);
      controllerRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 1MB를 초과할 수 없습니다.');
      return;
    }
    setSelectedFile(file);
    setIsDefaultSelected(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(currentImage || null);
    setIsDefaultSelected(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetDefault = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDefaultSelected(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (isDefaultSelected) {
        // 빈 문자열로 전송
        await axiosApi.post('/profile/update/image', { image: "" });
        onSave("");
        onClose();
        return;
      }
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      const controller = new AbortController();
      controllerRef.current = controller;
      await axiosApi.post('/profile/update/image', formData, {
        signal: controller.signal,
      });
      onSave(selectedFile!);
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

  const handleCancel = () => {
    controllerRef.current?.abort();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-2xl text-black text-center mb-5">프로필 이미지 변경</h2>

        {/* 이미지 미리보기 영역 */}
        <div className="w-48 h-48 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-full flex justify-center items-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기 이미지" className="w-full h-full object-cover" />
          ) : (isDefaultSelected || !currentImage) ? (
            <img src={basicProfile} alt="기본 프로필 이미지" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">이미지를 선택해주세요</span>
          )}
        </div>

        {/* 파일 이름 및 크기 표시 */}
        {selectedFile && (
          <p className="text-center text-sm text-gray-500 mb-4">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}

        {/* 이미지 선택 / 취소 / 기본 이미지 버튼 */}
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            이미지 선택
          </button>
          {selectedFile && (
            <button
              type="button"
              onClick={handleCancelSelection}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-600 transition-colors"
            >
              선택 취소
            </button>
          )}
          {(currentImage || previewUrl) && (
            <button
              type="button"
              onClick={handleSetDefault}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-600 transition-colors"
            >
              기본 이미지로 변경
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

        {/* 취소 / 저장 버튼 */}
        <div className="flex justify-between gap-2">
          <Button onClick={handleCancel} color="white" size="md">
            {isLoading ? '업로드 취소' : '취소'}
          </Button>
          <Button 
            onClick={handleSave} 
            color="pink" 
            size="md" 
            disabled={(!selectedFile && !isDefaultSelected) || isLoading}
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileImage;