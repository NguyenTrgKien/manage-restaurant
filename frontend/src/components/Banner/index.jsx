import bannerItem from "../../assets/image/bannerItem.png";
import bannerItem2 from "../../assets/image/bannerItem2.png";
import { useContext, useEffect, useState } from "react";
import { FoodContext } from "../../contexts/FoodContext";
import WarnLogin from "../WarnLogin";
import ShowAddCart from "../ShowAddCart";
import ShowCartRight from "../ShowCartRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

function Banner({ login }) {
  const [dataFoodBanner, setDataFoodBanner] = useState([]);
  const [currentDishDisplay, setCurrentDishDisplay] = useState();
  const { cart, getCartUser } = useContext(FoodContext);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isShowAddCart, setIsShowAddCart] = useState({
    isShow: false,
    product: "",
  });
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const type = entry.target.dataset.animate;
        if (entry.isIntersecting) {
          if (type === "title-banner") {
            entry.target.classList.add("translate-x-[0]", "opacity-[1]");
            entry.target.classList.remove("translate-x-[-80%]", "opacity-0");
          } else if (type === "listDishBanner") {
            entry.target.classList.add("translate-y-[0]", "opacity-[1]");
            entry.target.classList.remove("translate-y-[15rem]", "opacity-0");
          } else if (type === "imgBanner") {
            setTimeout(() => {
              entry.target.classList.add(
                "translate-x-[0rem]",
                "translate-y-[0]",
                "scale-[1]",
                "opacity-[1]",
              );
              entry.target.classList.remove(
                "translate-x-[20rem]",
                "translate-y-[20rem]",
                "scale-[.5]",
                "opacity-0",
              );
            }, 300);
          } else if (type === "imgItemBanner") {
            entry.target.classList.add(
              "translate-x-[0rem]",
              "scale-[1]",
              "opacity-[1]",
            );
            entry.target.classList.remove(
              "translate-x-[15rem]",
              "scale-0",
              "opacity-0",
            );
          } else if (type === "bg-banner") {
            entry.target.classList.add(
              "translate-y-[0]",
              "opacity-[1]",
              "scale-[1]",
            );
            entry.target.classList.remove(
              "translate-y-[20rem]",
              "translate-x-[20rem]",
              "scale-[.6]",
              "opacity-0",
            );
          }
        }
      });
    }, options);
    const itemBanner = document.querySelectorAll("[data-animate]");
    itemBanner.forEach((element) => {
      observer.observe(element);
    });
  }, []);

  const foodBanner = async () => {
    try {
      const response = await getFoodBanner();
      if (response.errCode === 0) {
        setDataFoodBanner(response.message);
        setCurrentDishDisplay(response.message[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    foodBanner();
  }, []);

  const handleAddProductCart = async (food) => {
    try {
      if (!login.id) {
        setShowWarnLogin(true);
      }
      const dataAdd = {
        foodId: food.id,
        userId: login.id,
        quantityOrder: 1,
      };
      const message = await addProductCart(dataAdd);
      if (message.errCode === 0) {
        getCartUser();
        setIsShowAddCart((prev) => ({
          ...prev,
          isShow: true,
          product: food,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full md:h-[calc(100vh)] h-auto pt-[6.8rem]  flex bg-[#ffffff00] overflow-hidden">
      <div className="xl:w-[45%] lg:w-[50%] md:w-[60%] w-full pr-[2rem] md:pr-0 md:pl-[5rem] lg:pr-0 h-auto md:pb-0 pb-[4rem] pl-[2rem] lg:pl-[10rem] md:pt-[5rem] pt-[4rem] md:bg-transparent linearItemMobile">
        <div
          data-animate="title-banner"
          className="translate-x-[-80%] opacity-0 animationAll"
        >
          <h2 className="title-banner text-center md:text-start text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] font-bold text-white md:text-green-800 lg:text-green-800 fontTitle">
            Chào Mừng Đến Với DiliFood
          </h2>
          <div className="">
            <p className="title-banner text-center md:text-start md:text-[1.8rem] mt-[2rem] text-white md:text-gray-600 lg:block">
              Nhà hàng 5 sao với thực đơn đa dạng và không gian rộng rãi
            </p>
            <p className="title-banner text-center hidden md:text-start md:text-[1.8rem] mt-[1rem] text-gray-600 lg:hidden xl:block">
              Tận hưởng những món ăn tuyệt hảo tại DeliFood
            </p>
            <p className="title-banner text-center md:text-start md:text-[1.8rem] mt-[1rem] text-white md:text-gray-600 lg:block xl:block">
              Đặt món ngay và tận hưởng những bữa ăn ngon miệng cùng bạn bè &
              gia đình!
            </p>
          </div>
        </div>
        <div
          data-animate="listDishBanner"
          className="bannerAnimation w-full h-auto mt-[4rem] grid grid-cols-3 md:gap-[2rem] gap-[1rem] items-center translate-y-[15rem] opacity-0 animationAll"
        >
          {dataFoodBanner.map((item) => {
            if (item.index > 3) return;
            return (
              <div
                key={item.id}
                className={`relative w-full h-auto md:h-[20rem] flex flex-col rounded-[2rem] cursor-pointer ${currentDishDisplay && item.id === currentDishDisplay.id ? "md:shadow-xl md:shadow-[#aa5200] " : ""} md:px-[1rem] px-[.5rem] pb-[1.5rem] group hv-linear linearItem2 md:shadow-none shadow-xl shadow-[#aa5200]`}
                onClick={() => {
                  setCurrentDishDisplay(item);
                }}
              >
                <div className="absolute left-0 top-[-2rem] w-full h-[10rem] flex justify-center items-center">
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt="img"
                    className="xl:w-[9rem] xl:h-[9rem] md:w-[7.5rem] md:h-[7.5rem] w-[8rem] h-[8rem] shadow-2xl group-hover:scale-[1.1] hv-linear rounded-[50%] shadow-[#000]"
                  />
                </div>
                <div className="pt-[8.4rem] text-center mt-auto">
                  <span className="block text-center font-bold text-[#fff] maxlineOne">
                    {item.dishName}
                  </span>
                  <div className="w-full flex pt-[2rem] justify-center">
                    <button className=" text-[1.2rem] text-[#fff] ">
                      {item.price}đ
                    </button>
                  </div>
                  {cart.length > 0 &&
                  cart.find((it) => it.foodId === item.id) ? (
                    <button
                      className="md:w-[75%] w-[85%] h-[3rem] mx-auto flex items-center justify-center gap-[.4rem] text-[1.2rem] mt-[.5rem] rounded-[5rem] bg-[#fff] hover:bg-green-600 hover:text-[#fff] transition-all duration-[.3s] cursor-pointer text-green-600"
                      onClick={() => {
                        setShowCart(true);
                      }}
                    >
                      Xem giỏ hàng
                      <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                  ) : (
                    <button
                      className="md:w-[75%] w-[85%] h-[3rem] text-[1.2rem] mt-[.5rem] rounded-[5rem] bg-[#fff] hover:bg-[#FF5733] hover:text-[#fff] transition-all duration-[.3s] cursor-pointer text-[#FF5733]"
                      onClick={() => handleAddProductCart(item)}
                    >
                      Chọn món
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative xl:w-[55%] lg:w-[50%] md:w-[40%] md:block xl:block 2xl:block sm:hidden lg:block h-full">
        <div
          data-animate="bg-banner"
          className="absolute w-full h-full banner-clippath linearItem2 translate-y-[20rem] translate-x-[20rem] scale-[.6] opacity-0 animationAll"
        >
          <img
            data-animate="imgItemBanner"
            src={bannerItem}
            alt=""
            className="sm:hidden lg:hidden xl:block absolute w-[10rem] h-[10rem] top-[26rem] right-[10rem] z-[50] translate-x-[15rem] opacity-0 scale-0 animationAll"
          />
          <img
            data-animate="imgItemBanner"
            src={bannerItem2}
            alt=""
            className="absolute w-[10rem] h-[10rem] bottom-[2rem] left-[40rem] z-[50] translate-x-[15rem] opacity-0 scale-0 animationAll"
          />
        </div>
        {/* <div className='absolute lg:left-[10rem] top-[50%]  translate-y-[-50%] sm:w-[25rem] md:h-[25rem] lg:w-[30rem] lg:h-[30rem] xl:w-[40rem] xl:h-[40rem] z-50'>
                    <img data-animate="imgBanner" src={`http://localhost:3000/${currentDishDisplay && currentDishDisplay.image || dataFoodBanner.length > 0 && dataFoodBanner[0].image}`} alt="img" className='rounded-[50%] w-full h-full shadow-2xl shadow-[#000] hover:scale-[1.1] hover:rotate-[20deg] translate-x-[20rem] translate-y-[20rem] opacity-0 scale-[.5] animationAll'/>
                </div> */}
        <div className="absolute lg:left-[10rem] top-[50%]  translate-y-[-50%] sm:w-[25rem] md:h-[25rem] lg:w-[30rem] lg:h-[30rem] xl:w-[40rem] xl:h-[40rem] z-50">
          <div
            data-animate="imgBanner"
            className="w-[40rem] h-[40rem] translate-x-[20rem] translate-y-[20rem] opacity-0 scale-[.5] animationAll hover:scale-[1.1]"
          >
            <img
              src={`http://localhost:3000/${(currentDishDisplay && currentDishDisplay.image) || (dataFoodBanner.length > 0 && dataFoodBanner[0].image)}`}
              alt="img"
              className="rounded-[50%] w-full h-full shadow-2xl shadow-[#000] infiniteImgBanner"
            />
          </div>
        </div>
      </div>
      {showWarnLogin && (
        <WarnLogin
          setShowWarnLogin={setShowWarnLogin}
          pathRedirect={"/"}
          info={"chọn món"}
        />
      )}

      {isShowAddCart?.isShow && (
        <ShowAddCart
          login={login}
          isShowAddCart={isShowAddCart}
          setIsShowAddCart={setIsShowAddCart}
          setShowCart={setShowCart}
        />
      )}

      {<ShowCartRight showCart={showCart} setShowCart={setShowCart} />}
    </div>
  );
}

export default Banner;
