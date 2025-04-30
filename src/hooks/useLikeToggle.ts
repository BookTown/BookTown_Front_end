import { useAppDispatch } from "../redux/hooks";
import { toggleLike } from "../redux/slices/likeSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * 좋아요 토글 기능을 위한 커스텀 훅
 * Redux와 React Query를 연결하여 효율적인 상태 관리와 서버 동기화를 제공합니다
 */
export const useLikeToggle = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // 좋아요 토글 처리 함수 (메모이제이션 적용)
  const handleLikeToggle = useCallback(async (bookId: number) => {
    if (typeof bookId !== 'number' || isNaN(bookId)) {
      console.error('유효하지 않은 도서 ID:', bookId);
      return;
    }
    
    try {
      console.log(`🔄 좋아요 토글 처리 시작: id=${bookId}`);
      // 토글 액션 디스패치 (Redux 상태 업데이트)
      await dispatch(toggleLike(bookId)).unwrap();
      
      // UI 업데이트를 위해 비동기적으로 처리 (micro task)
      setTimeout(() => {
        // 좋아요 관련 쿼리 무효화 (이미 토글은 완료되었기에 백그라운드로 새로고침)
        queryClient.invalidateQueries({ 
          queryKey: ["likedBooks"],
          // 자동 refetch를 방지 (필요시에만 수동으로 refetch)
          refetchType: 'none'
        });
      }, 0);
    } catch (error) {
      console.error("좋아요 토글 처리 실패:", error);
    }
  }, [dispatch, queryClient]);

  return {
    toggleLike: handleLikeToggle
  };
};

export default useLikeToggle;