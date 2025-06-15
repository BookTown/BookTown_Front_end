import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { fetchLikedBooks } from '../redux/slices/likeSlice';

export const useFetchLikedBooks = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('토큰 존재: 좋아요 목록 불러오기 시도');
      dispatch(fetchLikedBooks())
        .then((result) => {
          if (fetchLikedBooks.fulfilled.match(result)) {
            console.log('좋아요 목록 로드 성공:', result.payload);
          } else {
            console.error('좋아요 목록 로드 실패:', result.payload);
          }
        })
        .catch(error => {
          console.error('좋아요 목록 요청 오류:', error);
        });
    }
  }, [dispatch]);
};