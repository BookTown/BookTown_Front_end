import React from 'react'
import TopBar from '../../components/Topbar';

const Home = () => {
  return (
    <div className="w-full max-w-[28rem] min-h-[100dvh] border-x border-solid border-gray-300 bg-[#FFFAF0] flex flex-col font-ongleaf">
      <TopBar />
      <div>Home</div>
    </div>
  )
}

export default Home;