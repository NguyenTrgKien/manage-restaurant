import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CartView() {
  const [login, setLogin] = useState({});
  const [listCart, setListCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLogin = async () => {
      try {
        const message = await checkLogin();
        if (message.errCode === 0) {
          setLogin(message.user);
          localStorage.setItem("userLogin", message.user);
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
    const dataCart = JSON.parse(localStorage.getItem("food")) || [];
    setListCart(dataCart);
  }, []);

  const handleRemoveProduct = (foodId) => {
    const newCart = listCart.filter((it) => it.id !== foodId);
    localStorage.setItem("food", JSON.stringify(newCart));
    setListCart(newCart);
  };

  const handleTotaProduct = (price, quantityPro) => {
    return price * quantityPro;
  };

  const handleSetQuantityProduct = (id, value) => {
    const newCart = listCart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantityPro:
            value === "incre"
              ? Math.min(item.quantityPro + 1, item.quantity)
              : Math.max(item.quantityPro - 1, 1),
        };
      }
      return item;
    });
    setListCart(newCart);
    localStorage.setItem("food", JSON.stringify(newCart));
  };

  return (
    <div className="w-full h-auto">
      <Header login={login} setLogin={setLogin} isBg={true} />
      <div className="px-[10rem] w-full flex items-start pt-[12.8rem]">
        <div className="w-[60%] pr-[4rem]">
          <div className="w-full flex items-center border-b-[.1rem] pb-[1rem]">
            <div className="w-[35%] text-[2rem] font-bold text-[#565656]">
              SẢN PHẨM
            </div>
            <div className="w-[15%] text-[2rem] font-bold text-end text-[#565656]">
              GIÁ
            </div>
            <div className="w-[20%] text-[2rem] font-bold text-end text-[#565656]">
              SỐ LƯỢNG
            </div>
            <div className="w-[20%] text-[2rem] font-bold text-end text-[#565656]">
              TỔNG
            </div>
            <div className="w-[10%] text-[2rem] font-bold text-end text-[#565656]"></div>
          </div>
          {listCart.length > 0 &&
            listCart.map((item) => {
              return (
                <div
                  key={item.id}
                  className="w-full flex items-center border-b-[.1rem] py-[3rem]"
                >
                  <div className="w-[35%] flex items-center gap-[2rem]">
                    <div className="w-[7rem] h-full flex justify-center items-center">
                      <img
                        src={`http://localhost:3000/${item.image}`}
                        alt=""
                        className="w-full"
                      />
                    </div>
                    <div className="text-[1.8rem] maxlineOne">
                      {item.dishName}
                    </div>
                  </div>
                  <div className="w-[15%] text-[1.6rem] text-[red] text-end">
                    {item.price}
                  </div>
                  <div className="w-[20%] text-[1.6rem] text-end">
                    <span
                      className="w-[3rem] h-[3rem] inline-flex bg-[#e7e7e7] cursor-pointer justify-center items-center
                                         border-[.1rem] select-none"
                      onClick={() => handleSetQuantityProduct(item.id, "decre")}
                    >
                      -
                    </span>
                    <span
                      className="w-[3rem] h-[3rem] inline-flex justify-center items-center
                                         border-t-[.1rem] border-b-[.1rem]"
                    >
                      {item.quantityPro || 1}
                    </span>
                    <span
                      className="w-[3rem] h-[3rem] inline-flex bg-[#e7e7e7] cursor-pointer justify-center items-center
                                         border-[.1rem] select-none"
                      onClick={() => handleSetQuantityProduct(item.id, "incre")}
                    >
                      +
                    </span>
                  </div>
                  <div className="w-[20%] text-[red] text-[1.6rem] text-end">
                    {handleTotaProduct(
                      item.price,
                      item.quantityPro,
                    ).toLocaleString("vi-VN", {
                      maximumFractionDigits: 3,
                      minimumFractionDigits: 3,
                    })}
                  </div>
                  <div className="w-[10%]  text-end">
                    <button
                      className="text-[#fff] p-[1rem] bg-[#c9c9c9] text-[1.2rem] rounded-[.5rem] hover:bg-[red] transition-all duration-[.2s] cursor-pointer"
                      onClick={() => handleRemoveProduct(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="w-[40%] pl-[4rem] border-l-[.1rem]">
          <div className="pb-[1rem] text-[2rem] text-[#565656] font-bold border-b-[.1rem]">
            TỔNG SỐ LƯỢNG
          </div>
          <div className="flex items-center justify-between pt-[2rem] pb-[1rem] border-b-[.1rem]">
            <span className="text-[1.6rem] text-[#6c6c6c]">Tổng phụ</span>
            <span className="text-[red]">
              {listCart.length > 0 &&
                listCart
                  .reduce((init, curr) => {
                    return init + Number(curr.price * curr?.quantityPro || 1);
                  }, 0)
                  .toLocaleString("vi-VN", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
              đ
            </span>
          </div>
          <div className="flex justify-between items-center pt-[2rem] pb-[1rem] border-b-[.1rem]">
            <span className="w-[15%] text-[1.6rem] text-[#6c6c6c]">
              Giao hàng
            </span>
            <div className="w-[75%] flex flex-col gap-[.5rem] text-end">
              <span>Giao hàng miễn phí</span>
              <span>
                Đây chỉ là ước tính. Giá sẽ cập nhật trong quá trình thanh toán.
              </span>
              <span>Tính phí giao hàng</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-[2rem] pb-[1rem] border-b-[.1rem]">
            <span className="w-[15%] text-[1.6rem] text-[#6c6c6c]">Tổng</span>
            <span className="text-[red]">
              {listCart.length > 0 &&
                listCart
                  .reduce((init, curr) => {
                    return init + Number(curr.price * curr?.quantityPro || 1);
                  }, 0)
                  .toLocaleString("vi-VN", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
              đ
            </span>
          </div>
          <Link
            to={"/category-dish"}
            className="w-full h-[5rem] rounded-[.5rem] flex justify-center gap-[.5rem] items-center text-[#fff] bg-[#2fbe2a] mt-[2rem] hover:bg-[#12b50c] hv-linear cursor-pointer"
            onClick={() => handleSaveQuantityPro()}
          >
            <FontAwesomeIcon icon={faArrowLeftLong} />
            TIẾP TỤC MUA HÀNG
          </Link>
          <Link
            to={`/payment-dish`}
            className="w-full h-[5rem] rounded-[.5rem] flex justify-center items-center text-[#fff] bg-[#ee3d3d] hover:bg-[red] hv-linear cursor-pointer mt-[2rem]"
            onClick={() => handleSaveQuantityPro()}
          >
            TIẾN HÀNH THANH TOÁN
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartView;
