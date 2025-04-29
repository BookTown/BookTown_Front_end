import React, { useRef, useState, useEffect } from 'react';
import Button from '../../components/Button';
import { updateProfileImage, deleteProfileImage } from '../../api/user';


interface EditProfileImageProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  onDelete?: () => void;
  currentProfileImage?: string | null;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const EditProfileImage = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  currentProfileImage 
}: EditProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const controllerRef = useRef<AbortController | null>(null); // AbortController 저장용 ref
  
  // 현재 사용자가 프로필 이미지를 가지고 있는지 확인
  const hasCurrentProfileImage = !!currentProfileImage;
  
  // 이미지가 변경되었는지 여부 확인 (새 이미지 선택 또는 기존 이미지 제거)
  const hasChanges = selectedFile !== null || (hasCurrentProfileImage && previewUrl === null);

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsLoading(false);
      setIsDeletingImage(false);
      controllerRef.current = null;
    } else {
      // 모달이 열릴 때 현재 프로필 이미지가 있으면 미리보기로 설정
      if (currentProfileImage) {
        setPreviewUrl(currentProfileImage);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [isOpen, currentProfileImage]);

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
      await updateProfileImage(selectedFile);
      console.log('✅ 프로필 이미지 업로드 완료');
      alert('프로필 이미지가 업데이트되었습니다.');
      setPreviewUrl(null);
      setSelectedFile(null);
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

  // 프로필 이미지 삭제 처리 함수
  const handleDeleteImage = async () => {
    if (!window.confirm('프로필 이미지를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      setIsDeletingImage(true);
      await deleteProfileImage();
      console.log('✅ 프로필 이미지 삭제 완료');
      alert('프로필 이미지가 삭제되었습니다.');
      
      // 상위 컴포넌트에 삭제 알림 (있는 경우)
      if (onDelete) {
        onDelete();
      }
      
      onClose();
    } catch (error) {
      console.error('❌ 프로필 이미지 삭제 실패:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleCancel = () => {
    controllerRef.current?.abort();
    onClose();
  };
  
  // 저장 버튼 클릭 시 실행할 함수 결정
  const handleActionButton = () => {
    if (selectedFile) {
      // 새 이미지가 선택된 경우 - 업로드
      return handleSave();
    } else if (previewUrl === null && hasCurrentProfileImage) {
      // 이미지를 삭제하려는 경우
      return handleDeleteImage();
    }
  };
  
  // 저장 버튼의 텍스트 결정
  const getActionButtonText = () => {
    if (isLoading) return '저장 중...';
    if (isDeletingImage) return '삭제 중...';
    if (selectedFile) return '저장';
    if (previewUrl === null && hasCurrentProfileImage) return '이미지 삭제';
    return '저장';
  };

  // 이미지 미리보기 초기화 (삭제하기로 결정)
  const handleClearPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
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

        <div className="text-center mb-4 flex justify-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            이미지 선택
          </button>
          
          {/* 프리뷰가 있을 때만 삭제 버튼 표시 */}
          {previewUrl && (
            <button 
              onClick={handleClearPreview}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-600 transition-colors"
            >
              이미지 제거
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
            취소
          </Button>
          <Button 
            onClick={handleActionButton} 
            color="pink" 
            size="md" 
            disabled={!hasChanges || isLoading || isDeletingImage}
          >
            {getActionButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileImage;