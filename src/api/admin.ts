import axiosApi from '../axios';
import { BookApplication } from '../interfaces/bookInterface';

// 모든 도서 신청 목록 조회
export const fetchAllBookApplications = async (): Promise<BookApplication[]> => {
  try {
    const response = await axiosApi.get('/apply/all');
    console.log('모든 도서 신청 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('모든 도서 신청 목록 조회 실패:', error);
    throw error;
  }
};

// 신청 승인
export const approveBookApplication = async (id: number): Promise<BookApplication> => {
  try {
    const response = await axiosApi.patch(`/apply/${id}/approve`);
    console.log('도서 신청 승인 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('도서 신청 승인 실패:', error);
    throw error;
  }
};

// 신청 거부
export const rejectBookApplication = async (id: number, reason: string): Promise<BookApplication> => {
  try {
    const response = await axiosApi.patch(`/apply/${id}/reject`, { reason });
    console.log('도서 신청 거부 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('도서 신청 거부 실패:', error);
    throw error;
  }
};

// 관리자 책 신청 삭제 API
export const AdminDeleteBookApplication = async (id: number) => {
  console.log('책 신청 삭제 API 호출 시작:', id);
  try {
    const response = await axiosApi.delete(`/apply/admin/delete/${id}`);
    console.log('책 신청 삭제 API 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('책 신청 삭제 API 오류:', error);
    throw error;
  }
};