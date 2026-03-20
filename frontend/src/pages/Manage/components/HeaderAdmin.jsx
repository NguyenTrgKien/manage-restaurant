import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../hooks/useAuth";
import avatarDefault from "../../../assets/image/avataDefault.png";
import { sidebarList } from "./SidebarAdmin";
import { useNavigate } from "react-router";
import { useState } from "react";

function HeaderAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="fixed top-0 right-0 left-0 md:left-[25rem] flex items-center md:justify-end justify-between h-[6rem] px-12 bg-white shadow-sm z-[100]">
      <button type="button" onClick={() => setShowMenu(true)}>
        <FontAwesomeIcon
          icon={faBars}
          className="text-[1.8rem] text-gray-800"
        />
      </button>
      <div className="flex items-center gap-10">
        <FontAwesomeIcon icon={faBell} className="text-[2rem]" />
        <div className="w-[4rem] h-[4rem] rounded-full border cursor-pointer border-gray-300 overflow-hidden">
          <img
            src={user?.avatar ?? avatarDefault}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      {showMenu && (
        <div className="fixed z-[500] inset-0">
          <div
            className="absolute z-[500] inset-0 w-full h-full bg-[#3232326f]"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute z-[600] w-[80%] h-full bg-white">
            <div className="flex items-center gap-4 p-6 border-b border-b-gray-200">
              <img
                src={user?.avatar ?? avatarDefault}
                alt="avatar"
                className="w-[4rem] h-[4rem] border border-gray-300 rounded-full object-cover"
              />
              <div>
                <p className="text-[1.6rem] text-gray-800">{user.fullName}</p>
                <p className="text-[1.4rem]">{user.email}</p>
              </div>
            </div>
            {sidebarList.map((sidebar) => {
              return (
                <div
                  key={sidebar.id}
                  className="py-6 px-10 block"
                  onClick={() => {
                    navigate(sidebar.menuKey);
                    setShowMenu(false);
                  }}
                >
                  {sidebar.title}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderAdmin;
