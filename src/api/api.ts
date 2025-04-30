import axiosApi from "../axios";
import { IBookList, IScene } from "../interfaces/bookInterface";

// 인기 도서 조회 (좋아요 수 기준)
export const fetchPopularBooks = async (): Promise<IBookList> => {
  console.log('인기 도서 API 호출 시작');
  try {
    const response = await axiosApi.get<IBookList>('/book/popular');
    console.log('인기 도서 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('인기 도서 API 오류:', error);
    throw error;
  }
};

// 최신 도서 조회
export const fetchRecentBooks = async (): Promise<IBookList> => {
  console.log('최신 도서 API 호출 시작');
  try {
    const response = await axiosApi.get<IBookList>('/book/recent');
    console.log('최신 도서 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('최신 도서 API 오류:', error);
    throw error;
  }
};

// 배너용 랜덤 도서 조회
export const fetchBannerBook = async () => {
  console.log('배너 도서 API 호출 시작');
  try {
    const response = await axiosApi.get('/book/banner');
    console.log('배너 도서 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('배너 도서 API 오류:', error);
    throw error;
  }
};

// 전체 인기 도서 조회
export const fetchAllPopularBooks = async (): Promise<IBookList> => {
  try {
    const response = await axiosApi.get<IBookList>('/book/popular/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 전체 최신 도서 조회
export const fetchAllRecentBooks = async (): Promise<IBookList> => {
  try {
    const response = await axiosApi.get<IBookList>('/book/recent/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 줄거리 생성 요청 (큐에 작업 추가)
export const requestSummaryGeneration = async (bookId: number): Promise<void> => {
  console.log('줄거리 생성 요청 시작');
  try {
    await axiosApi.post('/summaries', { bookId });
    console.log('줄거리 생성 요청 성공');
  } catch (error) {
    console.error('줄거리 생성 요청 오류:', error);
    throw error;
  }
};

// 줄거리 조회 (폴링 방식)
export const checkSummaryStatus = async (bookId: number): Promise<IScene[] | null> => {
  console.log('줄거리 상태 확인 중');
  try {
    const response = await axiosApi.post<IScene[]>('/summaries/lookup', { bookId });
    if (response.data && response.data.length > 0) {
      console.log('줄거리 데이터 수신 완료');
      return response.data;
    }
    return null; // 아직 생성 중
  } catch (error) {
    console.error('줄거리 상태 확인 오류:', error);
    return null;
  }
};

// 도서 줄거리 조회 (비동기 + 폴링)
export const fetchBookSummary = async (bookId: string | undefined): Promise<IScene[]> => {
  console.log('도서 줄거리 API 호출 시작');
  try {
    if (!bookId) {
      throw new Error('도서 ID가 없습니다');
    }
    
    const bookIdNum = Number(bookId);
    
    // 1. 먼저 줄거리 생성 요청
    await requestSummaryGeneration(bookIdNum);
    
    // 2. 폴링으로 상태 확인 (최대 10회, 5초 간격)
    let summary: IScene[] | null = null;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!summary && attempts < maxAttempts) {
      // 첫번째 시도는 즉시, 이후 5초 대기
      if (attempts > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      summary = await checkSummaryStatus(bookIdNum);
      attempts++;
      
      if (summary) {
        console.log('줄거리 데이터 수신 완료:', { 
          sceneCount: summary.length,
          firstScene: summary[0]
        });
        return summary;
      } else {
        console.log(`줄거리 생성 대기 중... (${attempts}/${maxAttempts})`);
      }
    }
    
    throw new Error('줄거리 생성 시간이 초과되었습니다');
  } catch (error) {
    console.error('도서 줄거리 API 오류:', error);
    throw error;
  }
};

