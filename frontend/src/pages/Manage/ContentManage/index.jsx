import MainDish from "../MainDish";
import Staff from "./Staff";
import Table from "./Table";
import Order from "./Order";
import DashBoard from "./DashBoard";
import { useEffect, useState } from "react";
import ProfileUser from "../../customer/ProfileUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import ShowMenuHeader from "../../../components/ShowMenuHeader";
import OrderTable from "./OrderTable";
import Combo from "./Combo";
import { useAuth } from "../../../hooks/useAuth";

function ContentManage({ content, setCurrentMenu, currentListCategory }) {
  const { user } = useAuth();
  const [showSetting, setShowSetting] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [isLogout, setIsLogout] = useState(false);
  const [showMenuMobile, setShowMenuMobile] = useState(false);

  const handleShowSetting = (event) => {
    event.preventDefault();
    setShowSetting((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (!event.target.closest(".user-menu")) {
        setShowSetting(false);
      }
    };
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const handleLogOut = async () => {
    try {
      const message = await userLogout();
      if (message.errCode === 0) {
        setIsLogout(true);
        window.location.reload();
        setTimeout(() => {
          setIsLogout(false);
        }, 600);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const titleMap = {
    DashBoard: "DashBoard",
    Dish: "Món Ăn",
    Staff: "Nhân Viên",
    Table: "Bàn",
    Order: "Đơn Hàng",
    OrderDish: "Đơn Đặt Hàng",
    OrderTable: "Đơn Đặt Bàn",
    OrderCombo: "Combo Đặt bàn Và Món",
  };

  return (
    <div className="w-full lg:w-[80%] h-auto bg-[#ffffff] overflow-hidden md:ml-[10rem] lg:ml-[20%]">
      <header className="w-full md:w-[calc(100%-10rem)] lg:w-[80%] fixed top-0 right-0 z-[100] h-[7.2rem] flex items-center bg-[#fff] shadow-2xl shadow-[#dddddd] px-[2rem] md:px-[5rem]">
        <div className="sm:hidden" onClick={() => setShowMenuMobile(true)}>
          <FontAwesomeIcon icon={faBars} className="text-[2.2rem]" />
        </div>
        <h3 className="pl-[1.5rem] md:pl-0 text-[2rem] md:text-[2.4rem] text-green-800 font-bold">
          {content === "DashBoard"
            ? "DashBoard"
            : `Quản lý ${titleMap[content]}`}
        </h3>
        <div
          className="user-menu relative ml-auto flex items-center cursor-pointer gap-[1rem]"
          onClick={(e) => handleShowSetting(e)}
        >
          <span className="text-[1.8rem] select-none">
            {user &&
              user.fullName.split(" ")[user.fullName.split(" ").length - 1]}
          </span>
          {
            <img
              src={`http://localhost:3000/${user.image}`}
              className="w-[4.8rem] h-[4.8rem] rounded-[50%] object-cover"
            />
          }
          {showSetting && (
            <div className="absolute top-[calc(100%+1rem)] right-[-1rem] min-w-[12rem] min-h-[4rem] py-[1rem] shadowMenuAdmin bg-[#fff] rounded-[.5rem]">
              <span
                className="block hover:text-[red] hv-linear py-[1rem] px-[1.4rem]"
                onClick={() => setDetailUser(user)}
              >
                Cá nhân
              </span>
              <span
                className="block hover:text-[red] hv-linear py-[1rem] px-[1.4rem]"
                onClick={() => handleLogOut()}
              >
                Dăng xuất
              </span>
            </div>
          )}
        </div>
      </header>
      <div className="pt-[7.2rem]">
        {content === "Dish" && <MainDish titleAdd={currentListCategory} />}
        {content === "Staff" && <Staff titleAdd={currentListCategory} />}
        {content === "Table" && <Table titleAdd={currentListCategory} />}
        {content === "OrderDish" && <Order titleAdd={currentListCategory} />}
        {content === "OrderTable" && (
          <OrderTable titleAdd={currentListCategory} />
        )}
        {content === "OrderCombo" && <Combo titleAdd={currentListCategory} />}
        {content === "DashBoard" && (
          <DashBoard titleAdd={currentListCategory} />
        )}
      </div>
      {isLogout && (
        <div className="fixed flex justify-center items-center inset-0 z-[400] bg-[#50505052]">
          <div className="w-[40rem] h-auto py-[3rem] flex flex-col items-center gap-[1.5rem] bg-[#fff] rounded-[1rem] text-[2rem] font-bold">
            <FontAwesomeIcon
              icon={faCheck}
              className="p-[2rem] rounded-[50%] border-[.2rem] text-[#00be00] border-[#00be00]"
            />
            Đăng xuất thành công!
          </div>
        </div>
      )}
      {detailUser && <ProfileUser setDetailUser={setDetailUser} />}

      {showMenuMobile && (
        <ShowMenuHeader
          setShowMenuMobile={setShowMenuMobile}
          isMenu={"ADMIN"}
          setCurrentMenu={setCurrentMenu}
        />
      )}
    </div>
  );
}

export default ContentManage;
