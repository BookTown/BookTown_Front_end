import DesktopBar from "../../components/DesktopBar";
import Navbar from "../../components/Navbar";
import TopTitle from "../../components/TopTitle";
import CartoonMain from "./CartoonMain";

const Cartoon = () => {
  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className='md:hidden'>
        <TopTitle />
        <Navbar />
      </div>
      
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">
        <TopTitle />
        <DesktopBar />
      </div>

      <CartoonMain />
    </>
  )
}

export default Cartoon;