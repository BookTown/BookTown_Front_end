import TopTitle from "../../components/TopTitle";
import CartoonMain from "./CartoonMain";

const Cartoon = () => {
  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className='md:hidden'>
        <TopTitle />
      </div>
      
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">
        <TopTitle />
      </div>

      <CartoonMain />
    </>
  )
}

export default Cartoon;