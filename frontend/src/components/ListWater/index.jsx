import { faArrowRightLong, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { FoodContext } from "../../contexts/FoodContext";
import WarnLogin from "../WarnLogin";
import ShowCartRight from "../ShowCartRight";
import ShowAddCart from "../ShowAddCart";
import { useNavigate } from "react-router";

function ListWater({ login }) {
  const navigate = useNavigate();
  const [dataWaterOutstanding, setDataWaterOutstanding] = useState([]);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDetailFood, setShowDetailFood] = useState(null);
  const [isShowAddCart, setIsShowAddCart] = useState({
    isShow: false,
    product: "",
  });
  const { cart, getCartUser } = useContext(FoodContext);

  useEffect(() => {
    const getDataFood = async () => {
      try {
        const response = await getFoodOutstanding();
        if (response.errCode === 0) {
          const data =
            response.message.filter(
              (it) => it.categoryId === 5 || it.categoryId === 2,
            ) || [];
          setDataWaterOutstanding(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDataFood();
  }, []);

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
          if (type === "waterTitle") {
            entry.target.classList.add("translate-y-[0]", "opacity-[1]");
            entry.target.classList.remove("translate-y-[15rem]", "opacity-0");
          } else if (type === "imgWellLeft") {
            entry.target.classList.add(
              "translate-x-[0rem]",
              "scale-[1]",
              "opacity-[1]",
            );
            entry.target.classList.remove(
              "translate-x-[-10rem]",
              "scale-[.4]",
              "opacity-0",
            );
          } else if (type === "imgWellRight") {
            entry.target.classList.add(
              "translate-x-[0]",
              "scale-[1]",
              "opacity-[1]",
            );
            entry.target.classList.remove(
              "translate-x-[8rem]",
              "scale-[.4]",
              "opacity-0",
            );
          }
        }
      });
    }, options);
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((element) => {
      observer.observe(element);
    });
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
        setQuantityProduct(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto px-[2rem] md:px-[5rem] lg:px-[10rem] py-[6rem]">
      <h2
        data-animate="waterTitle"
        className="text-center text-[2.5rem] md:text-[3rem] xl:text-[4rem] font-bold text-green-800 translate-y-[15rem] opacity-0 animationAll"
      >
        Thưởng Thức Nước Uống Tươi Mát - Đậm Vị
      </h2>
      <p
        data-animate="waterTitle"
        className="text-[1.8rem] text-center text-gray-600 md:text-[1.5rem] xl:text-[1.8rem] lg:w-[60%] mx-auto mt-[1rem] translate-y-[15rem] opacity-0 animationAll"
      >
        Khám phá thới giới đồ uống tuyệt vời, mang đến hương vị hoàn hảo cho mỗi
        khoảnh khắc thưởng thức
      </p>
      <div
        data-animate="waterTitle"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-[2rem] md:mt-[4rem] translate-y-[15rem] opacity-0 animationAll"
      >
        {dataWaterOutstanding.length > 0 &&
          dataWaterOutstanding.map((item) => {
            return (
              <div
                key={item.id}
                className="w-full h-[48rem] flex flex-col px-[2rem] py-[3rem] rounded-[8rem] group hover:shadow-xl hover:shadow-[#72d2ff] hv-linear cursor-pointer"
                onClick={() => {
                  navigate(`/detail-food`, {
                    state: {
                      food: item,
                      redirect: "/",
                    },
                  });
                }}
              >
                <div className="w-full h-[25rem] flex justify-center items-center">
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt=""
                    className="w-[20rem] h-[20rem] group-hover:scale-[1.15] hv-linear shadowImg"
                  />
                </div>
                <h3 className="text-[2.4rem] text-green-800 font-semibold maxlineOne text-center mt-[.5rem]">
                  {item.dishName}
                </h3>
                <p className="text-center text-gray-600 maxlineThree mb-[1rem]">
                  {item.description}
                </p>
                <div className="w-full h-[8rem] text-center mt-auto">
                  <div className=" mt-[1rem]">
                    <span>Giá: </span>
                    <span className="text-[red]">{item.price}đ</span>
                  </div>
                  {cart.length > 0 ? (
                    cart.some((it) => it.foodId === item.id) ? (
                      <div className="flex justify-center mt-[.5rem]">
                        <button
                          className="w-[24rem] h-[4.4rem] flex items-center justify-center gap-[.5rem] hover:scale-[1.05] transition-all duration-[.3s] rounded-[5rem] bg-[#d7d7d7] text-[#00ac22]  cursor-pointer"
                          onClick={() => setShowCart(true)}
                        >
                          Kiểm tra giỏ hàng
                          <FontAwesomeIcon
                            icon={faArrowRightLong}
                            className="text-[#00ac22]"
                          />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center mt-[.5rem]">
                        <button
                          className="w-[22rem] lg:w-[18rem] xl:w-[22rem] h-[4.4rem] rounded-[5rem] linearItem2 text-[#fff] hv-linear cursor-pointer"
                          onClick={() => handleAddProductCart(item)}
                        >
                          Chọn món
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="lex justify-center mt-[.5rem]">
                      <button
                        className="w-[22rem] lg:w-[18rem] xl:w-[22rem] h-[4.4rem] rounded-[5rem] linearItem2 text-[#fff] hv-linear cursor-pointer"
                        onClick={() => handleAddProductCart(item)}
                      >
                        Chọn món
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {isShowAddCart?.isShow && (
        <ShowAddCart
          login={login}
          isShowAddCart={isShowAddCart}
          setIsShowAddCart={setIsShowAddCart}
          setShowCart={setShowCart}
        />
      )}
      {showWarnLogin && (
        <WarnLogin
          setShowWarnLogin={setShowWarnLogin}
          pathRedirect={"/category-dish"}
        />
      )}
      {<ShowCartRight showCart={showCart} setShowCart={setShowCart} />}
    </div>
  );
}

export default ListWater;
