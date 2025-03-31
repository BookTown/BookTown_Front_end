import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex justify-center w-full min-h-screen bg-white">
      <div className="w-full max-w-[28rem] min-h-[100dvh] border-x border-solid border-gray-300 bg-[#FFFAF0]">
        <Outlet/>
      </div>
    </div>
  );
}

export default App;
