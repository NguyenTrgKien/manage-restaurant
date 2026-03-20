import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { faBars, faCartPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avataDefault from "../../assets/image/avata.png";
import DiliFood from "../../assets/image/logo.png";
import { FoodContext } from "../../contexts/FoodContext";
import ShowCartRight from "../ShowCartRight";
import ProfileUser from "../../pages/customer/ProfileUser";
import ShowMenuHeader from "../ShowMenuHeader";

function Header({ login, setLogin, isShowCart, isBg }) {
  const navigate = useNavigate();
  const { cart, getCartUser } = useContext(FoodContext);
  const [isLogout, setIsLogout] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [bgHeader, setBgHeader] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("home");
  const location = useLocation(); // Nó lưu đường dẫn hiện tại
  const [urlAvatar, setUrlAvatar] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [showMenuMobile, setShowMenuMobile] = useState(false);

  const handleShowSetting = (event) => {
    event.preventDefault();
    setShowSetting((prev) => !prev);
  };
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setCurrentMenu("home");
    } else if (path === "/category-dish") {
      setCurrentMenu("category");
    } else if (path === "/order-table") {
      setCurrentMenu("order");
    } else if (path === "/about") {
      setCurrentMenu("intro");
    } else if (path === "/contact") {
      setCurrentMenu("contact");
    }
  }, []);

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

  useEffect(() => {
    let ticking = false; // Biến cờ để tránh cập nhật quá nhiều lần
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setBgHeader(window.scrollY > 100); // Đổi trạng thái khi cuộn
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogOut = async () => {
    try {
      const message = await userLogout();
      if (message.errCode === 0) {
        setLogin({});
        setIsLogout(true);
        getCartUser();
        window.location.reload();
        setTimeout(() => {
          setIsLogout(false);
        }, 600);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirectSeletedTable = (redirect, action) => {
    navigate(`/${redirect}`, {
      state: action,
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[6.8rem] z-[950] flex items-center ${isBg ? "bg-[#fff] shadow-xl" : bgHeader ? "bg-[#fff] shadow-xl" : "bg-[#fff0]"} px-[2rem] md:px-[5rem] lg:px-[10rem]`}
    >
      <div className="lg:w-[25%] w-[50%] flex items-center">
        <div
          className="mr-[1rem] lg:hidden"
          onClick={() => {
            setShowMenuMobile(true);
          }}
        >
          <FontAwesomeIcon icon={faBars} className="text-[2.2rem]" />
        </div>
        <Link to={`/`}>
          <img
            src={DiliFood}
            alt="logo"
            className="w-[12rem] h-[5rem] md:w-[15rem] md:h-[6rem] object-cover"
          />
        </Link>
      </div>
      <nav className="w-[50%] items-center justify-center gap-[4.5rem] hidden lg:flex">
        <Link
          to={"/"}
          className={`text-[1.8rem]  ${currentMenu === "home" ? "text-[#00ad00]" : "hover:text-[#00ad00]"} cursor-pointer select-none transition-colors`}
        >
          Trang chủ
        </Link>
        <Link
          to={`/category-dish`}
          className={`text-[1.8rem] ${currentMenu === "category" ? "text-[#00ad00]" : "hover:text-[#00ad00]"}  cursor-pointer select-none transition-colors`}
        >
          Thực đơn
        </Link>
        <div
          className={`text-[1.8rem] ${currentMenu === "order" ? "text-[#00ad00]" : "hover:text-[#00ad00]"} cursor-pointer select-none transition-colors`}
          onClick={() =>
            handleRedirectSeletedTable("order-table", "paymentTable")
          }
        >
          Đặt bàn
        </div>
        <Link
          to={`/about`}
          className={`text-[1.8rem] ${currentMenu === "intro" ? "text-[#00ad00]" : "hover:text-[#00ad00]"}  cursor-pointer select-none transition-colors`}
        >
          Giới thiệu
        </Link>
        <Link
          to={`/contact`}
          className={`text-[1.8rem] ${currentMenu === "contact" ? "text-[#00ad00]" : "hover:text-[#00ad00]"}  cursor-pointer select-none transition-colors`}
        >
          Liên hệ
        </Link>
      </nav>
      <div className="lg:w-[25%] w-[50%] flex gap-[2rem] md:gap-[3rem] items-center justify-end">
        <div
          className="md:w-[6rem] md:h-[4rem] flex justify-center items-center rounded-[.2rem] md:border-[.1rem] md:border-[#aa5200] cursor-pointer"
          onClick={() => setShowCart(true)}
        >
          <div className="relative ">
            {cart ? (
              <>
                {cart.length > 0 && (
                  <span className="absolute top-[-1rem] md:top-[-.5rem] right-[-1rem] w-[1.6rem] h-[1.6rem] flex justify-center items-center text-[#fff] text-[1rem] bg-[red] rounded-[50%]">
                    <span className="text-[1rem]">{cart.length}</span>
                  </span>
                )}
                <FontAwesomeIcon
                  icon={faCartPlus}
                  className="text-[2.2rem] md:text-[1.8rem] text-[#515151]"
                />
              </>
            ) : (
              <FontAwesomeIcon
                icon={faCartPlus}
                className="text-[2.2rem] md:text-[1.8rem] text-[#515151]"
              />
            )}
          </div>
        </div>
        {login?.id ? (
          <div
            className="user-menu relative flex items-center gap-[1rem] cursor-pointer "
            onClick={(e) => handleShowSetting(e)}
          >
            <span className="text-[1.8rem]">
              {`${login.fullName.split(" ")[login.fullName.split(" ").length - 1]}`}
            </span>
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

            {showSetting && (
              <div className="w-[20rem] absolute top-[calc(100%+1rem)] right-0 md:right-[-3.6rem] min-w-[12rem] min-h-[4rem] py-[1rem] shadowMenu bg-[#fff] rounded-[.5rem]">
                <span
                  className="block hover:text-[red] hv-linear py-[1rem] px-[1.4rem]"
                  onClick={() => setDetailUser(login)}
                >
                  Cá nhân
                </span>
                <span
                  className="block hover:text-[red] hv-linear py-[1rem] px-[1.4rem]"
                  onClick={() => handleLogOut()}
                >
                  Dăng xuất
                </span>
                <Link
                  to={`/info-user-order`}
                  className="block hover:text-[red] hv-linear py-[1rem] px-[1.4rem]"
                >
                  Lịch sử mua hàng
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link
            to={`/login`}
            className="w-[8rem] h-[4rem] flex items-center justify-center text-red-500 rounded-[.4rem] border border-red-500 hover:bg-red-500 hover:text-white transition-all duration-[.3s] select-none cursor-pointer"
          >
            Login
          </Link>
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

      {isShowCart && (
        <ShowCartRight
          showCart={showCart}
          setShowCart={setShowCart}
          cart={cart}
        />
      )}

      {detailUser && (
        <ProfileUser
          login={detailUser}
          setDetailUser={setDetailUser}
          setUrlAvatar={setUrlAvatar}
        />
      )}
      {showMenuMobile && (
        <ShowMenuHeader
          setShowMenuMobile={setShowMenuMobile}
          login={login}
          isMenu={"user"}
          urlAvatar={urlAvatar}
        />
      )}
    </header>
  );
}

export default Header;
