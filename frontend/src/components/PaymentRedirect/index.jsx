import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function RedirectIfPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.search.includes("partnerCode=MOMO")) {
      // Kiểm tra xem đường đãn có chứa partnerCode="MOMO" không nếu có thì chuyển hướng nó về trang payment-success để hiển thị thông tin giao dịch như thế nào
      navigate("/payment-success" + location.search, { replace: true });
    }
  }, [location, navigate]);

  const handleHomeClick = () => {
    navigate("/"); // Sử dụng navigate thay vì Link
  };

  return (
    <div className="w-full h-[100vh] bg-black flex flex-col items-center justify-center gap-4 text-center px-4">
      {/* Hiệu ứng số 404 */}
      <div className="relative">
        <h1 className="text-[10rem] sm:text-[12rem] md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 opacity-90">
          404
        </h1>
        <div className="absolute inset-0 bg-white mix-blend-overlay opacity-5 blur-md rounded-full"></div>
      </div>
      {/* Thông báo lỗi */}
      <h2 className="text-2xl sm:text-3xl font-medium text-gray-300">
        Page Not Found
      </h2>
      <p className="text-gray-400 max-w-md">
        The page you are looking for might have been removed, had its name
        changed or is temporarily unavailable.
      </p>
      // {/* Nút quay về */}
      <button
        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium  cursor-pointer hover:shadow-xl shadow-not-found"
        onClick={() => {
          handleHomeClick();
        }}
      >
        Về trang chủ
      </button>
    </div>
  );
}

export default RedirectIfPayment;
