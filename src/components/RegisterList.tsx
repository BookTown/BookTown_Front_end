import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import ReasonModal from './ReasonModal';
import { fetchBookApplications, deleteBookApplication } from '../api/api';
import { BookApplication } from '../interfaces/bookInterface';

const RegisterList: React.FC = () => {
  // 상태 변환 함수
  const getStatusInKorean = (status: string) => {
    switch(status) {
      case 'PENDING':
        return '승인 대기';
      case 'APPROVED':
        return '승인 완료';
      case 'REJECTED':
        return '승인 거부';
      default:
        return status;
    }
  };

  // 상태 배경색 설정 함수
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'REJECTED':
      case '승인 거부':
        return 'text-[#C75C5C]';
      case 'APPROVED':
      case '승인 완료':
        return 'text-[#4CAF50]';
      case 'PENDING':
      case '승인 대기':
        return 'text-[#A39C9C]';
      default:
        return '';
    }
  };
  
  // 제목 생략 함수
  const truncateTitle = (title: string) => {
    return title.length > 10 ? title.slice(0, 10) + "..." : title;
  };
  
  // 보기 버튼 클릭시 사유를 보여주는 모달 상태
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{id: number, title: string, reason: string} | null>(null);
  
  // 신청 내역 상태 관리
  const [requests, setRequests] = useState<BookApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return dateString.substring(2);
  };
  
  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBookApplications();
        setRequests(data || []);
      } catch (err) {
        console.error('신청 내역 불러오기 실패:', err);
        setError('신청 내역을 불러오는데 실패했습니다.');
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);
  
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // 삭제 기능 구현
  const handleDelete = async (id: number) => {
    if(window.confirm('정말 이 신청을 삭제하시겠습니까?')) {
      try {
        await deleteBookApplication(id);
        setRequests(requests.filter(request => request.id !== id));
        
        // 삭제 후 현재 페이지에 아이템이 없으면 이전 페이지로
        const newTotal = requests.length - 1;
        const newTotalPages = Math.ceil(newTotal / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        console.error('신청 삭제 실패:', error);
        alert('신청 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };
  
  // 사유 모달 열기
  const handleOpenReasonModal = (request: {id: number, title: string, reason: string}) => {
    setSelectedRequest(request);
    setIsReasonModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[37.5rem] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center h-[24rem] md:h-[23rem]">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[37.5rem] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center h-[24rem] md:h-[23rem]">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[37.5rem] mx-auto">
      <div className="bg-white rounded-lg shadow-sm pb-4 h-[24rem] md:h-[23rem] overflow-y-auto">
        {/* 테이블 헤더 */}
        <div className="flex border-b border-black py-2 text-center mx-2">
          <div className='w-1/12'></div>
          <div className="w-2/5 ">책제목</div>
          <div className="w-1/4 ">신청일</div>
          <div className="w-1/4 ">상태</div>
          <div className="w-1/5">사유</div>
        </div>
        
        {/* 테이블 내용 */}
        {requests.length > 0 ? (
          currentRequests.map((request) => (
            <div key={request.id} className="flex items-center text-center border-b border-gray-200 py-3 mx-2">
              {/* 쓰레기통 버튼을 눌렀을 때, 리스트가 삭제되는 로직 */}
              <div className="w-1/12">
                <Trash2 
                  onClick={() => handleDelete(request.id)}
                  className="h-5 text-gray-400 hover:text-[#C75C5C] transition-colors duration-500 cursor-pointer mx-auto"
                />
              </div>
              <div className="w-2/5">{truncateTitle(request.title)}</div>
              <div className="w-1/4">{formatDate(request.appliedDate)}</div>
              <span className={`${getStatusColor(request.status)} w-1/4`}>
                {getStatusInKorean(request.status)}
              </span>
              <div className="w-1/5">
                {(request.status === 'REJECTED' || request.status === '승인 거부') && (
                  <button 
                    className="px-2 py-1 text-xs bg-[#C75C5C] text-white rounded hover:bg-[#B04A4A] transition-colors"
                    onClick={() => handleOpenReasonModal({
                      id: request.id, 
                      title: request.title,
                      reason: request.rejectionReason || '사유가 없습니다.'
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-full bg-[#FFFAF0] text-sm disabled:opacity-50 hover:opacity-80 transition-colors"
          >
            이전
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#C75C5C] text-white"
                    : "bg-[#FFFAF0] hover:opacity-80 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-full bg-[#FFFAF0] text-sm disabled:opacity-50 hover:opacity-80 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterList;