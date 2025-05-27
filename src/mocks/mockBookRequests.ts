// 상태에 대한 타입 정의
export type RequestStatus = '승인 대기' | '승인 완료' | '승인 거부';

// 책 신청 항목에 대한 인터페이스
export interface BookRequest {
  id: number;
  status: RequestStatus;
  requestDate: string;
  title: string;
  rejectionReason: string | null;
}

// 목데이터
export const mockBookRequests: BookRequest[] = [
  {
    id: 1,
    status: '승인 대기',
    requestDate: '25.05.28',
    title: '어린 왕자',
    rejectionReason: null
  },
  {
    id: 2,
    status: '승인 완료',
    requestDate: '25.05.27',
    title: '로미오와 줄리엣',
    rejectionReason: null
  },
  {
    id: 3,
    status: '승인 거부',
    requestDate: '25.05.26',
    title: '나랑너랑놀아요',
    rejectionReason: '이미 등록된 도서입니다.'
  },
  {
    id: 4,
    status: '승인 대기',
    requestDate: '25.05.25',
    title: '데미안',
    rejectionReason: null
  },
  {
    id: 5,
    status: '승인 거부',
    requestDate: '25.05.24',
    title: '해리포터',
    rejectionReason: '저작권 문제로 등록이 불가합니다.'
  }
];

