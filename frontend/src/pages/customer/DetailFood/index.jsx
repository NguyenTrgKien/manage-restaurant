import { useContext, useEffect, useState } from "react";
import bgCategory from "../../../assets/image/snow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCaretLeft,
  faCheck,
  faEye,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import WarnLogin from "../../../components/WarnLogin";
import ShowCartRight from "../../../components/ShowCartRight";
import { Link, useLocation, useNavigate } from "react-router";
import Header from "../../../components/Header";
import moment from "moment";
import Footer from "../../../components/Footer";

function DetailFood() {
  const [login, setLogin] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const food = location.state.food;
  const redirect = location.state.redirect;
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const { cart, getCartUser } = useContext(FoodContext);
  const [addCartIsSuccess, setAddCartIsSuccess] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [everageData, setEverageData] = useState(0);
  const [dataEvaluate, setDataEvaluate] = useState([]);
  const [showProductLg, setShowProductLg] = useState(false);
  const [quantityProductSold, setQuantityProductSold] = useState([]);

  const fetchDetailEvaluate = async () => {
    try {
      const response = await getDetailEvaluateProduct(food.id);
      if (response.errCode === 0) {
        setEverageData(Number(response.everageEvaluate));
        setDataEvaluate(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDetailEvaluate();
  }, []);

  const handleSetQuantityProduct = (action) => {
    setQuantityProduct((prev) =>
      action === "incre"
        ? Math.min(prev + 1, food.quantity || 1)
        : Math.max(prev - 1, 1),
    );
  };

  const handleAddProductCart = async (food) => {
    try {
      if (!login.id) {
        setShowWarnLogin(true);
      }
      const dataAdd = {
        foodId: food.id,
        userId: login.id,
        quantityOrder: quantityProduct,
      };
      const message = await addProductCart(dataAdd);
      if (message.errCode === 0) {
        getCartUser();
        setAddCartIsSuccess(true);
        setTimeout(() => {
          setAddCartIsSuccess(false);
        }, 500);
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
      <Header
        login={login}
        setLogin={setLogin}
        isShowCart={true}
        isBg={false}
      />
      <div className="relative w-full h-auto pt-[9.5rem] px-[2rem] md:px-[5rem] lg:px-[10rem] xl:px-[20rem]">
        <h2 className="text-[2.5rem] md:text-[3.4rem] font-bold text-green-800 mb-[1rem]">
          Chi tiết món ăn
        </h2>
        <div
          className="mt-[1rem] w-[16rem] h-[3rem] flex justify-center gap-[.5rem] items-center rounded-[.5rem] bg-gray-200 hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            navigate(redirect);
          }}
        >
          <FontAwesomeIcon icon={faCaretLeft} className="text-[#5b5b5b]" />
          Tiếp tục chọn món
        </div>
        <div className="rounded-[1rem] border bg-white border-gray-200 p-[2.5rem] mt-[2rem] shadow-lg">
          <div className="flex md:flex-row flex-col items-start ">
            <div
              className="relative w-full h-auto md:w-[50%] my-auto flex justify-center
                        items-center rounded-[.5rem] p-[2rem] group"
            >
              <img
                src={`http://localhost:3000/${food.image}`}
                alt="img"
                className="w-[25rem] h-[25rem] lg:w-[30rem] lg:h-[30rem] xl:w-[35rem] xl:h-[35rem] object-cover shadowImg"
              />
              {food?.quantity > 0 ? (
                <div
                  className="absolute flex justify-center items-center inset-0 bg-[#5353539f] rounded-[.5rem] opacity-0 group-hover:opacity-[1] transition-all duration-[.4s] cursor-pointer"
                  onClick={() => {
                    setShowProductLg(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEye}
                    className="text-[#fff] text-[3.5rem]"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center text-[2.8rem] text-gray-50 justify-center bg-[#5a5a5a71]">
                  Hết hàng
                </div>
              )}
            </div>
            <div className="md:w-[50%] md:mt-0 mt-[2rem] flex flex-col md:pl-[2.5rem]">
              <h3 className="text-[2rem] md:text-[2.8rem] text-green-800 font-bold">
                {food.dishName}
              </h3>
              <div className="flex items-center mt-[1rem]">
                <div className="flex items-center gap-[.2rem]">
                  {everageData !== 0 ? (
                    <>
                      <div className="text-gray-700 mr-[.5rem] text-[1.8rem] underline">
                        {everageData.toFixed(1)}
                      </div>
                      {[1, 2, 3, 4, 5].map((star) => {
                        return (
                          <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={`${everageData >= star ? "text-yellow-500" : "text-gray-400"} text-[1.4rem]`}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <span className="text-[1.4rem] text-gray-700">
                      Chưa có đánh giá
                    </span>
                  )}
                </div>
                <div className="text-[1.4rem] text-gray-700 pl-[2rem] ml-[2rem] border-l border-l-gray-400">
                  <strong className="pr-[.5rem] underline">
                    {dataEvaluate.length}
                  </strong>{" "}
                  Đánh giá
                </div>
                <div className="text-[1.4rem] text-gray-700 pl-[2rem] ml-[2rem] border-l border-l-gray-400">
                  <strong className="pr-[.5rem]">
                    {
                      quantityProductSold?.find(
                        (item) => item.productId === food.id,
                      )?.totalSold
                    }
                  </strong>
                  Đã bán
                </div>
              </div>
              <p className="text-[1.4rem] md:text-[1.6rem] text-gray-600 mt-[1.5rem]">
                {food.description}
              </p>
              <div className="text-[1.4rem] md:text-[1.6rem] mt-[1.5rem]">
                Tình trạng:{" "}
                <span className="text-green-600">
                  {food.quantity >= 1
                    ? `Còn hàng (${food.quantity}sp)`
                    : "Hết hàng"}
                </span>
              </div>
              <div className="text-[1.4rem] md:text-[1.6rem] mt-[1.5rem]">
                Mã sản phẩm: <span className="text-green-600">{food.id}</span>
              </div>
              <div className="text-[1.4rem] md:text-[1.6rem] mt-[1.5rem]">
                Thành phần: Đang cập nhật dữ liệu
              </div>
              <div className="text-[1.4rem] md:text-[1.6rem] mt-[1.5rem]">
                Thời gian chế biến: ( Dự kiến 15 - 20p )
              </div>
              <span className="mt-[.5rem]  md:text-[3rem] text-red-500 font-bold">
                99.000đ
              </span>
              {cart?.find((item) => {
                return item.foodId === food.id;
              }) ? (
                <div></div>
              ) : (
                <div className="flex items-center gap-[.5rem] text-[1.6rem] text-end mt-[1rem] mb-[1rem]">
                  <span
                    className="w-[2rem] md:w-[3rem] h-[2rem] md:h-[3rem] rounded-[.5rem] inline-flex bg-[#f6973e] cursor-pointer justify-center text-[#fff] items-center
                                            border-[.1rem] border-[#8e8e8e] select-none"
                    onClick={() => handleSetQuantityProduct("decre")}
                  >
                    -
                  </span>
                  <span className="w-[2rem] md:w-[3rem] h-[2rem] md:h-[3rem] inline-flex justify-center items-center border-[#8e8e8e] rounded-[.5rem] border-[.1rem]">
                    {quantityProduct || 1}
                  </span>
                  <span
                    className="w-[2rem] md:w-[3rem] h-[2rem] md:h-[3rem] rounded-[.5rem] inline-flex bg-[#f6973e] border-[#8e8e8e] text-[#fff] cursor-pointer justify-center items-center
                                            border-[.1rem] select-none"
                    onClick={() => handleSetQuantityProduct("incre")}
                  >
                    +
                  </span>
                </div>
              )}
              {food.quantity > 0 ? (
                cart.find((item) => {
                  return item.foodId === food.id;
                }) ? (
                  <div
                    className="px-[2rem] py-[1rem] flex justify-center items-center gap-[.5rem] mt-[1rem]  rounded-[.5rem] text-[#00ac22] bg-[#eeeeee] hover:scale-[1.05] transition-all duration-[.3s] cursor-pointer"
                    onClick={() => {
                      setShowCart(true);
                    }}
                  >
                    Kiểm tra giỏ hàng
                    <FontAwesomeIcon
                      icon={faArrowRightLong}
                      className="text-[#00ac22]"
                    />
                  </div>
                ) : (
                  <button
                    className="px-[2rem] py-[1rem] mt-[1rem] linearItem2 rounded-[.5rem] text-[#fff] hover:scale-[1.05] hover:bg-green-600 transition-all duration-[.3s] cursor-pointer"
                    onClick={() => {
                      handleAddProductCart(food);
                    }}
                  >
                    Thêm vào giỏ hàng
                  </button>
                )
              ) : (
                <div className="w-full h-[4.5rem] mt-[1rem] rounded-[.5rem] flex items-center justify-center bg-gray-200 text-gray-500 cursor-no-drop select-none">
                  Hết hàng
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full border rounded-[1rem] bg-white border-gray-200 shadow-lg mt-[2.5rem] p-[2rem]">
          <h2 className="text-[2rem] text-gray-700">ĐÁNH GIÁ MÓN ĂN</h2>
          <div className="w-full mt-[2rem]">
            {dataEvaluate.length > 0 ? (
              dataEvaluate.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="gap-[1rem] pb-[1.5rem] mb-[1.5rem] border-b border-b-gray-300"
                  >
                    <div className="flex items-start gap-[1rem]">
                      <img
                        src={
                          item.User?.image?.includes("uploads")
                            ? `http://localhost:3000/${item.User?.image}`
                            : item.User.image === null
                              ? avataDefault
                              : item.User.image
                        }
                        alt="Avatar"
                        className="w-[4rem] h-[4rem] rounded-[50%] object-cover"
                      />
                      <div className="flex flex-col gap-[.5rem]">
                        <h4 className=" text-[1.5rem]">{item.User.fullName}</h4>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => {
                            return (
                              <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                                className={`${item.scoreEvaluate >= star ? "text-yellow-500" : "text-gray-400"} text-[1.2rem] `}
                              />
                            );
                          })}
                        </div>
                        <p className="text-[1.4rem] text-gray-600 mt-[.2rem]">
                          {moment(item.createdAt).format("DD/MM/YYYY")}
                        </p>
                        <p className="mt-[1rem] text-gray-700">
                          {item.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500">
                Chưa có đánh giá nào
              </div>
            )}
          </div>
        </div>
      </div>
      {showWarnLogin && (
        <WarnLogin
          setShowWarnLogin={setShowWarnLogin}
          pathRedirect={"/category-dish"}
          info={"chọn món"}
        />
      )}
      {<ShowCartRight showCart={showCart} setShowCart={setShowCart} />}

      {showProductLg && (
        <div
          className="hidden md:flex fixed inset-0 justify-center items-center bg-[#565656b6] z-[950]"
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setShowProductLg(false);
            }
          }}
        >
          <img
            src={`http://localhost:3000/${food.image}`}
            alt="image"
            className="md:w-[50rem] md:h-[50rem] lg:w-[70rem] lg:h-[70rem] object-cover"
          />
        </div>
      )}

      {addCartIsSuccess && (
        <div className="fixed inset-0 bg-[#3f3f3f73] flex justify-center items-center">
          <div className="min-w-[10rem] h-auto rounded-[.5rem] flex flex-col gap-[1rem] justify-center items-center bg-[#fff] px-[5rem] py-[3rem] text-[2rem] shadow-2xl">
            <div className="flex justify-center items-center w-[5rem] h-[5rem] border border-gray-400 focus:ring-2 focus:ring-amber-300 rounded-[50%]">
              <FontAwesomeIcon icon={faCheck} className="text-[#05b405]" />
            </div>
            Thêm vòa giỏ hàng thành công!
            <div
              className="w-[8rem] h-[4rem] flex justify-center items-center bg-[#3a84d3] rounded-[1rem] text-[#fff] border-[.3rem] text-[1.5rem] cursor-pointer border-[#98dbff]"
              onClick={() => setAddCartIsSuccess(false)}
            >
              Ok
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default DetailFood;
