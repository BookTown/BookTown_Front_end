import React from 'react'
import TopBar from '../../components/Topbar';
import Main from './Main';import Navbar from '../../components/Navbar';
import DesktopBar from '../../components/DesktopBar';


const Home = () => {
  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className='md:hidden'>
        <TopBar />
        <Main />
        <Navbar />
      </div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">
        <DesktopBar />
        <Main />
      </div>
    </>
  )
}

export default Home;