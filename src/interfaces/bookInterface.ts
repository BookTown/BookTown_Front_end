// 개별 도서 상세 정보
interface IBookDetail {
  bookId: number;
  title: string;
  author: string;
  summaryUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  scenes: any[]; // 필요에 따라 타입을 더 구체적으로 정의할 수 있습니다
  likeCount: number;
}

// 도서 목록 배열 (API 응답 형식에 맞춤)
export type IBookList = IBookDetail[];
  
