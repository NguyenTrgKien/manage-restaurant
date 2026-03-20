import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import bgCategory from "../../../assets/image/snow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/Footer";
import { FoodContext } from "../../../contexts/FoodContext";
import WarnLogin from "../../../components/WarnLogin";
import ShowCartRight from "../../../components/ShowCartRight";
import ShowAddCart from "../../../components/ShowAddCart";
import { useNavigate } from "react-router";
import Loading from "../../../components/Loading";

function CategoryPage() {
  const [login, setLogin] = useState({});
  const navigate = useNavigate();
  const { cart, getCartUser } = useContext(FoodContext);
  const [category, setCategory] = useState([]);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [hiddenInfo, setHiddenInfo] = useState(false);
  const [showDetailFood, setShowDetailFood] = useState(null);
  const [valueSearch, setValueSearch] = useState("");
  const [quantityProductSold, setQuantityProductSold] = useState([]);
  const [isShowAddCart, setIsShowAddCart] = useState({
    isShow: false,
    product: "",
  });
  const [isShowInfo, setIsShowInfo] = useState({
    showId: "all",
    name: "Tất cả",
  });
  const [allFood, setAllFood] = useState([]);
  useEffect(() => {
    const isLogin = async () => {
      try {
        const message = await checkLogin();
        if (message.errCode === 0) {
          setLogin(message.user);
        } else {
          setLogin({});
        }
      } catch (error) {
        setLogin({});
      }
    };
    isLogin();
  }, []);

  useEffect(() => {
    const category = async () => {
      try {
        const data = await getCategory();
        const dataFood = await getAllFood();
        const dataProductSold = await getProductSold();
        if (
          data?.errCode === 0 &&
          dataFood?.errCode === 0 &&
          dataProductSold.errCode === 0
        ) {
          setTimeout(() => {
            setCategory(data.data);
          }, 200);
          setAllFood(dataFood.message);
          setQuantityProductSold(dataProductSold.data);
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu", error);
      }
    };
    category();
  }, []);

  const handleSetIsShowInfo = (showId, name) => {
    setIsShowInfo((prev) => ({
      ...prev,
      showId: showId,
      name: name,
    }));
  };

  const handleSetHiddenInfo = () => {
    setHiddenInfo((prev) => !prev);
    handleSetIsShowInfo("all", "Tất cả");
  };

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
    <div
      className="w-full h-auto"
      style={{ backgroundImage: `url('${bgCategory}')` }}
    >
      <Header login={login} setLogin={setLogin} isShowCart={true} />
      <div className="flex items-start  md:px-[5rem] lg:px-0 px-[2rem]">
        <nav className="w-[18%] h-[100vh] bg-[#fff0]  pt-[10.8rem] hidden lg:block">
          <div>
            <h3 className="text-[2.5rem] font-bold text-green-800 mb-[1.5rem] px-[3rem]">
              Danh mục
            </h3>
            <div
              className={`px-[3rem] py-[1rem] ${
                isShowInfo.showId === "all"
                  ? "bg-gradient-to-r from-[#FF5733] to-[#FFC300] text-white"
                  : "hover:bg-[#e7e7e7]"
              } cursor-pointer] rounded-[.5rem]`}
              onClick={() => handleSetIsShowInfo("all", "Tất cả")}
            >
              Tất cả
            </div>
            {category.length > 0 &&
              category.map((value) => {
                return (
                  <div
                    className={`${isShowInfo.name === value.categoryName ? "bg-gradient-to-r from-[#FF5733] to-[#FFC300] text-white" : "hover:bg-[#e7e7e7]"} px-[3rem] py-[1rem] rounded-[.5rem] cursor-pointer transition-all duration-[.2s] `}
                    key={value.id}
                    onClick={() =>
                      handleSetIsShowInfo(value.id, value.categoryName)
                    }
                  >
                    {value.categoryName}
                  </div>
                );
              })}
          </div>
        </nav>
        <div className="lg:w-[82%] h-full pt-[8rem] md:pt-[10.8rem] lg:px-[4rem]">
          <div className="flex items-start mb-[1rem]">
            <div>
              <h2 className="text-[2.5rem] text-green-800 md:text-[3.4rem] mb-[1rem]">
                {isShowInfo.name}
              </h2>
              <div className="items-center md:flex hidden">
                <span
                  className={`px-[1rem] py-[.5rem] mb-[2rem] flex justify-center items-center select-none gap-[.5rem] bg-[#b7ffff] rounded-[.5rem] ${isShowInfo.showId === "all" ? "hidden" : "block"}`}
                  onClick={() => handleSetHiddenInfo()}
                >
                  {isShowInfo.name && isShowInfo.name}{" "}
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </div>
            </div>
            <div className="relative ml-auto">
              <input
                type="text"
                className="w-[18rem] sm:w-[22rem] md:w-[28rem] h-[4rem] md:h-[5rem] px-[1rem] pr-[3rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:ring-2 focus:ring-[#1fc5c5] transition-all"
                value={valueSearch}
                placeholder="Tìm kiếm..."
                onChange={(e) => setValueSearch(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-[1rem] top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            </div>
          </div>
          <div className="md:hidden w-full h-auto grid grid-cols-4 p-[1rem] rounded-[.5rem] gap-[1rem] bg-green-200">
            <span
              className="px-[.5rem] py-[.5rem] text-center rounded-[.5rem] bg-cyan-600 text-[#fff]"
              onClick={() => handleSetIsShowInfo("all", "Tất cả")}
            >
              Tất cả
            </span>
            {category.length > 0 &&
              category.map((item) => {
                return (
                  <span
                    key={item.id}
                    className="px-[.5rem] py-[.5rem] text-center rounded-[.5rem] bg-cyan-300"
                    onClick={() =>
                      handleSetIsShowInfo(item.id, item.categoryName)
                    }
                  >
                    {item.categoryName}
                  </span>
                );
              })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[1rem] md:gap-[2rem] mt-[2rem] md:mt-0">
            {allFood.length > 0 ? (
              isShowInfo?.showId === "all" ? (
                allFood
                  .filter((item) =>
                    item.dishName
                      .toLowerCase()
                      .includes(valueSearch.toLowerCase()),
                  )
                  .map((food) => {
                    return (
                      <div
                        key={food.id}
                        className="w-full h-[30rem] md:h-[39rem] md:pb-[2rem] bg-[#fff] rounded-[2rem] shadow-xl hover:shadow-xl group hover:shadow-[#72d2ff] hv-linear cursor-pointer"
                        onClick={() => {
                          navigate(`/detail-food`, {
                            state: {
                              food: food,
                              redirect: "/category-dish",
                            },
                          });
                        }}
                      >
                        <div className="w-full md:h-[18rem] flex justify-center items-center rounded-[1.5rem]">
                          <div className="w-[12rem] h-[12rem] md:w-[17rem] md:h-[17rem] flex justify-center items-center rounded-[50%]">
                            <img
                              src={`http://localhost:3000/${food.image}`}
                              alt="image"
                              className="w-full h-full md:w-[16rem] md:h-[16rem] rounded-[50%] object-cover group-hover:scale-[1.1] transition-all duration-[.2s] shadowImg"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col w-full md:h-[calc(100%-17rem)] h-[calc(100%-12rem)] px-[1.5rem] py-[1rem]">
                          <h3 className="md:text-[2.4rem] font-bold text-center maxlineOne text-green-800">
                            {food.dishName}
                          </h3>
                          <p className="text-center md:text-[1.6rem] text-gray-600 text-[1.3rem] maxlineThree mt-[.4rem]">
                            {food.description}
                          </p>
                          <div className="mt-auto text-center">
                            <div className="flex items-center justify-between md:justify-around">
                              <span className="text-[1.3rem] md:text-[1.5rem] text-[red] block mb-[.5rem]">
                                Giá:
                                <span className="">{food.price}đ</span>
                              </span>
                              <span className="text-[1rem] md:text-[1.4rem] text-gray-700">
                                Đã bán:{" "}
                                {
                                  quantityProductSold.find(
                                    (it) => it.productId === food.id,
                                  ).totalSold
                                }
                              </span>
                            </div>
                            <div className="w-full flex items-center justify-between gap-[.5rem]">
                              {cart.length > 0 ? (
                                cart.some((it) => it.foodId === food.id) ? (
                                  <div
                                    className="w-[18rem] mx-auto h-[3.5rem] md:h-[4rem] md:text-[1.6rem] text-[1.2rem] flex justify-center items-center gap-[.6rem] cursor-pointer bg-[#eeeeee] text-[#00ac22] rounded-[5rem] hover:scale-[1.05] transition-all duration-[.2s]"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Ngăn chặn sự kiện lan lên thẻ cha
                                      setShowCart(true);
                                    }}
                                  >
                                    Kiểm tra giỏ hàng
                                    <FontAwesomeIcon
                                      icon={faArrowRightLong}
                                      className="text-[#00ac22]"
                                    />
                                  </div>
                                ) : food.quantity === 0 ? (
                                  <button className="w-[18rem] md:text-[1.6rem] text-[1.2rem] h-[3.5rem] md:h-[4rem] cursor-pointer mx-auto  text-[#fff] rounded-[5rem] bg-gray-300">
                                    Hết hàng
                                  </button>
                                ) : (
                                  <button
                                    className="w-[18rem] md:text-[1.6rem] text-[1.2rem] h-[3.5rem] md:h-[4rem] cursor-pointer mx-auto linearItem2 text-[#fff] rounded-[5rem] hover:scale-[1.05] transition-all duration-[.2s]"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Ngăn chặn sự kiện lan lên thẻ cha
                                      handleAddProductCart(food);
                                    }}
                                  >
                                    Chọn món
                                  </button>
                                )
                              ) : (
                                <button
                                  className="w-[18rem] mx-auto h-[4rem] cursor-pointer linearItem2 text-[#fff] rounded-[5rem] hover:scale-[1.05] transition-all duration-[.2s]"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Ngăn chặn sự kiện lan lên thẻ cha
                                    handleAddProductCart(food);
                                  }}
                                >
                                  Chọn món
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                allFood
                  .filter((it) => it.categoryId === isShowInfo.showId)
                  .filter((item) =>
                    item.dishName
                      .toLowerCase()
                      .includes(valueSearch.toLowerCase()),
                  )
                  .map((food) => {
                    return (
                      <div
                        key={food.id}
                        className="w-full h-[32rem] md:h-[39rem] md:pb-[2rem] bg-[#fff] rounded-[2rem] shadow-xl group hover:shadow-[#72d2ff] hv-linear"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/detail-food`, {
                            state: {
                              food: food,
                              redirect: "/category-dish",
                            },
                          });
                        }}
                      >
                        <div className="w-full md:h-[18rem] flex justify-center items-center rounded-[1.5rem]">
                          <div className="w-[12rem] h-[12rem] md:w-[17rem] md:h-[17rem] flex justify-center items-center rounded-[50%]">
                            <img
                              src={`http://localhost:3000/${food.image}`}
                              alt="image"
                              className="w-full h-full md:w-[16rem] md:h-[16rem] rounded-[50%] object-cover group-hover:scale-[1.1] transition-all duration-[.2s] shadowImg"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col w-full md:h-[calc(100%-17rem)] h-[calc(100%-12rem)] px-[1.5rem] py-[1rem]">
                          <h3 className="md:text-[2.4rem] text-green-800 font-bold text-center maxlineThree ">
                            {food.dishName}
                          </h3>
                          <p className="text-center md:text-[1.6rem] text-gray-600 text-[1.3rem] maxlineThree mt-[.4rem]">
                            {food.description}
                          </p>
                          <div className="mt-auto text-center">
                            <div className="flex items-center justify-around">
                              <span className="text-[1.5rem] text-[red] block mb-[.5rem]">
                                Giá:
                                <span className="">{food.price}đ</span>
                              </span>
                              <span className="text-[1.4rem] text-gray-600">
                                Đã bán:{" "}
                                {
                                  quantityProductSold.find(
                                    (it) => it.productId === food.id,
                                  ).totalSold
                                }
                              </span>
                            </div>
                            <div className="w-full flex items-center justify-between gap-[.5rem]">
                              {cart.length > 0 ? (
                                cart.some((it) => it.foodId === food.id) ? (
                                  <div
                                    className="w-[18rem] mx-auto h-[3.5rem] md:h-[4rem] md:text-[1.6rem] text-[1.2rem] flex justify-center items-center gap-[.6rem] cursor-pointer bg-[#eeeeee] text-[#00ac22] rounded-[5rem] hover:scale-[1.05] transition-all duration-[.2s]"
                                    onClick={() => setShowCart(true)}
                                  >
                                    Kiểm tra giỏ hàng
                                    <FontAwesomeIcon
                                      icon={faArrowRightLong}
                                      className="text-[#00ac22]"
                                    />
                                  </div>
                                ) : (
                                  <button
                                    className="w-[18rem] md:text-[1.6rem] text-[1.2rem] h-[3.5rem] md:h-[4rem] cursor-pointer mx-auto linearItem2 text-[#fff] rounded-[5rem] hover:scale-[1.05] transition-all duration-[.2s]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddProductCart(food);
                                    }}
                                  >
                                    Chọn món
                                  </button>
                                )
                              ) : (
                                <button
                                  className="w-[18rem] mx-auto h-[4rem] cursor-pointer linearItem2 text-[#fff] rounded-[5rem] hover:scale-[1.05] transition-all duration-[.2s]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddProductCart(food);
                                  }}
                                >
                                  Chọn món
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )
            ) : (
              <Loading isLoading={true} />
            )}
          </div>
        </div>
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
          info={"chọn món"}
        />
      )}
      {<ShowCartRight showCart={showCart} setShowCart={setShowCart} />}
      {showDetailFood && (
        <DetailFood
          login={login}
          food={showDetailFood}
          setShowDetailFood={setShowDetailFood}
          quantitySold={quantityProductSold}
        />
      )}
      <Footer />
    </div>
  );
}

export default CategoryPage;
