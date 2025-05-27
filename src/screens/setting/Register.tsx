import DesktopBar from "../../components/DesktopBar";
import TopBar from "../../components/Topbar";
import Navbar from "../../components/Navbar";
import RegisterMain from "./RegisterMain";

const Register = () => {
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

      <RegisterMain />
    </>
  )
}

export default Register;