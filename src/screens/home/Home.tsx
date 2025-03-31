import React from 'react'
import TopBar from '../../components/Topbar';
import Main from './Main';import Navbar from '../../components/Navbar';


const Home = () => {
  return (
    <div className="w-full max-w-[28rem] min-h-[100dvh] bg-[#FFFAF0] flex flex-col font-ongleaf">
      <TopBar />
      <Main />
      <Navbar />
    </div>
  )
}

export default Home;