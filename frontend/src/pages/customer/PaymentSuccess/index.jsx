import {
  faCaretLeft,
  faCaretRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function PaymentSuccess() {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [login, setLogin] = useState({});
  const navigate = useNavigate();

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
          <div className="w-[7rem] h-[7rem] flex justify-center items-center mx-auto mb-[2rem] bg-[#2ddf2d] rounded-[50%] ">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-[#ffffff] text-[2.8rem]"
            />
          </div>
          <div className="text-[2.8rem] mb-[.5rem] font-bold text-[#006b00]">
            Thanh toán thành công
          </div>
          <p>Cảm ơn quý khách đã đặc bàn tại nhà hàng của chúng tôi.</p>
          <div className="flex justify-between items-center mt-[10rem]">
            <div
              className="w-[18rem] h-[4rem] rounded-[.5rem] flex justify-center items-center gap-[.5rem] text-[#585858] bg-[#e7e7e7] cursor-pointer"
              onClick={() => handleRedirect("")}
            >
              <FontAwesomeIcon icon={faCaretLeft} className="text-[#585858]" />
              Quay về trang chủ
            </div>
            <div
              className="w-[18rem] h-[4rem] rounded-[.5rem] flex justify-center items-center gap-[.5rem] text-[#585858] bg-[#e7e7e7] cursor-pointer"
              onClick={() => handleRedirect("info-user-order")}
            >
              Xem các đơn hàng
              <FontAwesomeIcon icon={faCaretRight} className="text-[#585858]" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
