import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../hooks/useAuth";
import avatarDefault from "../../../assets/image/avataDefault.png";
import { sidebarList } from "./SidebarAdmin";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

function HeaderAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 left-0 md:left-[20rem] xl:left-[25rem] flex items-center md:justify-end justify-between h-[6rem] px-12 bg-white shadow-sm z-[100]">
      <button
        type="button"
        className="md:hidden block"
        onClick={() => setShowMenu(true)}
      >
        <FontAwesomeIcon
          icon={faBars}
          className="text-[1.8rem] text-gray-800"
        />
      </button>
      <div className="flex items-center gap-10">
        <FontAwesomeIcon icon={faBell} className="text-[2rem]" />
        <div
          ref={elementRef}
          className="relative w-[4rem] h-[4rem] rounded-full border cursor-pointer border-gray-300"
          onClick={() => setShowPopup(true)}
        >
          <img
            src={user?.avatar ?? avatarDefault}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
          {showPopup && (
            <div className="absolute z-[400] top-[calc(100%+1rem)] right-0 w-[15rem] h-auto p-6 space-y-6 bg-white shadow-xl rounded-xl">
              <div
                className="text-nowrap hover:cursor-pointer"
                onClick={() => setShowPopup(false)}
              >
                Tài khoản
              </div>
              <div
                className="text-nowrap text-red-500 hover:cursor-pointer"
                onClick={() => {
                  setShowPopup(false);
                  logout();
                }}
              >
                Đăng xuất
              </div>
            </div>
          )}
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
