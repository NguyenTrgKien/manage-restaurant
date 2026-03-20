import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultCode = params.get("resultCode");
    const message = params.get("message");
    const orderId = params.get("orderId");
    const amount = params.get("amount");
    if (resultCode === "0") {
      // Nếu thanh toán thành công, chuyển hướng đến trang thành công
      navigate(`/payment-success?orderId=${orderId}&amount=${amount}`);
    } else {
      // Nếu thất bại, chuyển hướng đến trang thất bại
      navigate(`/payment-fail?message=${message}`);
    }
  }, [location, navigate]);

  return <h2>Đang xử lý thanh toán... hihihihihihihi</h2>;
}

export default PaymentResult;
