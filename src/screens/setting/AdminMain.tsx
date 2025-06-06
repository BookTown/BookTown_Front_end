import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { fetchAllBookApplications, approveBookApplication, rejectBookApplication, } from '../../api/admin';
import { BookApplication } from '../../interfaces/bookInterface';
import ReasonModal from '../../components/ReasonModal';

const AdminMain: React.FC = () => {
  // 상태 관리
  const [requests, setRequests] = useState<BookApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 모달 관련 상태
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookApplication | null>(null);
  const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // 로그인 사용자의 역할 확인
  const userRole = useAppSelector((state) => state.user.role);
  const navigate = useNavigate();
  
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
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return dateString.substring(0, 10);
  };
  
  // 권한 체크 및 데이터 로드
  useEffect(() => {
    if (userRole !== 'ADMIN') {
      alert('관리자만 접근할 수 있는 페이지입니다.');
      navigate('/');
      return;
    }
    
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllBookApplications();
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
  }, [userRole, navigate]);
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);
  
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // 모달 열기 핸들러
  const handleOpenReasonModal = (request: BookApplication) => {
    setSelectedRequest(request);
    setIsReasonModalOpen(true);
  };
  
  // 거부 사유 모달 열기
  const handleOpenRejectModal = (request: BookApplication) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setIsRejectReasonModalOpen(true);
  };
  
  // 승인 처리 핸들러
  const handleApprove = async (id: number) => {
    if(window.confirm('이 신청을 승인하시겠습니까?')) {
      try {
        const response = await approveBookApplication(id);
        // 데이터 갱신 - 스크린샷에 맞게 응답 처리
        setRequests(requests.map(req => 
          req.id === id ? {
            ...req, 
            status: response.status,
            rejectionReason: null
          } : req
        ));
        alert('신청이 승인되었습니다.');
      } catch (error) {
        console.error('신청 승인 실패:', error);
        alert('신청 승인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };
  
  // 거부 처리 핸들러
  const handleReject = async () => {
    if (!selectedRequest) return;
    
    if (!rejectionReason.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }
    
    try {
      const response = await rejectBookApplication(selectedRequest.id, rejectionReason);
      // 데이터 갱신 - 스크린샷에 맞게 응답 처리
      setRequests(requests.map(req => 
        req.id === selectedRequest.id ? {
          ...req,
          status: response.status,
          rejectionReason: response.rejectionReason
        } : req
      ));
      setIsRejectReasonModalOpen(false);
      alert('신청이 거부되었습니다.');
    } catch (error) {
      console.error('신청 거부 실패:', error);
      alert('신청 거부에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFAF0] text-black px-4 pt-14 pb-24 md:pt-12 md:px-6">
        <div className="pl-0 pt-4 mb-6">
          <h1 className="text-3xl">신청리스트 관리</h1>
          <p className="text-xl text-[#A39C9C] pb-2">사용자들의 고전 신청 내역을 관리할 수 있어요</p>
        </div>
        <div className="w-full max-w-[37.5rem] mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center h-[22rem]">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFAF0] text-black px-4 pt-14 pb-24 md:pt-12 md:px-6">
        <div className="pl-0 pt-4 mb-6">
          <h1 className="text-3xl">신청리스트 관리</h1>
          <p className="text-xl text-[#A39C9C] pb-2">사용자들의 고전 신청 내역을 관리할 수 있어요</p>
        </div>
        <div className="w-full max-w-[37.5rem] mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center h-[22rem]">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF0] text-black px-4 pt-14 pb-24 md:pt-12 md:px-6">
      <div className="pl-0 pt-4 mb-6">
        <h1 className="text-3xl">신청리스트 관리</h1>
        <p className="text-xl text-[#A39C9C] pb-2">사용자들의 고전 신청 내역을 관리할 수 있어요</p>
      </div>
      
      <div className="w-full max-w-[37.5rem] mx-auto">
        <div className="bg-white rounded-lg shadow-sm pb-4 h-[22rem] overflow-y-auto">
          {/* 테이블 헤더 */}
          <div className="flex border-b border-black py-2 text-center mx-2">
            <div className="w-1/12"></div>
            <div className="w-2/5">책제목</div>
            <div className="w-1/6">신청자</div>
            <div className="w-1/6">신청일</div>
            <div className="w-1/6">상태</div>
            <div className="w-1/6">관리</div>
          </div>
          
          {/* 테이블 내용 */}
          {currentRequests.length > 0 ? (
            currentRequests.map((request) => (
              <div key={request.id} className="flex items-center text-center border-b border-gray-200 py-3 mx-2">
                {/* 승인/거절 버튼 */}
                <div className="w-1/12">
                  {request.status === 'PENDING' && (
                    <div className="flex justify-center space-x-1">
                      <Check 
                        onClick={() => handleApprove(request.id)}
                        className="h-5 text-green-500 hover:text-green-700 transition-colors duration-500 cursor-pointer"
                      />
                      <X 
                        onClick={() => handleOpenRejectModal(request)}
                        className="h-5 text-red-500 hover:text-red-700 transition-colors duration-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <div className="w-2/5">{truncateTitle(request.title)}</div>
                <div className="w-1/4">{formatDate(request.appliedDate)}</div>
                <span className={`${getStatusColor(request.status)} w-1/6`}>
                  {getStatusInKorean(request.status)}
                </span>
                <div className="w-1/6">
                  {(request.status === 'REJECTED') && (
                    <button 
                      className="px-2 py-1 text-xs bg-[#C75C5C] text-white rounded hover:bg-[#B04A4A] transition-colors"
                      onClick={() => handleOpenReasonModal({
                        ...request,
                        rejectionReason: request.rejectionReason || '사유가 없습니다.'
                      })}
                    >
                      사유
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              신청된 책이 없습니다.
            </div>
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

      {/* 거부 사유 조회 모달 */}
      {isReasonModalOpen && selectedRequest && (
        <ReasonModal 
          isOpen={isReasonModalOpen}
          onClose={() => setIsReasonModalOpen(false)}
          title={selectedRequest.title}
          reason={selectedRequest.rejectionReason || "사유가 없습니다."}
        />
      )}

      {/* 거부 사유 입력 모달 */}
      {isRejectReasonModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">거부 사유 입력</h3>
            <p className="text-sm text-gray-700 mb-4">
              "{selectedRequest.title}" 신청을 거부합니다. 거부 사유를 입력해주세요.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="거부 사유를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:border-[#C75C5C]"
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setIsRejectReasonModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleReject}
                className="px-4 py-2 bg-[#C75C5C] text-white rounded hover:bg-[#B04A4A] transition-colors"
              >
                거부 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMain;