import TopBar from "../../components/Topbar";
import Navbar from "../../components/Navbar";
import HistoryMain from "./HistoryMain";
import DesktopBar from "../../components/DesktopBar";

const History= () => {
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

      <HistoryMain />
    </>
  )
}

export default History;