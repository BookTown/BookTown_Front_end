import TopBar from "../../components/Topbar";
import Navbar from "../../components/Navbar";
import LikedBooksMain from "./LikedBooksMain";
import DesktopBar from "../../components/DesktopBar";

const LikedBooks = () => {
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

      <LikedBooksMain/>
    </>
  )
}

export default LikedBooks;