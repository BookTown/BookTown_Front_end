import React, { useState } from "react";
import { X } from "lucide-react";

interface ExitMemberProps {
  onClose: () => void;
}

const ExitMember: React.FC<ExitMemberProps> = ({ onClose }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl md:text-3xl mb-4 text-center">
          정말 탈퇴하시겠어요?
        </h2>

        <div className="text-sm md:text-base text-black leading-relaxed mb-4">
          <p className="mb-2">회원탈퇴를 진행하면 아래 내용에 동의하는 것으로 간주합니다:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>요약된 줄거리, 생성된 일러스트를 포함한 모든 데이터는 삭제됩니다.</li>
            <li>다시 가입해도 삭제된 정보는 복원되지 않습니다.</li>
          </ul>
        </div>

        <div className="flex items-start gap-2 mb-6">
          <input
            id="agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 accent-[#C75C5C] cursor-pointer"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            위 내용을 모두 확인하였으며 탈퇴에 동의합니다.
          </label>
        </div>

        <button
          disabled={!agreed}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            agreed
              ? "bg-[#C75C5C] hover:bg-[#b54d4d] active:bg-[#a44444]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default ExitMember;