import {
  faCartPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cartEmpty from "../../assets/image/cart_empty.png";
import { useContext, useEffect, useState } from "react";
import { FoodContext } from "../../contexts/FoodContext";
import { redirect, useNavigate } from "react-router";

function ShowCartRight({ showCart, setShowCart }) {
  const [login, setLogin] = useState({});
  const { cart, getCartUser } = useContext(FoodContext);
  const { dataAllFood } = useContext(FoodContext);
  const navigate = useNavigate();
  const [quantityOrder, setQuantityOrder] = useState([]);
  let init = {};

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
    if (cart.length > 0) {
      cart.map((item) => {
        init[item.foodId] = item.quantityOrder;
      });
      setQuantityOrder(init);
    }
  }, [cart]);

  const handleSetQuantityOrder = (id, action) => {
    const quantity = dataAllFood.find((it) => it.id === id).quantity;
    setQuantityOrder((prev) => ({
      ...prev,
      [id]:
        action === "incre"
          ? Math.min(prev[id] + 1, quantity || 1)
          : Math.max(prev[id] - 1, 1),
    }));
  };

  const handleUpdateQuantityOrder = async () => {
    try {
      const update = {
        userId: login?.id,
        cart: Object.entries(quantityOrder).map(([foodId, quantityOrder]) => ({
          foodId: foodId,
          quantityOrder: quantityOrder,
        })),
      };
      const message = await updateAllCart(update);
      if (message.errCode === 0) {
        setShowCart(false);
        getCartUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveItemCart = async (id) => {
    try {
      const userId = login.id;
      const foodId = id;
      const message = await deleteProductCart(userId, foodId);
      if (message.errCode === 0) {
        getCartUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirectOrderTable = (redirect, action) => {
    navigate(`/${redirect}`, {
      state: action,
    });
  };

  return (
    <>
      <div
        className={`fixed w-[90%] sm:w-[80%] md:w-[55%] lg:w-[45%] xl:w-[34%] h-full bg-[#fff] top-0 right-0 ${showCart ? "translate-x-[0] opacity-[1]" : "translate-x-[100%] opacity-0"} transition-all duration-[.8s] z-[999]`}
      >
        <div className="text-[2rem] p-[2rem] flex items-center gap-[1rem]">
          <FontAwesomeIcon icon={faCartPlus} className="text-[red]" />
          <div className="text-[#5c5c5c]">GIỎ HÀNG CỦA BẠN</div>
          <span
            className="ml-auto"
            onClick={() => {
              handleUpdateQuantityOrder();
              setShowCart(false);
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[2.4rem] text-[#6b6b6b] cursor-pointer"
            />
          </span>
        </div>
        {cart.length > 0 ? (
          <div>
            <div className="w-full max-h-[55rem] overflow-y-scroll removeScrollbar">
              {cart.map((item) => {
                const foodItem =
                  dataAllFood.length > 0 &&
                  dataAllFood.find((it) => it.id === item.foodId);
                return (
                  <div key={item.id} className="py-[1.5rem] px-[2rem]">
                    <div className="flex items-center">
                      <div className="w-[45%] flex justify-start items-center">
                        <div className="ml-[1rem] flex flex-col gap-[.5rem]">
                          <span className="text-[1.5rem] md:text-[1.6rem] font-bold maxlineOne">
                            {foodItem?.dishName}
                          </span>
                          <span className="text-[1.2rem] md:text-[1.4rem]">
                            {foodItem?.price} đ
                          </span>
                        </div>
                      </div>
                      <div className="w-[25%] flex justify-center items-center">
                        <span
                          className="w-[2.5rem] h-[2.5rem flex justify-center items-center rounded-[.4rem] select-none border-[.1rem] border-[#969696]"
                          onClick={() =>
                            handleSetQuantityOrder(foodItem?.id, "decre")
                          }
                        >
                          -
                        </span>
                        <span className="w-[2.5rem] h-[2.5rem flex justify-center items-center select-none">
                          {quantityOrder[foodItem?.id] || 1}
                        </span>
                        <span
                          className="w-[2.5rem] h-[2.5rem flex justify-center items-center rounded-[.4rem] select-none border-[.1rem] border-[#969696]"
                          onClick={() =>
                            handleSetQuantityOrder(foodItem?.id, "incre")
                          }
                        >
                          +
                        </span>
                      </div>
                      <div className="w-[30%] ml-auto flex items-center justify-end md:gap-[1rem]">
                        <span className="md:text-[1.6rem] text-[1.2rem]">
                          {(
                            Number(foodItem?.price) *
                              Number(quantityOrder[foodItem.id]) || 1
                          ).toLocaleString("vi-VN", {
                            maximumFractionDigits: 3,
                            minimumFractionDigits: 3,
                          })}{" "}
                          đ
                        </span>
                        <span
                          className=" text-[red] ml-[1rem] cursor-pointer md:text-[1.8rem]"
                          onClick={() => handleRemoveItemCart(foodItem?.id)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center mt-[4rem] gap-[1rem]">
              <div
                className="w-[15rem] h-[4rem] flex justify-center items-center rounded-[5rem] text-[#fff] linearItem2 cursor-pointer"
                onClick={() => {
                  handleUpdateQuantityOrder();
                  handleRedirectOrderTable("order-table", "payment");
                }}
              >
                Thanh toán
              </div>
              <div
                className="w-[15rem] h-[4rem] flex justify-center items-center rounded-[5rem] text-[#fff] bg-[#FF5733] hover:scale-[1.05] transition-all duration-[.3s] cursor-pointer"
                onClick={() => {
                  handleUpdateQuantityOrder();
                  handleRedirectOrderTable("order-table", "paymentTable");
                }}
              >
                Đặt bàn ngay
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full mt-[4rem] flex flex-col justify-center items-center">
            <img src={cartEmpty} alt="img" className="w-[25rem]" />
            <p className="mt-[1rem] text-[#5c5c5c]">
              Không có sản phẩm trong giỏ hàng
            </p>
          </div>
        )}
      </div>
      <div
        className={`fixed inset-0 ${showCart ? "block" : "hidden"} bg-[#2828285c] z-[950]`}
      ></div>
    </>
  );
}

export default ShowCartRight;
