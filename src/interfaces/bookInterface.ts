export interface IScene {
  id: number;           // 장면 ID
  bookSummary?: string; 
  pageNumber: number;   // 페이지 번호
  content: string;      // 장면 내용
  imageUrl?: string;    // 장면 이미지 URL (선택적)
}

// 개별 도서 상세 정보
export interface IBookDetail {
  bookId: number;
  title: string;
  author: string;
  summaryUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  scenes: IScene[]; // IScene 배열로 구체적으로 타입 정의
  likeCount: number;
}

// 도서 목록 배열 (API 응답 형식에 맞춤)
export type IBookList = IBookDetail[];
  
