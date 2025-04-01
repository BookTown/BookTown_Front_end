import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[28rem] min-h-[100dvh] bg-[#FFFAF0] flex flex-col font-ongleaf">
        <Outlet/>
      </div>
    </div>
  );
}

export default App;
