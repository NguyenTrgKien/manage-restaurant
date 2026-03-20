import {
  faCaretLeft,
  faCaretRight,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function PaymentFail() {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [login, setLogin] = useState({});

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

  const handleRedirectLocal = () => {
    // Kiểm tra nếu đang chạy trên ngrok thì chuyển về localhost
    if (window.location.hostname.includes("ngrok-free.app")) {
      window.location.href = "http://localhost:5173/category-dish";
    }
  };

  useEffect(() => {
    // Lấy query params từ URL
    const searchParams = new URLSearchParams(location.search);
    const data = {
      partnerCode: searchParams.get("partnerCode"),
      orderId: searchParams.get("orderId"),
      requestId: searchParams.get("requestId"),
      amount: searchParams.get("amount"),
      message: searchParams.get("message"),
      resultCode: searchParams.get("resultCode"),
      transId: searchParams.get("transId"),
      payType: searchParams.get("payType"),
    };

    setPaymentData(data);
  }, [location.search]);

  const handleRedirect = (redirect) => {
    if (window.location.hostname.includes("ngrok-free.app")) {
      window.location.href = `http://localhost:5173/${redirect}`;
    }
  };

  return (
    <div className="w-full h-[100vh] bg-[#ffff]">
      <Header login={login} setLogin={setLogin} isBg={true} />
      <div className="w-full h-auto pt-[9.5rem] px-[20rem]">
        <div className="text-[2.5rem] font-bold text-[#009a00]">
          Kết Quả Thanh Toán
        </div>
        <div className="mt-[9rem] text-center">
          <div className="w-[7rem] h-[7rem] flex justify-center items-center mx-auto mb-[2rem] bg-[#ff4545] rounded-[50%] ">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[#ffffff] text-[2.8rem]"
            />
          </div>
          <div className="text-[2.8rem] mb-[.5rem] font-bold text-[#ff4545]">
            Thanh toán thất bại
          </div>
          <p>Đơn hàng của quý khách không thể hoàn tất thanh toán</p>
          <div className="flex justify-between items-center mt-[10rem]">
            <div
              className="w-[18rem] h-[4rem] rounded-[.5rem] flex justify-center items-center gap-[.5rem] text-[#585858] bg-[#e7e7e7] cursor-pointer"
              onClick={() => handleRedirect("")}
            >
              <FontAwesomeIcon icon={faCaretLeft} className="text-[#585858]" />
              Quay về trang chủ
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
