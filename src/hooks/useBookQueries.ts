import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPopularBooks, fetchRecentBooks, fetchBannerBook, fetchAllPopularBooks, fetchAllRecentBooks, getLikedBooks } from "../api/api";
import { useAppDispatch } from "../redux/hooks";
import { setPopularBooks, setRecentBooks, setBannerBook } from "../redux/slices/bookSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../redux/hooks";
import { selectLikedBooks } from "../redux/slices/likeSlice";

// 인기 도서 조회 
export const usePopularBooks = () => {
  const dispatch = useAppDispatch();

  const result = useQuery({
    queryKey: ["popularBooks"],
    queryFn: fetchPopularBooks,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선도 유지
  });

  // 데이터가 변경될 때 Redux 상태 업데이트
  useEffect(() => {
    if (result.data) {
      console.log('인기 도서 데이터를 Redux에 저장:', result.data);
      dispatch(setPopularBooks(result.data));
    }
  }, [result.data, dispatch]);

  return result;
};

// 최신 도서 조회
export const useRecentBooks = () => {
  const dispatch = useAppDispatch();
  
  const result = useQuery({
    queryKey: ["recentBooks"],
    queryFn: fetchRecentBooks,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선도 유지
  });

  useEffect(() => {
    if (result.data) {
      console.log('최신 도서 데이터를 Redux에 저장:', result.data);
      dispatch(setRecentBooks(result.data));
    }
  }, [result.data, dispatch]);

  return result;
};

// 배너용 랜덤 도서 조회
export const useBannerBook = () => {
  const dispatch = useAppDispatch();
  
  const result = useQuery({
    queryKey: ["bannerBook"],
    queryFn: fetchBannerBook,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선도 유지
  });

  useEffect(() => {
    if (result.data) {
      console.log('배너 도서 데이터를 Redux에 저장:', result.data);
      dispatch(setBannerBook(result.data));
    }
  }, [result.data, dispatch]);

  return result;
};

// 전체 인기 도서 조회
export const useAllPopularBooks = () => {
  const result = useQuery({
    queryKey: ["allPopularBooks"],
    queryFn: fetchAllPopularBooks,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선도 유지
  });

  return result;
};

// 전체 최신 도서 조회
export const useAllRecentBooks = () => {
  const result = useQuery({
    queryKey: ["allRecentBooks"],
    queryFn: fetchAllRecentBooks,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선도 유지
  });

  return result;
};

// 좋아요한 도서 목록 조회
export const useLikedBooks = () => {
  const queryClient = useQueryClient();
  const likedBookIds = useAppSelector(selectLikedBooks);
  
  // React Query 설정
  const result = useQuery({
    queryKey: ["likedBooks"],
    queryFn: getLikedBooks,
    staleTime: 1 * 60 * 1000, // 1분 동안 데이터 신선도 유지
    refetchOnWindowFocus: false, // 창 포커스 시 자동 새로고침 방지
  });
  
  // likedBookIds가 변경될 때 자동으로 쿼리 무효화 (데이터 새로고침)
  useEffect(() => {
    console.log("좋아요 상태 변경 감지 - 자동으로 쿼리 무효화");
    queryClient.invalidateQueries({ queryKey: ["likedBooks"] });
  }, [likedBookIds, queryClient]);
  
  return result;
};