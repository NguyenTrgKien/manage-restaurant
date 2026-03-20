import SidebarAdmin from "./components/SidebarAdmin";
import HeaderAdmin from "./components/HeaderAdmin";
import { Outlet } from "react-router";

function Manage() {
  return (
    <div className="w-full h-[100vh] flex items-start text-gray-600">
      <SidebarAdmin />
      <div className="flex-1 h-full pt-[6rem] md:pl-[25rem]">
        <HeaderAdmin />
        <div className="p-[2rem] bg-gray-100 w-full min-h-[calc(100vh-6rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Manage;
