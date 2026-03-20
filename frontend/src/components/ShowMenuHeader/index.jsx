import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avataDefault from "../../assets/image/avataDefault.png";
import { Link } from "react-router";

function ShowMenuHeader({
  setShowMenuMobile,
  login,
  isMenu,
  setCurrentMenu,
  urlAvatar,
}) {
  return (
    <div className="fixed inset-0 bg-[#6060607e] z-[950]">
      <div className="relative w-[90%] h-[100vh] bg-[#fff]">
        <FontAwesomeIcon
          icon={faXmark}
          className="absolute top-[1rem] right-[1rem] text-[2.2rem] text-[#767676]"
          onClick={() => setShowMenuMobile(false)}
        />
        {login.id ? (
          <div className="flex items-center gap-[1.5rem] p-[2rem] border-b-[.1rem] border-b-[#ccc]">
            <div className="w-[5rem] h-[5rem] rounded-full overflow-hidden border-[.1rem]">
              {urlAvatar ? (
                <img
                  src={urlAvatar}
                  alt="Avatar"
                  className="w-[4.8rem] h-[4.8rem] rounded-[50%] object-cover"
                />
              ) : (
                <img
                  src={
                    login?.image?.includes("uploads")
                      ? `http://localhost:3000/${login.image}`
                      : login.image === null
                        ? avataDefault
                        : login.image
                  }
                  alt="Avatar"
                  className="w-[4.8rem] h-[4.8rem] rounded-[50%] object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-[1.5rem] md:text-3xl font-semibold text-gray-800">
                Xin chào, {login.fullName}
              </h3>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-[1.5rem] p-[2rem] border-b-[.1rem] border-b-[#ccc]">
            <div className="w-[5rem] h-[5rem] rounded-full overflow-hidden border-[.1rem]">
              <img
                src={avataDefault}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-gray-800">
                Xin chào, User
              </h3>
            </div>
          </div>
        )}

        {isMenu === "ADMIN" ? (
          <div>
            <div
              className="block p-[2rem]"
              onClick={() => {
                setCurrentMenu("DashBoard");
                setShowMenuMobile(false);
              }}
            >
              DashBoard
            </div>
            <div
              className="block p-[2rem]"
              onClick={() => {
                setCurrentMenu("Dish");
                setShowMenuMobile(false);
              }}
            >
              Thực đơn
            </div>
            <div
              className="block p-[2rem]"
              onClick={() => {
                setCurrentMenu("Order");
                setShowMenuMobile(false);
              }}
            >
              Đơn hàng
            </div>
            <div
              className="p-[2rem]"
              onClick={() => {
                setCurrentMenu("User");
                setShowMenuMobile(false);
              }}
            >
              Khách hàng
            </div>
            <div
              className="p-[2rem]"
              onClick={() => {
                setCurrentMenu("Staff");
                setShowMenuMobile(false);
              }}
            >
              Nhân viên
            </div>
            <div
              className="p-[2rem]"
              onClick={() => {
                setCurrentMenu("Table");
                setShowMenuMobile(false);
              }}
            >
              Bàn
            </div>
          </div>
        ) : (
          <>
            <Link to={`/`} className="block p-[2rem]">
              Trang chủ
            </Link>
            <Link to={`/category-dish`} className="block p-[2rem]">
              Thực đơn
            </Link>
            <Link to={`/order-table`} className="block p-[2rem]">
              Đặt bàn
            </Link>
            <Link to={`/about`} className="block p-[2rem]">
              Giới thiệu
            </Link>
            <Link to={`/contact`} className="p-[2rem] block">
              Liên hệ
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowMenuHeader;
