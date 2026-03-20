import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { Link, useLocation } from "react-router";
import moment from "moment";
import Footer from "../../../components/Footer";
import {
  faClock,
  faInfoCircle,
  faTable,
  faUserGroup,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailOrder() {
  const [login, setLogin] = useState({});
  const location = useLocation();
  const typeOrder = location.state;
  const [dataDetailOrder, setDataDetailOrder] = useState({});
  const [dataDetailOrderTable, setDataDetailOrderTable] = useState({});
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

  const fetchDetailOrder = async () => {
    try {
      const response = await getDetailOrder(typeOrder.orderId);
      if (!response) {
        return;
      }
      setDataDetailOrder(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDetailOrderTable = async () => {
    try {
      const responseOrderTable = await getDetailOrderTable(
        typeOrder.orderTableId,
      );
      if (responseOrderTable.errCode === 0) {
        setDataDetailOrderTable(responseOrderTable.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeOrder.orderId) {
      fetchDetailOrder();
    } else {
      fetchDetailOrderTable();
    }
  }, [typeOrder.orderId, typeOrder.orderTableId]);

  return (
    <div className="w-full h-auto bg-gray-100 min-h-screen overflow-hidden">
      <Header login={login} setLogin={setLogin} isBg={true} />
      <div className="pt-[9.5rem] ">
        {dataDetailOrder?.id ? (
          <div className="w-[35%] h-auto mx-auto p-[2rem] bg-[#fff] rounded-[.5rem] shadow-2xl">
            <h3 className="text-center text-[2.4rem] font-bold text-green-800 mb-[2rem]">
              Chi tiết đơn hàng
            </h3>
            <div>
              <p className="text-gray-600">
                Mã đơn: <span>{dataDetailOrder.id}</span>
              </p>
              <p className="text-gray-600">
                Ngày đặt:{" "}
                <span>
                  {moment(dataDetailOrder.createdAt).format("DD/MM/YYYY")}
                </span>
              </p>
              <p>
                Phương thức thanh toán:{" "}
                <span>
                  Thanh toán{" "}
                  {dataDetailOrder?.paymentMethod === "HERE"
                    ? "tại nhà hàng"
                    : "ví MOMO"}
                </span>
              </p>
              <p>
                Trạng thái:{" "}
                <span
                  className={`${dataDetailOrder.status === "PAID" ? "text-green-500" : "text-red-500"}`}
                >
                  {dataDetailOrder.status === "CONFIRM"
                    ? "Chờ xác nhận"
                    : dataDetailOrder.status === "WAITPAYMENT"
                      ? "Chờ thanh toán"
                      : dataDetailOrder.status === "PAID"
                        ? "Đã thanh toán"
                        : dataDetailOrder.status === "CANCELLED"
                          ? "Đã hủy"
                          : dataDetailOrder.status === "PREPARING"
                            ? "Đang chuẩn bị"
                            : dataDetailOrder.status === "PENDING"
                              ? "Chưa thanh toán"
                              : "Đã sẵn sàn phục vụ"}
                </span>
              </p>
            </div>
            <p>Danh sách món ăn: </p>
            <div className="w-full max-h-[19rem] overflow-scroll removeScrollbar bg-gray-50 my-[1rem]">
              {dataDetailOrder?.OrderItems?.map((item) => {
                return (
                  <div
                    key={item?.Food.id}
                    className="flex items-center p-[1rem] border-b border-b-gray-400"
                  >
                    <img
                      src={`http://localhost:3000/${item?.Food.image}`}
                      alt="img"
                      className="w-[4rem] h-[4rem] object-cover"
                    />
                    <div className="flex flex-col pl-[1rem]">
                      <span className=" font-bold text-gray-700">
                        {item?.Food.dishName}
                      </span>
                      <span className="text-[1.2rem]">
                        Số lượng: {item?.quantityOrder}
                      </span>
                    </div>
                    <span className="ml-auto text-red-500">
                      {item?.Food.price.toLocaleString("vi-VN", {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 3,
                      })}
                      đ
                    </span>
                  </div>
                );
              })}
            </div>
            {dataDetailOrder.OrderTable && (
              <>
                <div>
                  <p className="text-gray-600">
                    Ngày đặt:{" "}
                    <span>
                      {moment(dataDetailOrder.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Ngày dùng bữa dự kiến:{" "}
                    <span>
                      {moment(dataDetailOrder.OrderTable.orderDate).format(
                        "DD/MM/YYYY",
                      )}
                    </span>
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mb-6 mt-[1rem]">
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <span className="w-[2rem]">
                      <FontAwesomeIcon icon={faTable} />
                    </span>
                    THÔNG TIN BÀN
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-[2rem]">
                        <FontAwesomeIcon
                          icon={faUserGroup}
                          className="text-blue-500"
                        />
                      </span>
                      <span>
                        Số khách: {dataDetailOrder.OrderTable.numberGuests}{" "}
                        người
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-[2rem]">
                        <FontAwesomeIcon
                          icon={faUtensils}
                          className="text-blue-500"
                        />
                      </span>
                      <span>
                        Bàn:{" "}
                        {dataDetailOrder.OrderTable.Table?.tableName ||
                          "Chưa chọn bàn"}
                      </span>
                    </div>

                    {dataDetailOrder.timeSlot && (
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-blue-500"
                        />
                        <span>Khung giờ: {}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <span className="block mt-[1rem]">
              <strong>Tổng tiền: </strong>{" "}
              <span className="text-red-500">
                {Number(dataDetailOrder?.totalAmount).toLocaleString("vi-VN", {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}
                đ
              </span>
            </span>
            <div className="flex items-center justify-center gap-[1rem] mt-[1rem]">
              <button className="px-[2rem] py-[.5rem] cursor-pointer bg-blue-500 rounded-[.5rem] text-white">
                In hóa đơn
              </button>
              <Link
                to={`/info-user-order`}
                className="px-[2rem] py-[.5rem] cursor-pointer bg-gray-200 rounded-[.5rem] text-gray-600"
              >
                Xem lịch sử đơn hàng
              </Link>
              <Link
                to={`/`}
                className="px-[2rem] py-[.5rem] cursor-pointer bg-green-500 rounded-[.5rem] text-white"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          dataDetailOrderTable && (
            <div className="w-[35%] h-auto mx-auto p-[2rem] bg-[#fff] rounded-[.5rem] shadow-2xl">
              <h3 className="text-center text-[2.4rem] font-bold text-green-800 mb-[2rem]">
                Chi tiết đơn hàng
              </h3>
              <div>
                <p className="text-gray-600">
                  Mã đơn: <span>{dataDetailOrderTable.id}</span>
                </p>
                <p className="text-gray-600">
                  Ngày đặt:{" "}
                  <span>
                    {moment(dataDetailOrderTable.createdAt).format(
                      "DD/MM/YYYY",
                    )}
                  </span>
                </p>
                <p className="text-gray-600">
                  Ngày dùng bữa dự kiến:{" "}
                  <span>
                    {moment(dataDetailOrderTable.orderDate).format(
                      "DD/MM/YYYY",
                    )}
                  </span>
                </p>
                <p>
                  Trạng thái:{" "}
                  <span
                    className={`${dataDetailOrderTable.status === "PAID" ? "text-green-500" : "text-red-500"}`}
                  >
                    {dataDetailOrderTable.status === "PENDING"
                      ? "Chờ xác nhận"
                      : dataDetailOrderTable.status === "WAITPAYMENT"
                        ? "Chờ thanh toán"
                        : dataDetailOrderTable.status === "PAID"
                          ? "Đã thanh toán"
                          : dataDetailOrderTable.status === "CANCELLED"
                            ? "Đã hủy"
                            : dataDetailOrderTable.status === "PREPARING"
                              ? "Đang chuẩn bị"
                              : dataDetailOrderTable.status === "CONFIRM"
                                ? "Đã xác nhận"
                                : "Đã sẵn sàn phục vụ"}
                  </span>
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 mt-[2rem]">
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <span className="w-[2rem]">
                    <FontAwesomeIcon icon={faTable} />
                  </span>
                  THÔNG TIN BÀN
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-[2rem]">
                      <FontAwesomeIcon
                        icon={faUserGroup}
                        className="text-blue-500"
                      />
                    </span>
                    <span>
                      Số khách: {dataDetailOrderTable.numberGuests} người
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-[2rem]">
                      <FontAwesomeIcon
                        icon={faUtensils}
                        className="text-blue-500"
                      />
                    </span>
                    <span>
                      Bàn:{" "}
                      {dataDetailOrderTable.Table?.tableName || "Chưa chọn bàn"}
                    </span>
                  </div>

                  {dataDetailOrderTable.timeSlot && (
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-blue-500"
                      />
                      <span>Khung giờ: {}</span>
                    </div>
                  )}
                </div>
              </div>
              {(!dataDetailOrderTable.OrderItems ||
                dataDetailOrderTable.OrderItems.length === 0) && (
                <div className="bg-amber-50 text-amber-700 p-3 rounded-full mb-6 text-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  Đơn này chỉ đặt bàn, không bao gồm món ăn
                </div>
              )}

              <div className="flex items-center justify-center gap-[1rem] mt-[1rem]">
                <button className="px-[2rem] py-[.5rem] cursor-pointer bg-blue-500 rounded-[.5rem] text-white">
                  In hóa đơn
                </button>
                <Link
                  to={`/info-user-order`}
                  className="px-[2rem] py-[.5rem] cursor-pointer bg-gray-200 rounded-[.5rem] text-gray-600"
                >
                  Xem lịch sử đơn hàng
                </Link>
                <Link
                  to={`/`}
                  className="px-[2rem] py-[.5rem] cursor-pointer bg-green-500 rounded-[.5rem] text-white"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DetailOrder;
