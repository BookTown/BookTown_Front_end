import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex justify-center">
      <Outlet/>
    </div>
  );
}

export default App;
