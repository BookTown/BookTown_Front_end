import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPopularBooks, fetchRecentBooks } from "../api/api";
import { useAppDispatch } from "../redux/hooks";
import { setPopularBooks, setRecentBooks } from "../redux/slices/bookSlice";

// 인기 도서 조회 
export const usePopularBooks = () => {
  const dispatch = useAppDispatch();

  const result = useQuery({
    queryKey: ["popularBooks"],
    queryFn: fetchPopularBooks,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선도 유지
  });

  console.log('usePopularBooks 훅 내부 - 상태:', { 
    isLoading: result.isLoading, 
    isError: result.isError, 
    data: result.data 
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

  console.log('useRecentBooks 훅 내부 - 상태:', { 
    isLoading: result.isLoading, 
    isError: result.isError, 
    data: result.data 
  });

  useEffect(() => {
    if (result.data) {
      console.log('최신 도서 데이터를 Redux에 저장:', result.data);
      dispatch(setRecentBooks(result.data));
    }
  }, [result.data, dispatch]);

  return result;
};
