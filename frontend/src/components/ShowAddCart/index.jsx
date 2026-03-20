import {
  faArrowLeftLong,
  faCaretRight,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { FoodContext } from "../../contexts/FoodContext";

function ShowAddCart({ login, isShowAddCart, setIsShowAddCart, setShowCart }) {
  const [quantityProduct, setQuantityProduct] = useState(1);
  const { cart, getCartUser } = useContext(FoodContext);
  const [allFood, setAllFood] = useState([]);
  useEffect(() => {
    const category = async () => {
      try {
        const dataFood = await getAllFood();
        if (dataFood?.errCode === 0) {
          setAllFood(dataFood.message);
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu", error);
      }
    };
    category();
  }, []);

  const handleUpdateQuantityOrder = async (isShowAddCart, isShowCart) => {
    try {
      const update = {
        userId: login.id,
        foodId: isShowAddCart.product.id,
        quantityOrder: quantityProduct || 1,
      };
      const message = await updateQuantityOrderCart(update);
      if (message.errCode === 0) {
        getCartUser();
        if (isShowCart) {
          setShowCart(true);
        }
        setIsShowAddCart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSetQuantityProduct = (action, food) => {
    const findFood =
      allFood.length > 0 && allFood.find((it) => it.id === food.product.id);
    const quantity = findFood ? findFood.quantity : 1;
    setQuantityProduct((prev) =>
      action === "incre" ? Math.min(prev + 1, quantity) : Math.max(prev - 1, 1),
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#5c5c5c90] z-[999]">
      <div className="relative w-[90%] md:w-[60rem] h-auto bg-[#fff] rounded-[1rem] px-[3rem] md:px-[4rem] py-[2rem]">
        <div
          className="w-[3rem] h-[3rem] absolute top-[.5rem] right-[.5rem] md:top-[1rem] md:right-[1rem] flex justify-center items-center rounded-[.3rem] bg-[#eaeaea] cursor-pointer"
          onClick={() => {
            handleUpdateQuantityOrder(isShowAddCart, false);
          }}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-[1.8rem] text-[#646464]"
          />
        </div>
        <div className="flex items-center gap-[2rem] pb-[2rem] border-b-[.1rem] border-b-[#bbb]">
          <div className="md:w-[5rem] md:h-[5rem] w-[4rem] h-[4rem] rounded-[50%] flex justify-center items-center border-[.1rem] border-[#00a100] ">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-[2rem] md:text-[2.5rem]  text-[#00a100]"
            />
          </div>
          <span className="w-[80%] md:text-[1.6rem] text-[1.4rem]">
            Sản phẩm này vừa được thêm vào giỏ hàng
          </span>
        </div>
        <div className="flex items-center py-[2rem] border-b-[.1rem] border-b-[#bbb]">
          <img
            src={`http://localhost:3000/${isShowAddCart.product?.image}`}
            alt="image"
            className="md:w-[14rem] md:h-[14rem] w-[10rem] h-[10rem] object-cover rounded-[50%]"
          />
          <div className="flex flex-col ml-[1rem]">
            <div className="text-[2rem] md:text-[2.8rem] font-bold maxlineOne">
              {isShowAddCart.product.dishName}
            </div>
            <p className="maxlineThree">
              {isShowAddCart.product?.description}{" "}
            </p>
            <div className="flex items-center text-[1.6rem] text-end mt-[.5rem] mb-[1rem]">
              <span
                className="w-[2rem] md:w-[2.5rem] h-[2rem] md:h-[2.5rem] inline-flex bg-[#e7e7e7] cursor-pointer justify-center items-center
                                border-[.1rem] select-none"
                onClick={() => handleSetQuantityProduct("decre", isShowAddCart)}
              >
                -
              </span>
              <span
                className="w-[2rem] md:w-[2.5rem] h-[2rem] md:h-[2.5rem] inline-flex justify-center items-center
                                border-t-[.1rem] border-b-[.1rem]"
              >
                {quantityProduct || 1}
              </span>
              <span
                className="w-[2rem] md:w-[2.5rem] h-[2rem] md:h-[2.5rem] inline-flex bg-[#e7e7e7] cursor-pointer justify-center items-center
                                border-[.1rem] select-none"
                onClick={() => handleSetQuantityProduct("incre", isShowAddCart)}
              >
                +
              </span>
            </div>
            <span className=" md:text-[2rem] text-[red] mt-[.5rem]">
              {isShowAddCart.product?.price}đ
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[.8rem] py-[2rem]">
          <FontAwesomeIcon
            icon={faCaretRight}
            className="text-[2rem] text-[green]"
          />
          <div className="text-[1.4rem]">
            Giỏ hàng của bạn ({cart.length}) sản phẩm
          </div>
        </div>
        <div className="flex items-center gap-[1rem]">
          <div
            className="w-full md:h-[5rem] h-[4rem] text-[1rem] md:text-[1.6rem] flex justify-center gap-[.5rem] items-center text-[#fff] rounded-[.5rem] bg-green-500 md:hover:bg-green-600 transition-all duration-[.2s] cursor-pointer"
            onClick={() => {
              handleUpdateQuantityOrder(isShowAddCart, false);
              setIsShowAddCart(false);
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              className="text-[1.2rem] md:text-[1.6rem]"
            />
            TIẾP TỤC MUA HÀNG
          </div>
          <div
            className="w-full md:h-[5rem] h-[4rem] text-[1rem] md:text-[1.6rem] flex justify-center items-center text-[#fff] rounded-[.5rem] bg-red-500 md:hover:bg-red-600 transition-all duration-[.2s] cursor-pointer"
            onClick={() => {
              handleUpdateQuantityOrder(isShowAddCart, true);
            }}
          >
            XEM GIỎ HÀNG
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowAddCart;
