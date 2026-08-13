import Navbar from "@/Pages/Shared/Navbar";
import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-313px)] bg-[#eef0f1]">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
