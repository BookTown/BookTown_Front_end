export interface IScene {
  pageNumber: number;    // 페이지 번호
  content: string;       // 장면 내용
  illustrationUrl: string; // 장면 이미지 URL 
  femaleAudioUrl: string; // 여성 음성 URL 
  maleAudioUrl: string; // 남성 음성 URL 
}

// 개별 도서 상세 정보
export interface IBookDetail {
  id: number;  // bookId 대신 API 응답에 맞게 id로 정의
  title: string;
  author: string;
  summaryUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  scenes: IScene[]; // IScene 배열로 구체적으로 타입 정의
  likeCount: number;
}

// 도서 목록 배열 (API 응답 형식에 맞춤)
export interface IBook {
  id: number;
  title: string;
  author: string;
  summaryUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  likeCount: number;
  bookSummary: null | any;
}

export type IBookList = IBook[];
// 도서 검색 결과
export interface IBookSearchResponse {
  bookId: number;
  title: string;
  author: string;
  summaryUrl: string;
  thumbnailUrl: string;
  likeCount: number;
}

export type IBookSearch = IBookSearchResponse[];

// 책 신청 관련 인터페이스
export interface BookApplication {
  id: number;
  title: string;
  status: string;
  appliedDate: string;
  rejectionReason: string | null;
}