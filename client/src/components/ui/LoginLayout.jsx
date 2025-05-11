import LoginNavBar from "./LoginNavBar";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const LoginLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <LoginNavBar />
      <div className="flex">
        <div className="fixed left-0 top-[4rem] h-[calc(100vh-4rem)] w-64">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
