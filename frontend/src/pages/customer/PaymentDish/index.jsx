import { useEffect, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/Footer";
import { Link } from "react-router";

function PayDish() {
  const [login, setLogin] = useState({});
  const [product, setProduct] = useState([]);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [showInfoPayment, setShowInfoPayment] = useState(null);

  useEffect(() => {
    const isLogin = async () => {
      try {
        const message = await checkLogin();
        if (message.errCode === 0) {
          setLogin(message.user);
          localStorage.setItem("userLogin", JSON.stringify(message.user));
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
    if (dataCart.length > 0) {
      setProduct(dataCart);
    }
  }, []);

  const handleTotalPrice = useMemo(() => {
    return (
      product.length > 0 &&
      product
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price * currentValue.quantityPro;
        }, 0)
        .toLocaleString("vi-VN", {
          maximumFractionDigits: 3,
          minimumFractionDigits: 3,
        })
    );
  }, [product]);

  const handleSetShowInfoPayment = async () => {
    try {
      if (!login.id) {
        setShowWarnLogin(true);
        return;
      }
      const amountTotal = product.reduce((accumulator, currentValue) => {
        return currentValue.quantityPro * currentValue.price + accumulator;
      }, 0);
      const order = {
        userId: login.id || null,
        product: product,
        amount: Number(amountTotal),
        paymentMethod: "MOMO",
        status: "PENDING",
        orderType: orderType,
      };

      // Lưu đơn hàng lên server trước khi thanh toán
      const saveOrderResponse = await postOrder(order);
      if (saveOrderResponse.paymentUrl.resultCode === 0) {
        setShowInfoPayment(saveOrderResponse.paymentUrl.payUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePaymentMomo = async () => {
    if (showInfoPayment) {
      window.location.href = showInfoPayment;
    } else {
      console.log("Đã xãy ra lỗi!");
    }
  };

  return (
    <div className="w-full h-[100vh]">
      <Header login={login} setLogin={setLogin} isBg={true} />
      <div className="w-full flex items-start gap-[2rem] pt-[12.8rem] px-[10rem]">
        <div className="w-[60%] h-auto">
          <div className="w-full h-auto bg-[#f1f1f1] p-[1rem] rounded-[.5rem]">
            <div className="bg-[#fff] p-[2rem]">
              <div className="text-[2.2rem] font-bold text-[#676767] pb-[4rem]">
                CHI TIẾT DƠN HÀNG
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.length > 0 &&
                      product.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="flex items-center gap-[1rem]">
                                <img
                                  src={`http://localhost:3000/${item.image}`}
                                  alt="img"
                                  className="w-[8rem]"
                                />
                                <span className="text-[1.8rem] font-bold">
                                  {item.dishName}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="ml-auto pl-[2rem]">
                                {item.price}đ
                              </span>
                            </td>
                            <td>
                              <span>{item.quantityPro}</span>
                            </td>
                            <td>
                              {(item.quantityPro * item.price).toLocaleString(
                                "vi-VN",
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                },
                              )}{" "}
                              VND
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[40%] h-auto">
          <div className="w-full h-auto bg-[#f1f1f1] p-[1rem] rounded-[.5rem]">
            <div className="text-[2.2rem] font-bold text-[#676767] text-center py-[2rem]">
              THÔNG TIN ĐƠN HÀNG
            </div>
            <div className="w-full p-[1rem] bg-[#fff] ">
              <div className="flex items-center justify-between pb-[1rem] border-b-[.1rem] border-b-[#c6c6c6]">
                <span>SẢN PHẨM</span>
                <span>TỔNG PHỤ</span>
              </div>
              <div className="flex items-center justify-between py-[2rem] border-b-[.1rem] border-b-[#c6c6c6]">
                <span>Tổng phụ</span>
                <span>{handleTotalPrice}</span>
              </div>
              <div className="flex items-center justify-between py-[2rem] border-b-[.1rem] border-b-[#c6c6c6]">
                <span>Giao hàng</span>
                <span>Giao hàng miễn phí</span>
              </div>
              <div className="flex items-center justify-between py-[2rem]">
                <span>TỔNG</span>
                <span className="text-[1.8rem] text-[red]">
                  {handleTotalPrice}
                </span>
              </div>
              <div className="">
                <div className="block text-[1.6rem] font-bold pb-[.5rem]">
                  Hình thức nhận hàng
                </div>
                <select
                  name=""
                  id=""
                  value={orderType}
                  className="w-full outline-none h-[4.5rem] rounded-[.5rem] pl-[1.5rem] mt-[.5rem] text-[1.5rem] border-[.1rem]"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="" hidden>
                    Vui lòng lựa hình thức nhận hàng
                  </option>
                  <option value="eat_on_site">Ăn tại chỗ</option>
                  <option value="take_wake">Mang đi</option>
                </select>
              </div>
              <div className="mt-[2rem]">
                <label className="block text-[1.6rem] font-bold pb-[.5rem]">
                  Phương thức thanh toán
                </label>
                <div className="flex items-center gap-[1rem] mt-[1rem]">
                  <div className="w-[1.6rem] h-[1.6rem] flex justify-center items-center border-[.1rem] border-[#9e9e9e]">
                    <FontAwesomeIcon icon={faCheck} className="text-[1.2rem]" />
                  </div>
                  <input
                    type="checkbox"
                    name="paymentMethod"
                    value="vnpay"
                    id="vnpay"
                    hidden
                  />
                  <label htmlFor="vnpay">Thanh toán qua ví MOMO</label>
                </div>
              </div>
              <div
                className="w-full h-[4.5rem] flex justify-center items-center rounded-[.5rem] text-[#fff] bg-[#e33636] mt-[2rem] hover:bg-[red] transition-all duration-[.25s] cursor-pointer"
                onClick={() => handleSetShowInfoPayment()}
              >
                THANH TOÁN
              </div>
              <Link
                to={`/category-dish`}
                className="w-full h-[4.5rem] flex justify-center items-center rounded-[.5rem] text-[#fff] bg-[#dbdbdb] mt-[2rem] hover:bg-[#c0c0c0] transition-all duration-[.25s] cursor-pointer"
              >
                HỦY
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showWarnLogin && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#5c5c5c2b] z-[999]">
          <div className="relative w-auto h-auto p-[4rem] rounded-[1rem] bg-[#fff] shadow-2xl">
            <div className="text-[1.8rem] text-[red]">
              Bạn chưa đăng nhập! Vui lòng đăng nhập để thanh toán.
            </div>
            <span
              className="absolute top-[1rem] w-[2rem] h-[2rem] rounded-[.3rem] bg-[#e8e8e8] right-[1rem] flex justify-center items-center"
              onClick={() => setShowWarnLogin(false)}
            >
              <FontAwesomeIcon icon={faXmark} className="" />
            </span>
            <div className="flex items-center justify-center gap-[1rem] mt-[2rem]">
              <button
                className="w-auto px-[2rem] h-[4rem] bg-[#cdcdcd] rounded-[.5rem] transition-all duration-[.25s] select-none cursor-pointer"
                onClick={() => setShowWarnLogin(false)}
              >
                Không
              </button>
              <Link
                to={`/login?redirect=/payment-dish`}
                className="w-auto px-[2rem] h-[4rem] bg-[#ff2b2b] rounded-[.5rem] hover:bg-[red] text-[#fff] transition-all duration-[.25s] select-none cursor-pointer flex justify-center items-center"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      )}
      {showInfoPayment && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#5d5d5d5f] z-[999]">
          <div className="relative w-[55rem] text-center h-auto p-[5rem] rounded-[1rem] bg-[#fff] shadow-2xl">
            <div className="text-[1.8rem] text-[#e67e22]">
              Đã xác nhận đơn hàng, tiếp tục chuyển đến trang thanh toán của
              MOMO
            </div>
            <span
              className="absolute top-[1rem] w-[2rem] h-[2rem] rounded-[.3rem] bg-[#e8e8e8] right-[1rem] flex justify-center items-center"
              onClick={() => setShowInfoPayment(false)}
            >
              <FontAwesomeIcon icon={faXmark} className="" />
            </span>
            <div className="flex items-center justify-center gap-[1rem] mt-[2rem]">
              <button
                className="w-auto px-[2rem] h-[4rem] bg-[#cdcdcd] text-[#fff] rounded-[.5rem] transition-all duration-[.25s] select-none cursor-pointer"
                onClick={() => setShowInfoPayment(false)}
              >
                Không
              </button>
              <Link
                to={`/login?redirect=/payment-dish`}
                className="w-auto px-[2rem] h-[4rem] bg-[#028900] rounded-[.5rem] hover:bg-[#066e00] text-[#fff] transition-all duration-[.25s] select-none cursor-pointer flex justify-center items-center"
                onClick={() => handlePaymentMomo()}
              >
                Đồng ý
              </Link>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default PayDish;
