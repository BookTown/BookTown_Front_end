import React, { useState } from 'react';
import { mockBookRequests } from '../mocks/mockBookRequests';
import { Trash2 } from 'lucide-react';
import ReasonModal from './ReasonModal';

const RegisterList: React.FC = () => {
  // 상태 배경색 설정 함수
  const getStatusColor = (status: string) => {
    switch(status) {
      case '승인 거부':
        return 'text-[#C75C5C]';
      case '승인 완료':
        return 'text-[#4CAF50]';
      case '승인 대기':
        return 'text-[#A39C9C]';
      default:
        return '';
    }
  };
  
  // 보기 버튼 클릭시 사유를 보여주는 모달 상태
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{id: number, title: string, reason: string} | null>(null);
  
  // 삭제할 목록을 관리하기 위한 상태
  const [requests, setRequests] = useState(mockBookRequests);
  
  // 임시로 mockBookRequests를 사용하여 삭제 기능 구현했음
  const handleDelete = (id: number) => {
    if(window.confirm('정말 이 신청을 삭제하시겠습니까?')) {
      setRequests(requests.filter(request => request.id !== id));
    }
  };
  
  // 사유 모달 열기
  const handleOpenReasonModal = (request: {id: number, title: string, reason: string}) => {
    setSelectedRequest(request);
    setIsReasonModalOpen(true);
  };

  return (
    <div className="w-full max-w-[37.5rem] bg-white rounded-lg shadow-sm pb-4 overflow-y-auto mx-auto">
        {/* 테이블 헤더 */}
        <div className="flex border-b border-black py-2 text-center mx-2">
          <div className='w-1/12'></div>
          <div className="w-1/3 ">상태</div>
          <div className="w-1/6 ">신청일</div>
          <div className="w-2/5 ">책제목</div>
          <div className="w-1/5">사유</div>
        </div>
        
        {/* 테이블 내용 */}
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="flex items-center text-center border-b border-gray-200 py-3 mx-2">
              {/* 쓰레기통 버튼을 눌렀을 때, 리스트가 삭제되는 로직 */}
              <div className="w-1/12">
                <Trash2 
                  onClick={() => handleDelete(request.id)}
                  className="h-5 text-gray-400 hover:text-[#C75C5C] transition-colors duration-500 cursor-pointer mx-auto"
                />
              </div>
              <span className={`${getStatusColor(request.status)} w-1/3`}>{request.status}</span>
              <div className="w-1/6">{request.requestDate}</div>
              <div className="w-2/5">{request.title}</div>
              <div className="w-1/5">
                {request.status === '승인 거부' && (
                  <button 
                    className="px-2 py-1 text-xs bg-[#C75C5C] text-white rounded hover:bg-[#B04A4A] transition-colors"
                    onClick={() => handleOpenReasonModal({
                      id: request.id, 
                      title: request.title,
                      reason: request.reason || '사유가 없습니다.'
                    })}
                  >
                    보기
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            신청한 책이 없습니다.
          </div>
        )}
        
        {/* 사유 모달 */}
        {isReasonModalOpen && selectedRequest && (
          <ReasonModal 
            isOpen={isReasonModalOpen}
            onClose={() => setIsReasonModalOpen(false)}
            title={selectedRequest.title}
            reason={selectedRequest.reason}
          />
        )}
      </div>
  );
};

export default RegisterList;