import React, { useEffect } from 'react'
import TopBar from '../../components/Topbar';
import Main from './Main';
import Navbar from '../../components/Navbar';
import DesktopBar from '../../components/DesktopBar';
import { useAppDispatch } from '../../redux/hooks';
import { fetchLikedBooks } from '../../redux/slices/likeSlice';

const Home = () => {
  const dispatch = useAppDispatch();

  // 컴포넌트 마운트 시 좋아요 목록 불러오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchLikedBooks());
    }
  }, [dispatch]);

  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className='md:hidden'>
        <TopBar />
        <Navbar />
      </div>
      
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">
        <DesktopBar />
      </div>

      <Main />
    </>
  )
}

export default Home;