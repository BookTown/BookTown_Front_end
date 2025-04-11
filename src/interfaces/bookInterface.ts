// 장면 1개 정보
interface IScene {
    id: number;
    image: string;
    plotSummary: string;
    audioFile: string;
  }

// 책 1권의 상세 정보 + 장면 리스트
  export interface IBookDetail {
    id: number;
    isbnId: string;
    authorName: string;
    name: string;
    folderName: string;
    sceneList: IScene[];
  }
  
// 페이징된 도서 목록 정보 (여러 권)
  export interface IBook {
    totalElements: number;
    totalPages: number;
    size: number;
    content: IBookDetail[];
  
    number: number;
    sort: {
      empty: true;
      unsorted: true;
      sorted: true;
    };
    first: true;
    last: true;
    numberOfElements: number;
    pageable: {
      offset: number;
      sort: {
        empty: true;
        unsorted: true;
        sorted: true;
      };
      pageSize: number;
      paged: true;
      pageNumber: number;
      unpaged: true;
    };
    empty: true;
  }