import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex border border-black w-full">
      <Outlet/>
    </div>
  );
}

export default App;
