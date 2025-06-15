import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { setVoiceType } from "../redux/slices/ttsSlice";

interface TTSModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVoice?: string;
  onSave: (voice: string) => void;
}

type VoiceOption = {
  id: string;
  label: string;
};

const TTSModal: React.FC<TTSModalProps> = ({
  isOpen,
  onClose,
  initialVoice = localStorage.getItem('ttsVoiceType') === 'male' ? '남성' : '여성',
  onSave,
}) => {
  const dispatch = useDispatch();
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);

  if (!isOpen) return null;

  const voiceOptions: VoiceOption[] = [
    { id: "남성", label: "남성" },
    { id: "여성", label: "여성" },
  ];

  const handleSave = () => {
    const voiceType = selectedVoice === "남성" ? "male" : "female";
    dispatch(setVoiceType(voiceType));
    onSave(selectedVoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl md:text-3xl mb-8 text-center">
          TTS 설정
        </h2>

        <div className="flex justify-center gap-8 mb-10">
          {voiceOptions.map((option) => (
            <VoiceOptionButton
              key={option.id}
              label={option.label}
              isSelected={selectedVoice === option.id}
              onClick={() => setSelectedVoice(option.id)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            color="pink"
            size="md"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

// 음성 옵션 버튼 컴포넌트
interface VoiceOptionButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const VoiceOptionButton: React.FC<VoiceOptionButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-20 h-20 rounded-full flex items-center justify-center
        border transition-all
        ${
          isSelected
            ? "bg-[#C75C5C] text-white border-[#C75C5C]"
            : "bg-white text-[#C75C5C] border-[#C75C5C] hover:bg-[#FDE8E8]"
        }
      `}
    >
      <span className="text-lg font-medium">{label}</span>
    </button>
  );
};

export default TTSModal;