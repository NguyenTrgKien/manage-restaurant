import backface from "../../assets/image/backface.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import vegetable4 from "../../assets/image/vegetable4.png";
import vegetable3 from "../../assets/image/vegetable3.png";
import cherry from "../../assets/image/cherry.png";
import tomato from "../../assets/image/tomato.png";
import { useContext, useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { FoodContext } from "../../contexts/FoodContext";
import ShowCartRight from "../ShowCartRight";
import ShowAddCart from "../ShowAddCart";
import WarnLogin from "../WarnLogin";
import { useNavigate } from "react-router";

function SellWell({ login }) {
  const navigate = useNavigate();
  const [dataFoodOutstanding, setDataFoodOutstanding] = useState([]);
  const { cart, getCartUser } = useContext(FoodContext);
  const [showCart, setShowCart] = useState(false);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const [isShowAddCart, setIsShowAddCart] = useState({
    isShow: false,
    product: "",
  });
  const observerRef = useRef(null);
  const swiperRef = useRef(null); // Thêm ref cho Swiper

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
          if (type === "sellWellUp") {
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
        } else {
          if (type === "imgWellLeft") {
            entry.target.classList.remove(
              "translate-x-[0rem]",
              "scale-[1]",
              "opacity-[1]",
            );
            entry.target.classList.add(
              "translate-x-[-10rem]",
              "scale-[.4]",
              "opacity-0",
            );
          } else if (type === "imgWellRight") {
            entry.target.classList.remove(
              "translate-x-[0]",
              "scale-[1]",
              "opacity-[1]",
            );
            entry.target.classList.add(
              "translate-x-[8rem]",
              "scale-[.4]",
              "opacity-0",
            );
          }
        }
      });
    }, options);

    observerRef.current = observer;
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((element) => observer.observe(element));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const getDataFood = async () => {
      try {
        const response = await getFoodOutstanding();
        if (response.errCode === 0) {
          const data = response.message.filter((it) => it.categoryId === 1);
          setDataFoodOutstanding(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDataFood();
  }, []);

  // Cập nhật Swiper sau khi dữ liệu thay đổi
  useEffect(() => {
    if (swiperRef.current && dataFoodOutstanding.length > 0) {
      swiperRef.current.update(); // Cập nhật Swiper để áp dụng hiệu ứng 3D
    }
  }, [dataFoodOutstanding]);

  const handleAddProductCart = async (food) => {
    if (!login.id) {
      setShowWarnLogin(true);
      return;
    }
    try {
      const dataAdd = {
        foodId: food.id,
        userId: login.id,
        quantityOrder: 1,
      };
      const message = await addProductCart(dataAdd);
      if (message.errCode === 0) {
        getCartUser();
        setIsShowAddCart({
          isShow: true,
          product: food,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full h-auto px-[2rem] md:px-[5rem] lg:px-[10rem] py-[4rem] bg-[#ffffff00]">
      <div className="absolute top-[2rem] left-[14rem]">
        <img
          data-animate="imgWellLeft"
          src={vegetable3}
          className="hidden lg:block lg:w-[6rem] xl:w-[9rem] translate-x-[-10rem] opacity-0 scale-[.4] animationAll"
        />
      </div>
      <div className="absolute top-[8rem] left-[5rem]">
        <img
          data-animate="imgWellLeft"
          src={vegetable4}
          className="hidden lg:block lg:w-[6rem] xl:w-[9rem] rotate-[70deg] translate-x-[-10rem] opacity-0 scale-[.4] animationAll"
        />
      </div>
      <div className="absolute top-[2rem] right-[14rem] bg-[#fff0]">
        <img
          data-animate="imgWellRight"
          src={tomato}
          className="hidden lg:block lg:w-[6rem] xl:w-[9rem] translate-x-[8rem] scale-[.4] opacity-0 animationAll"
        />
      </div>
      <div className="absolute top-[10rem] right-[3rem] bg-[#fff0]">
        <img
          data-animate="imgWellRight"
          src={cherry}
          className="hidden lg:block lg:w-[6rem] xl:w-[9rem] rotate-[100deg] translate-x-[8rem] scale-[.4] opacity-0 animationAll"
        />
      </div>

      <h2
        data-animate="sellWellUp"
        className="text-center text-[2.5rem] md:text-[3rem] xl:text-[4rem] font-bold text-green-800 translate-y-[15rem] opacity-0 animationAll"
      >
        Thực Đơn Phổ Biến Của Nhà Hàng
      </h2>
      <p
        data-animate="sellWellUp"
        className="text-[1.4rem] md:text-[1.5rem] xl:text-[1.8rem] text-center lg:w-[66%] mx-auto translate-y-[15rem] opacity-0 text-gray-600 animationAll"
      >
        Những món ăn tinh túy nhất của chúng tôi - sự kết hợp hoàn hảo giữa nghệ
        thuật ẩm thực và hương vị độc đáo, sẵn sàng chinh phục vị giác của bạn
      </p>

      <div
        data-animate="sellWellUp"
        className="relative mt-[0rem] md:mt-[10rem] translate-y-[15rem] opacity-0 animationAll"
      >
        {dataFoodOutstanding.length > 0 && ( // Chỉ render Swiper khi có dữ liệu
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)} // Gán instance Swiper vào ref
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={3}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2.5,
            }}
            breakpoints={{
              968: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="min-h-[56rem] md:min-h-[63rem]"
          >
            {dataFoodOutstanding.map((item) => (
              <SwiperSlide
                key={item.id}
                className="mt-[6rem]"
                onClick={() =>
                  navigate("/detail-food", {
                    state: { food: item, redirect: "/" },
                  })
                }
              >
                <div className="select-none relative w-full h-[44rem] md:h-[46rem] group px-[2rem] shadow-2xl rounded-[8rem] shadow-[#c8c8c8] bg-[#fff] hv-linear pb-[1.5rem]">
                  <div className="absolute top-[-6rem] left-0 w-full h-[28rem] flex justify-center items-center bg-[transparent] hv-linear perspective-distant">
                    <div className="relative w-[20rem] h-[20rem] md:w-[25rem] md:h-[25rem] rounded-[50%] transform-3d group-hover:rotate-x-[45deg] group-hover:translate-y-[8rem] group-hover:translate-z-[10rem] transition-all duration-[.6s]">
                      <img
                        src={`http://localhost:3000/${item.image}`}
                        alt={item.dishName}
                        className="absolute w-full h-full object-cover shadow-2xl shadow-[#000] rounded-[50%] z-[10] backface-hidden translate-z-[10rem]"
                        loading="lazy"
                      />
                      <img
                        src={backface}
                        alt="backface"
                        className="absolute w-full h-full object-cover rounded-[50%] z-[1] translate-z-[10rem] group-hover:shadow-2xl group-hover:shadow-[#000] transition-all duration-[.6s]"
                      />
                    </div>
                  </div>
                  <div className="px-[2rem] pt-[17rem] md:pt-[21rem] w-full h-full flex flex-col">
                    <h3 className="text-center mt-[4rem] text-[2.8rem] text-primary-bold font-semibold maxlineOne">
                      {item.dishName}
                    </h3>
                    <p className="text-center text-gray-600 maxlineTwo mt-[1rem]">
                      {item.description}
                    </p>
                    <div className="w-full h-[8rem] text-center mt-auto">
                      <div>
                        <span>Giá: </span>
                        <span className="text-[red]">{item.price}đ</span>
                      </div>
                      {cart.length > 0 ? (
                        cart.some((it) => it.foodId === item.id) ? (
                          <div className="flex justify-center mt-[.5rem]">
                            <button
                              className="w-[24rem] h-[4.4rem] flex items-center justify-center gap-[.5rem] rounded-[5rem] bg-[#d7d7d7] text-[#00ac22] hover:scale-[1.05] transition-all duration-[.3s] cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCart(true);
                              }}
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
                              className="w-[24rem] h-[4.4rem] rounded-[5rem] linearItem2 text-[#fff] hv-linear cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddProductCart(item);
                              }}
                            >
                              Chọn món
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="flex justify-center mt-[.5rem]">
                          <button
                            className="w-[24rem] h-[4.4rem] rounded-[5rem] linearItem2 text-[#fff] hv-linear cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddProductCart(item);
                            }}
                          >
                            Chọn món
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      {isShowAddCart?.isShow && (
        <ShowAddCart
          login={login}
          isShowAddCart={isShowAddCart}
          setIsShowAddCart={setIsShowAddCart}
          setShowCart={setShowCart}
        />
      )}
      {<ShowCartRight showCart={showCart} setShowCart={setShowCart} />}
      {showWarnLogin && (
        <WarnLogin
          setShowWarnLogin={setShowWarnLogin}
          pathRedirect={"/category-dish"}
          info={"chọn món"}
        />
      )}
    </div>
  );
}

export default SellWell;
