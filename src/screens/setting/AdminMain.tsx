import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { Trash2, X, ExternalLink } from "lucide-react";
import {
  fetchAllBookApplications,
  approveBookApplication,
  rejectBookApplication,
  AdminDeleteBookApplication,
} from "../../api/admin";
import { registerBook } from "../../api/api"; // 책 등록 API 추가
import { BookApplication } from "../../interfaces/bookInterface";
import ReasonModal from "../../components/ReasonModal";
import { fetchUserProfile } from "../../api/user"; // 사용자 정보 조회 API 추가
import { setUserData } from "../../redux/slices/userSlice"; // Redux 액션 추가

const AdminMain: React.FC = () => {
  // 상태 관리
  const [requests, setRequests] = useState<BookApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedTitleId, setExpandedTitleId] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // 권한 확인 상태 추가

  // 모달 관련 상태
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<BookApplication | null>(null);
  const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // 책 등록 관련 상태 추가
  const [gutenbergId, setGutenbergId] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redux
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // dispatch 추가

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 제목 클릭 핸들러
  const handleTitleClick = (id: number) => {
    if (expandedTitleId === id) {
      setExpandedTitleId(null); // 같은 제목 다시 클릭하면 접기
    } else {
      setExpandedTitleId(id); // 다른 제목 클릭하면 펼치기
    }
  };

  // 상태 변환 함수
  const getStatusInKorean = (status: string) => {
    switch (status) {
      case "PENDING":
        return "승인 대기";
      case "APPROVED":
        return "승인 완료";
      case "REJECTED":
        return "승인 거부";
      default:
        return status;
    }
  };

  // 상태 배경색 설정 함수
  const getStatusColor = (status: string) => {
    switch (status) {
      case "REJECTED":
      case "승인 거부":
        return "text-[#C75C5C]";
      case "APPROVED":
      case "승인 완료":
        return "text-[#4CAF50]";
      case "PENDING":
      case "승인 대기":
        return "text-[#A39C9C]";
      default:
        return "";
    }
  };

  // 제목 생략 함수 - 반응형으로 수정
  const truncateTitle = (title: string) => {
    const limit = isMobile ? 7 : 10;
    return title.length > limit ? title.slice(0, limit) + "..." : title;
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return dateString ? dateString.substring(2, 10) : "";
  };

  // 데이터 로드 함수
  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAllBookApplications();
      setRequests(data || []);
    } catch (err) {
      console.error("신청 내역 불러오기 실패:", err);
      setError("신청 내역을 불러오는데 실패했습니다.");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 책 등록 핸들러
  const handleRegisterBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gutenbergId || isNaN(Number(gutenbergId))) {
      setRegistrationMessage({
        type: "error",
        text: "유효한 구텐베르크 ID를 입력해주세요.",
      });
      return;
    }

    try {
      setIsRegistering(true);
      setRegistrationMessage(null);

      await registerBook(Number(gutenbergId));

      setRegistrationMessage({
        type: "success",
        text: "책이 성공적으로 등록되었습니다.",
      });
      setGutenbergId("");

      // 선택적: 일정 시간 후 메시지 제거
      setTimeout(() => setRegistrationMessage(null), 5000);
    } catch (error) {
      console.error("책 등록 실패:", error);
      setRegistrationMessage({
        type: "error",
        text: "책 등록에 실패했습니다. 올바른 ID인지 확인해주세요.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // 권한 체크 및 데이터 로드
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        setIsCheckingAuth(true);

        // 사용자 정보 가져오기 (새로고침 시에도 정보 유지)
        const userInfo = await fetchUserProfile();

        // Redux 상태 업데이트
        if (userInfo) {
          dispatch(
            setUserData({
              id: userInfo.id,
              email: userInfo.email,
              username: userInfo.username,
              profileImage: userInfo.profileImage,
              role: userInfo.role,
              score: userInfo.score,
              introduction: userInfo.introduction,
            })
          );

          // 관리자 권한 확인
          if (userInfo.role !== "ADMIN") {
            alert("관리자만 접근할 수 있는 페이지입니다.");
            navigate("/home");
            return;
          }

          // 권한 확인 후 데이터 로드
          await loadApplications();
        } else {
          // 사용자 정보가 없는 경우
          alert("로그인이 필요합니다.");
          navigate("/login");
        }
      } catch (err) {
        console.error("권한 확인 실패:", err);
        alert("권한을 확인할 수 없습니다. 다시 로그인해주세요.");
        navigate("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate, dispatch]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedTitleId(null); // 페이지 변경 시 확장된 제목 초기화
  };

  // 모달 열기 핸들러
  const handleOpenReasonModal = (request: BookApplication) => {
    setSelectedRequest(request);
    setIsReasonModalOpen(true);
  };

  // 거부 사유 모달 열기
  const handleOpenRejectModal = (request: BookApplication) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setIsRejectReasonModalOpen(true);
  };

  // 승인 처리 핸들러
  const handleApprove = async (id: number) => {
    if (window.confirm("이 신청을 승인하시겠습니까?")) {
      try {
        const response = await approveBookApplication(id);
        // 데이터 갱신
        setRequests(
          requests.map((req) =>
            req.id === id
              ? {
                  ...req,
                  status: response.status,
                  rejectionReason: null,
                }
              : req
          )
        );
        alert("신청이 승인되었습니다.");
      } catch (error) {
        console.error("신청 승인 실패:", error);
        alert("신청 승인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 거부 처리 핸들러
  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      alert("거부 사유를 입력해주세요.");
      return;
    }

    try {
      const response = await rejectBookApplication(
        selectedRequest.id,
        rejectionReason
      );
      // 데이터 갱신
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status: response.status,
                rejectionReason: response.rejectionReason,
              }
            : req
        )
      );
      setIsRejectReasonModalOpen(false);
      alert("신청이 거부되었습니다.");
    } catch (error) {
      console.error("신청 거부 실패:", error);
      alert("신청 거부에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 삭제 기능
  const handleDelete = async (id: number) => {
    if (window.confirm("정말 이 신청을 삭제하시겠습니까?")) {
      try {
        await AdminDeleteBookApplication(id);
        setRequests(requests.filter((request) => request.id !== id));

        // 삭제 후 현재 페이지에 아이템이 없으면 이전 페이지로
        const newTotal = requests.length - 1;
        const newTotalPages = Math.ceil(newTotal / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        alert("신청이 삭제되었습니다.");
      } catch (error) {
        console.error("신청 삭제 실패:", error);
        alert("신청 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 권한 확인 중이거나 데이터 로딩 중
  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFAF0] text-black px-4 pt-14 pb-24 md:pt-12 md:px-6">
        <div className="pl-0 pt-4 mb-6">
          <h1 className="text-3xl">신청리스트 관리</h1>
          <p className="text-xl text-[#A39C9C] pb-2">
            사용자들의 고전 신청 내역을 관리할 수 있어요
          </p>
        </div>
        <div className="w-full max-w-[37.5rem] mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center h-[25.1rem]">
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
          <p className="text-xl text-[#A39C9C] pb-2">
            사용자들의 고전 신청 내역을 관리할 수 있어요
          </p>
        </div>
        <div className="w-full max-w-[37.5rem] mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center h-[25.1rem]">
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
        <p className="text-xl text-[#A39C9C] pb-2">
          사용자들의 고전 신청 내역을 관리할 수 있어요
        </p>
      </div>

      <div className="w-full max-w-[37.5rem] mx-auto">
        {/* 책 등록 섹션 추가 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">책 등록하기</h2>
            <a
              href="https://www.gutenberg.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#C75C5C] hover:underline"
            >
              구텐베르크로 이동 <ExternalLink className="ml-1" size={18} />
            </a>
          </div>

          <form onSubmit={handleRegisterBook} className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={gutenbergId}
                onChange={(e) => setGutenbergId(e.target.value)}
                placeholder="구텐베르크 책 ID를 입력해주세요"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#C75C5C]"
              />
            </div>
            <button
              type="submit"
              disabled={isRegistering}
              className="px-6 py-3 bg-[#C75C5C] text-white rounded-lg hover:bg-[#B04A4A] transition-colors disabled:opacity-50"
            >
              {isRegistering ? "등록 중..." : "등록하기"}
            </button>
          </form>

          {registrationMessage && (
            <div
              className={`mt-2 p-2 text-sm rounded ${
                registrationMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {registrationMessage.text}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            구텐베르크 주소 끝 숫자가 책 ID예요.
            <br />
            예: .../ebooks/1342 → ID는 1342
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm pb-4 h-[25.1rem] overflow-y-auto">
          {/* 테이블 헤더 */}
          <div className="flex border-b border-black py-2 text-center mx-2">
            <div className="w-1/12"></div>
            <div className="w-1/4">책제목</div>
            <div className="w-1/6">신청일</div>
            <div className="w-1/6">상태</div>
            <div className="w-1/3">사유</div>
          </div>

          {/* 테이블 내용 */}
          {currentRequests.length > 0 ? (
            currentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center text-center border-b border-gray-200 py-3 mx-2"
              >
                {/* 삭제 버튼 */}
                <div className="w-1/12">
                  <Trash2
                    onClick={() => handleDelete(request.id)}
                    className="h-5 text-gray-400 hover:text-[#C75C5C] transition-colors duration-500 cursor-pointer mx-auto"
                  />
                </div>
                <div className="w-1/4">
                  <div
                    className="cursor-pointer hover:text-[#C75C5C] transition-colors"
                    onClick={() => handleTitleClick(request.id)}
                    title={request.title}
                  >
                    {expandedTitleId === request.id
                      ? request.title
                      : truncateTitle(request.title)}
                    {expandedTitleId === request.id &&
                      request.title.length > (isMobile ? 7 : 10) && (
                        <span className="text-xs text-gray-500 block">
                          (접기)
                        </span>
                      )}
                  </div>
                </div>
                <div className="w-1/6">{formatDate(request.appliedDate)}</div>
                <span className={`${getStatusColor(request.status)} w-1/6`}>
                  {getStatusInKorean(request.status)}
                </span>
                <div className="w-1/3">
                  {request.status === "PENDING" && (
                    <div className="flex justify-center space-x-2">
                      <button
                        className="px-3 py-1 text-xs text-[#4CAF50] border border-[#4CAF50] rounded hover:bg-gray-50 transition-colors"
                        onClick={() => handleApprove(request.id)}
                      >
                        수락
                      </button>
                      <button
                        className="px-3 py-1 text-xs text-[#C75C5C] border border-[#C75C5C] rounded hover:bg-gray-50 transition-colors"
                        onClick={() => handleOpenRejectModal(request)}
                      >
                        거부
                      </button>
                    </div>
                  )}
                  {request.status === "REJECTED" && (
                    <button
                      className="px-2 py-1 text-xs bg-[#C75C5C] text-white rounded hover:bg-[#B04A4A] transition-colors"
                      onClick={() => handleOpenReasonModal(request)}
                    >
                      보기
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
            </div>
            <button
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* 배경 딤처리 - 클릭 시 모달 닫기 */}
          <div
            className="absolute inset-0"
            onClick={() => setIsRejectReasonModalOpen(false)}
          />

          {/* 모달 본문 */}
          <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg z-10 max-h-[90vh] overflow-y-auto">
            {/* 헤더: 책 제목 및 닫기 버튼 */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium">거부 사유 입력</h2>
                <p className="text-sm text-gray-500">
                  책: {selectedRequest.title}
                </p>
              </div>
              <button
                onClick={() => setIsRejectReasonModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* 거부 사유 입력 영역 */}
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="거부 사유를 입력하세요"
              className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 h-32 resize-none focus:outline-none focus:border-[#C75C5C] mb-4"
            />

            {/* 버튼 영역 */}
            <div className="flex justify-center">
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-[#C75C5C] text-white rounded-lg hover:bg-[#B04A4A] transition-colors"
              >
                거부
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMain;
