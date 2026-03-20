import { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import moment from "moment"; // Thư viện moment giúp định dạng ngày tháng và giờ
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCaretLeft,
  faCheck,
  faStar,
  faTable,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";

const statusMap = {
  PENDING: "Chờ xác nhận",
  WAITPAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
  PREPARING: "Đang chuẩn bị",
  CONFIRM: "Đã xác nhận",
  READY: "Đã sẵn sàng phục vụ",
  CHECKED_IN: "Khách đã đến",
  COMPLETED: "Đã hoàn thành",
  NO_SHOW: "Khách không đến",
  FAILED: "Thất bại",
};

function InfoUserOrder() {
  const navigate = useNavigate();
  const [dataHistory, setDataHistory] = useState([]);
  const [listEvaluate, setListEvaluate] = useState([]);
  const [dataOrderTable, setDataOrderTable] = useState([]);
  const [currentHistory, setCurrentHistory] = useState("order");
  const elementOrder = useRef();
  const [showEvaluate, setShowEvaluate] = useState(null);
  const [evaluateProduct, setEvaluateProduct] = useState({});
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCanceledOrder, setIsCancel] = useState(null);
  const [isCancelOrderTable, setIsCancelOrderTable] = useState(null);
  const [cancelIsSuccess, setCancelIsSuccess] = useState(false);
  const [isOpenEvaluateSuccess, setIsOpenEvaluateSuccess] = useState(false);

  useEffect(() => {
    if (elementOrder.current) {
      setCurrentProgress(elementOrder.current);
    }
  }, []);

  const getOrderHistory = async () => {
    try {
      if (!login || !login.id) {
        setDataHistory([]);
      } else {
        const dataResponse = await getUserOrderHistory(login.id);
        const dataOrderTable = await getUserOrderTableForUser(login.id);
        const listEvaluate = await getListEvaluate(login.id);
        if (
          dataResponse.errCode === 0 &&
          dataOrderTable.errCode === 0 &&
          listEvaluate.errCode === 0
        ) {
          const sortData = dataResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          const sortDataTable = dataOrderTable.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setDataHistory(sortData);
          setDataOrderTable(sortDataTable);
          setListEvaluate(listEvaluate.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, [login?.id]);

  const handleSetCurrentProgress = ({ currentTarget }) => {
    setCurrentProgress(currentTarget);
  };

  const handleOpenEvaluate = (item) => {
    let initReviews = item.OrderItems.map((it) => {
      return {
        scoreEvaluate: 5,
        foodId: it.Food.id,
        comment: "",
      };
    });
    setEvaluateProduct({
      userId: login.id,
      orderId: item.id,
      reviews: initReviews,
    });
    setShowEvaluate(item);
  };

  const handleUpdateEvaluate = (foodId, field, value) => {
    setEvaluateProduct((prev) => {
      const updateReview = prev.reviews.map((it) => {
        return it.foodId === foodId ? { ...it, [field]: value } : it;
      });
      return { ...prev, reviews: updateReview };
    });
  };
  const handlePostEvaluate = async () => {
    if (!login.id) {
      return;
    }
    try {
      const message = await postEvaluate(evaluateProduct);
      if (message.errCode === 0) {
        setIsOpenEvaluateSuccess(true);
        setShowEvaluate(false);
        setTimeout(() => {
          setIsOpenEvaluateSuccess(false);
        }, 500);
        getOrderHistory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCanceledOrder = async (order) => {
    try {
      const message = await handleCancelOrder(order.id);
      if (message.errCode === 0) {
        setCancelIsSuccess(true);
        getOrderHistory();
        setIsCancel(false);
        setTimeout(() => {
          setCancelIsSuccess(false);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelTable = async (orderTableId) => {
    try {
      const message = await handleCancelOrderTable(orderTableId);
      if (message.errCode === 0) {
        setCancelIsSuccess(true);
        getOrderHistory();
        setIsCancel(false);
        setTimeout(() => {
          setCancelIsSuccess(false);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto">
      <Header login={login} setLogin={setLogin} isShowCart={true} isBg={true} />
      <div className="w-full min-h-[calc(100vh-25rem)] px-[2rem] md:px-[5rem] lg:px-[10rem] xl:px-[20rem] pt-[9.5rem] md:pt-[10.8rem]">
        <h2 className="text-[3.4rem] font-bold text-green-800">
          Lịch sử giao dịch
        </h2>
        <Link
          to={`/`}
          className="mt-[1rem] w-[16rem] h-[3rem] flex justify-center gap-[.5rem] items-center rounded-[.5rem] bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <FontAwesomeIcon icon={faCaretLeft} className="text-[#5b5b5b]" />
          Quay về trang chủ
        </Link>
        <div className="relative flex items-center gap-[2rem] mt-[2rem] pb-[1rem] border-b border-b-gray-300">
          <span
            className={`cursor-pointer select-none ${currentHistory === "order" ? "text-green-700" : "text-gray-700"}`}
            ref={elementOrder}
            onClick={(e) => {
              handleSetCurrentProgress(e);
              setCurrentHistory("order");
            }}
          >
            Đặt món
          </span>
          <span
            className={`cursor-pointer select-none ${currentHistory === "orderTable" ? "text-green-700" : "text-gray-700"}`}
            onClick={(e) => {
              handleSetCurrentProgress(e);
              setCurrentHistory("orderTable");
            }}
          >
            Đặt bàn
          </span>
          <span
            className={`cursor-pointer select-none ${currentHistory === "all" ? "text-green-700" : "text-gray-700"}`}
            onClick={(e) => {
              handleSetCurrentProgress(e);
              setCurrentHistory("all");
            }}
          >
            Combo đặt bàn + đặt món
          </span>
          <div
            className={`absolute bottom-0 h-[.5rem] rounded-full bg-green-600 transition-all duration-[.35s]`}
            style={{
              width: currentProgress.offsetWidth,
              left: currentProgress.offsetLeft,
            }}
          ></div>
        </div>
        {login.id ? (
          <div className="flex flex-col gap-[4rem] mt-[2rem]">
            {currentHistory === "order"
              ? dataHistory
                  .filter((it) => !it.OrderTable)
                  .map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={`w-full h-auto p-[2rem] rounded-[.5rem] border-[.1rem] border-gray-300 shadow-xl shadow-gray-200`}
                      >
                        <div className="flex md:flex-row flex-col items-start justify-between">
                          <div className="flex flex-col">
                            <span className="font-bold text-[1.4rem] text-gray-700">
                              Mã đơn hàng: {item.id}
                            </span>
                            <span className="text-gray-600">
                              📅Ngày thanh toán:{" "}
                              {moment(item.createdAt).format("DD/MM/YYYY")}
                            </span>
                            <span className="text-gray-600">
                              💳Phương thức thanh toán:{" "}
                              {item.paymentMethod === "HERE"
                                ? "Tại nhà hàng"
                                : "Ví MOMO"}
                            </span>
                          </div>
                          <div className="flex flex-col md:items-end">
                            <div className="flex items-center text-gray-700 gap-[.5rem]">
                              💰Tổng tiền:
                              <span className="text-[red] pl-[.5rem]">
                                {Number(item.totalAmount).toLocaleString(
                                  "vi-VN",
                                  {
                                    maximumFractionDigits: 3,
                                    minimumFractionDigits: 3,
                                  },
                                )}
                                đ
                              </span>
                            </div>
                            <span className="flex gap-[.5rem] items-center text-[1.4rem] text-gray-700">
                              <strong>Trạng thái:</strong>
                              {
                                <span
                                  className={`${item.status === "PAID" ? "text-green-500" : "text-amber-500"}`}
                                >
                                  {statusMap[item.status]}
                                </span>
                              }
                            </span>
                            {item?.status && item.status === "WAITPAYMENT" && (
                              <p className="text-red-500">
                                ⚠️Vui lòng đến quầy thu ngân đê thanh toán
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-gray-700">
                          {" "}
                          Danh sách món ăn:
                        </p>
                        <div
                          key={item.id}
                          className="w-full max-h-[20rem] overflow-y-scroll removeScrollbar md:h-auto grid md:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]  mt-[1rem]"
                        >
                          {item.OrderItems.length > 0 &&
                            item.OrderItems.map((it) => {
                              return (
                                <div
                                  key={it.id}
                                  className="w-full h-[6rem] flex justify-between items-center pl-[1rem] pr-[2rem] bg-gray-100 rounded-[.5rem]"
                                >
                                  <div
                                    className="flex items-center gap-[1.5rem] rounded-[.5rem] cursor-pointer"
                                    onClick={() => {
                                      navigate(`/detail-food`, {
                                        state: {
                                          food: it.Food,
                                          redirect: "/info-user-order",
                                        },
                                      });
                                    }}
                                  >
                                    <img
                                      src={`http://localhost:3000/${it.Food.image}`}
                                      alt="img"
                                      className="w-[4rem] h-[4rem] rounded-[50%] object-cover"
                                    />
                                    <div className="flex flex-col">
                                      <h4 className="text-[1.4rem] font-bold text-gray-700 maxlineOne">
                                        {it.Food.dishName}
                                      </h4>
                                      <span className="text-[1.2rem] text-gray-600">
                                        Giá: {it.Food.price}đ
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[1.4rem] pl-[1.5rem] text-green-700">
                                    x{it?.quantityOrder}
                                  </span>
                                </div>
                              );
                            })}
                        </div>

                        <div className="flex items-center justify-end gap-[2rem] mt-[2rem]">
                          {item.status === "PAID" ? (
                            listEvaluate.some(
                              (evaluate) => evaluate.orderId === item.id,
                            ) ? (
                              <div className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-gray-200 text-gray-700 rounded-[.5rem] hover:bg-gray-300 transition-all duration-[.3s] cursor-pointer mt-[1rem]">
                                Đã đánh giá
                              </div>
                            ) : (
                              <div
                                className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-red-500 text-white rounded-[.5rem] hover:bg-red-600 transition-all duration-[.3s] cursor-pointer mt-[1rem]"
                                onClick={() => handleOpenEvaluate(item)}
                              >
                                Viết đánh giá
                              </div>
                            )
                          ) : item.paymentMethod === "MOMO" &&
                            item.status === "PENDING" ? (
                            <div className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-gray-200 text-gray-600 rounded-[.5rem] transition-all duration-[.3s] cursor-pointer mt-[1rem]">
                              Thanh toán thất bại, đơn sẽ hủy sau 5 phút
                            </div>
                          ) : (
                            item.status !== "CANCELLED" && (
                              <div
                                className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-gray-200 text-gray-600 rounded-[.5rem] hover:bg-gray-400 transition-all duration-[.3s] cursor-pointer mt-[1rem]"
                                onClick={() => setIsCancel(item)}
                              >
                                Hủy đơn hàng
                              </div>
                            )
                          )}
                          {item.status !== "CANCELLED" ? (
                            <div
                              className="text-[1.5rem] px-[1rem] py-[.5rem] text-end underline text-blue-400 hover:text-blue-500 transition-all duration-[.3s] cursor-pointer mt-[1rem]"
                              onClick={() => {
                                navigate(`/detail-order`, {
                                  state: {
                                    orderId: item.id,
                                  },
                                });
                              }}
                            >
                              Xem chi tiết{" "}
                              <FontAwesomeIcon icon={faArrowRightLong} />
                            </div>
                          ) : (
                            <div className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-gray-400 text-white rounded-[.5rem] hover:bg-gray-500 transition-all duration-[.3s] cursor-pointer mt-[1rem]">
                              Đã hủy
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              : currentHistory === "orderTable"
                ? dataOrderTable.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="w-full h-auto border border-gray-200 rounded-[1rem] shadow-xl shadow-gray-100 p-[2rem]"
                      >
                        <div className="">
                          <h3 className="text-[1.4rem] font-bold text-gray-700">
                            ĐƠN ĐẶT BÀN
                          </h3>
                        </div>
                        <div className="text-[1.4rem] text-gray-600">
                          Mã đơn: {item.id}
                        </div>
                        <div className="text-center mb-[1rem]">
                          <p className="text-gray-500 text-[1.4rem]">
                            📅 Ngày đặt
                          </p>
                          <p className="text-gray-700">
                            {moment(item.createdAt).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        <div className="bg-cyan-50 p-[2rem] mb-[2rem]">
                          <h4 className="text-blue-700 font-bold">
                            THÔNG TIN BÀN
                          </h4>
                          <div>
                            <span className="text-gray-700">
                              📅 Ngày dùng bữa dự kiến:{" "}
                              {moment(item.orderDate).format("DD/MM/YYYY")}
                            </span>
                          </div>
                          <div className="flex items-center gap-[.5rem]">
                            <FontAwesomeIcon
                              icon={faUsers}
                              className="text-blue-400"
                            />
                            <span className="text-gray-700">
                              Số khách: {item.numberGuests}
                            </span>
                          </div>
                          <div className="flex items-center gap-[.5rem]">
                            <FontAwesomeIcon
                              icon={faTable}
                              className="text-blue-400"
                            />
                            <span className="text-gray-700">
                              Bàn: {item.Table.tableName}
                            </span>
                          </div>
                        </div>
                        <div className="pt-[1rem] border-t flex items-center justify-between border-t-gray-400">
                          <span className="text-gray-600 text-[1.4rem]">
                            Trạng thái:{" "}
                            <span
                              className=" text-amber-500
                                                    "
                            >
                              {statusMap[item.status]}
                            </span>
                          </span>

                          <div className="flex items-center gap-[2rem]">
                            {item.status !== "CANCELLED" ? (
                              <div
                                className="px-[1rem] py-[.5rem] bg-rose-500 text-white hover:bg-rose-600 rounded-[.5rem] cursor-pointer"
                                onClick={() => setIsCancelOrderTable(item.id)}
                              >
                                Hủy đơn
                              </div>
                            ) : (
                              <div className="px-[1rem] py-[.5rem] bg-gray-200 text-gray-600 rounded-[.5rem] cursor-pointer">
                                Đã hủy
                              </div>
                            )}
                            <div
                              className="text-[1.5rem] text-end underline text-blue-400 hover:text-blue-500 transition-all duration-[.3s] cursor-pointer"
                              onClick={() => {
                                navigate(`/detail-order`, {
                                  state: {
                                    orderTableId: item.id,
                                  },
                                });
                              }}
                            >
                              Xem chi tiết{" "}
                              <FontAwesomeIcon icon={faArrowRightLong} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : dataHistory
                    .filter((it) => it.OrderTable)
                    .map((item) => {
                      return (
                        <div
                          key={item.id}
                          className={`w-full h-auto p-[2rem] rounded-[.5rem] border-[.1rem] border-gray-300 shadow-xl shadow-gray-200`}
                        >
                          <div className="flex md:flex-row flex-col items-start justify-between">
                            <div className="flex flex-col">
                              <span className="font-bold text-[1.4rem] text-gray-700">
                                Mã đơn hàng: {item.id}
                              </span>
                              <span className="text-gray-600">
                                📅Ngày đặt hàng:{" "}
                                {moment(item.createdAt).format("DD/MM/YYYY")}
                              </span>
                              <span className="text-gray-600">
                                📅Ngày dùng bữa dự kiên:{" "}
                                {moment(item.OrderTable.orderDate).format(
                                  "DD/MM/YYYY",
                                )}
                              </span>
                              <span className="text-gray-600">
                                🏷️Bàn: {item.OrderTable.Table.tableName}
                              </span>
                              <span className="text-gray-600">
                                👥Số lượng người: {item.OrderTable.numberGuests}
                              </span>
                              <span className="text-gray-600">
                                💳Phương thức thanh toán:{" "}
                                {item.paymentMethod === "HERE"
                                  ? "Tại nhà hàng"
                                  : "Ví MOMO"}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center text-gray-700 gap-[.5rem]">
                                💰Tổng tiền:
                                <span className="text-[red] pl-[.5rem]">
                                  {Number(item.totalAmount).toLocaleString(
                                    "vi-VN",
                                    {
                                      maximumFractionDigits: 3,
                                      minimumFractionDigits: 3,
                                    },
                                  )}
                                  đ
                                </span>
                              </div>
                              <span className="flex gap-[.5rem] items-center text-[1.4rem] text-gray-700">
                                <strong>Trạng thái:</strong>
                                {
                                  <span
                                    className={`${item.status === "PAID" ? "text-green-500" : "text-amber-500"}`}
                                  >
                                    {statusMap[item.status]}
                                  </span>
                                }
                              </span>
                              {item?.status &&
                                item.status === "WAITPAYMENT" && (
                                  <p className="text-[red]">
                                    ⚠️Vui lòng đến quầy thu ngân đê thanh toán
                                  </p>
                                )}
                            </div>
                          </div>
                          <p className="font-bold text-gray-700">
                            {" "}
                            Danh sách món ăn đặt trước:
                          </p>
                          <div
                            key={item.id}
                            className="w-full h-[20rem] overflow-y-scroll removeScrollbar md:h-auto grid md:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]  mt-[1rem]"
                          >
                            {item.OrderItems.length > 0 &&
                              item.OrderItems.map((it) => {
                                return (
                                  <div
                                    key={it.id}
                                    className="w-full h-[6rem] flex justify-between items-center pl-[1rem] pr-[2rem] bg-gray-100 rounded-[.5rem]"
                                  >
                                    <div
                                      className="flex items-center gap-[1.5rem] rounded-[.5rem] cursor-pointer"
                                      onClick={() => {
                                        navigate(`/detail-food`, {
                                          state: {
                                            food: it.Food,
                                            redirect: "/info-user-order",
                                          },
                                        });
                                      }}
                                    >
                                      <img
                                        src={`http://localhost:3000/${it.Food.image}`}
                                        alt="img"
                                        className="w-[4rem] h-[4rem] rounded-[50%] object-cover"
                                      />
                                      <div className="flex flex-col">
                                        <h4 className="text-[1.4rem] font-bold text-gray-700 maxlineOne">
                                          {it.Food.dishName}
                                        </h4>
                                        <span className="text-[1.2rem] text-gray-600 ">
                                          Giá: {it.Food.price}đ
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[1.4rem] pl-[1.5rem] text-green-700">
                                      x{it?.quantityOrder}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="flex items-center justify-end gap-[2rem] mt-[2rem]">
                            {item.status === "PAID" &&
                              (listEvaluate.some(
                                (evaluate) => evaluate.orderId === item.id,
                              ) ? (
                                <div className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-gray-200 text-gray-700 rounded-[.5rem] hover:bg-gray-300 transition-all duration-[.3s] cursor-pointer mt-[1rem]">
                                  Đã đánh giá
                                </div>
                              ) : (
                                <div
                                  className="text-[1.5rem] text-end px-[1rem] py-[.5rem] bg-red-500 text-white rounded-[.5rem] hover:bg-red-600 transition-all duration-[.3s] cursor-pointer mt-[1rem]"
                                  onClick={() => handleOpenEvaluate(item)}
                                >
                                  Viết đánh giá
                                </div>
                              ))}
                            <div
                              className="text-[1.5rem] px-[1rem] py-[.5rem] text-end underline text-blue-400 hover:text-blue-500 transition-all duration-[.3s] cursor-pointer mt-[1rem]"
                              onClick={() => {
                                navigate(`/detail-order`, {
                                  state: {
                                    orderId: item.id,
                                  },
                                });
                              }}
                            >
                              Xem chi tiết{" "}
                              <FontAwesomeIcon icon={faArrowRightLong} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
          </div>
        ) : (
          <div className="flex justify-center items-center mt-[15rem] ">
            <div className="w-[20rem] flex justify-center items-center rounded-full text-white h-[5rem] bg-amber-500">
              Bạn chưa đăng nhập
            </div>
          </div>
        )}
      </div>
      {showEvaluate && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#44444464] z-[950]">
          <div className="relative w-auto h-auto bg-white rounded-[.5rem] p-[2.8rem]">
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute text-[2rem] top-[1rem] right-[1rem] text-gray-600 cursor-pointer"
              onClick={() => {
                setShowEvaluate(false);
              }}
            />
            <h5 className="text-[2rem] text-gray-700 font-bold">
              Đánh giá món ăn
            </h5>
            <div className="w-auto max-h-[48rem] overflow-y-scroll mt-[1rem]">
              {showEvaluate.OrderItems.map((it) => {
                return (
                  <div
                    key={it.id}
                    className="p-[2rem] mb-[2rem] border border-gray-300 rounded-[1rem]"
                  >
                    <div className="flex items-center gap-[1rem]">
                      <img
                        src={`http://localhost:3000/${it.Food.image}`}
                        alt="img"
                        className="w-[4rem] h-[4rem] object-cover rounded-full"
                      />
                      <h4 className="text-gray-700 font-bold">
                        {it.Food.dishName}
                      </h4>
                    </div>
                    <p className="my-[.5rem]">Bạn chấm món này mấy sao?</p>
                    <div className="flex items-center gap-[.5rem] mb-[2rem]">
                      {[1, 2, 3, 4, 5].map((star) => {
                        return (
                          <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={`${evaluateProduct.reviews.find((value) => value.foodId === it.Food.id)?.scoreEvaluate >= star ? "text-yellow-500" : "text-gray-400"} `}
                            onClick={() => {
                              handleUpdateEvaluate(
                                it.Food.id,
                                "scoreEvaluate",
                                star,
                              );
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="">
                      <label>Nhận xét của bạn về món ăn</label>
                      <textarea
                        placeholder="Món ăn có ngon không? Có gì đặt biệt không?"
                        className="w-full h-[5rem] rounded-[.5rem] border border-gray-400 outline-none p-[1rem]"
                        onChange={(e) => {
                          handleUpdateEvaluate(
                            it.Food.id,
                            "comment",
                            e.target.value,
                          );
                        }}
                      ></textarea>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-[1rem] flex justify-end items-center gap-[1rem]">
              <button
                className="px-[1rem] py-[.5rem] bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-[.5rem]"
                onClick={() => setShowEvaluate(false)}
              >
                Hủy
              </button>
              <button
                className="px-[1rem] py-[.5rem] bg-red-500 text-white hover:bg-red-600 rounded-[.5rem]"
                onClick={() => handlePostEvaluate()}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpenEvaluateSuccess && (
        <div className="fixed inset-0 bg-[#3f3f3f73] flex justify-center items-center">
          <div className="min-w-[10rem] h-auto rounded-[.5rem] flex flex-col gap-[1rem] justify-center items-center bg-[#fff] px-[5rem] py-[3rem] text-[2rem] shadow-2xl">
            <div className="flex justify-center items-center w-[5rem] h-[5rem] border border-gray-400 focus:ring-2 focus:ring-amber-300 rounded-[50%]">
              <FontAwesomeIcon icon={faCheck} className="text-[#05b405]" />
            </div>
            Gửi đánh giá thành công!
            <div
              className="w-[8rem] h-[4rem] flex justify-center items-center bg-[#3a84d3] rounded-[1rem] text-[#fff] border-[.3rem] text-[1.5rem] cursor-pointer border-[#98dbff]"
              onClick={() => setIsOpenEvaluateSuccess(false)}
            >
              Ok
            </div>
          </div>
        </div>
      )}
      {isCanceledOrder && (
        <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
          <div className="w-auto h-auto relative bg-[#fff] rounded-[1rem] p-[6rem]">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[1.8rem] absolute top-[1rem] right-[1rem] p-[.5rem] bg-[#e6e6e6] text-[#767676] rounded-[.5rem]"
              onClick={() => setIsCancel(null)}
            />
            <div className="text-[2rem] text-center font-bold text-blue-700">
              Bạn muốn hủy đơn hàng?
            </div>
            <p className="mt-[1rem] text-center text-gray-600">
              Hãy cho chúng tôi biết lý do bạn muốn hủy đơn hàng!
            </p>
            <textarea
              className="mt-[1.5rem] w-full h-[10rem] rounded-[.5rem] p-[1rem] border border-gray-400 focus:ring-2 focus:ring-cyan-300 outline-none"
              placeholder="Nhập lý do hủy..."
            ></textarea>
            <div className="flex items-center gap-[1.5rem] justify-center mt-[2rem]">
              <button
                className="px-[2rem] py-[1rem] bg-[#e7e7e7] rounded-[.8rem] hover:opacity-[.8] cursor-pointer"
                onClick={() => setIsCancel(null)}
              >
                Quay lại
              </button>
              <button
                className="px-[2rem] py-[1rem] bg-green-600 text-[#fff] rounded-[.8rem] hover:opacity-[.8] cursor-pointer"
                onClick={() => handleCanceledOrder(isCanceledOrder)}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {cancelIsSuccess && (
        <div className="fixed flex justify-center items-center inset-0 z-[400] bg-[#50505052]">
          <div className="w-[40rem] h-auto py-[3rem] flex flex-col items-center gap-[1.5rem] bg-[#fff] rounded-[1rem] text-[2rem] font-bold">
            <FontAwesomeIcon
              icon={faCheck}
              className="p-[2rem] rounded-[50%] border-[.2rem] text-[#00be00] border-[#00be00]"
            />
            Hủy đơn hàng thành công!
          </div>
        </div>
      )}
      {isCancelOrderTable && (
        <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
          <div className="w-auto h-auto relative bg-[#fff] rounded-[1rem] p-[6rem]">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[1.8rem] absolute top-[1rem] right-[1rem] p-[.5rem] bg-[#e6e6e6] text-[#767676] rounded-[.5rem]"
              onClick={() => setIsCancelOrderTable(null)}
            />
            <div className="text-[2rem] text-center font-bold text-blue-700">
              Bạn muốn hủy đơn hàng?
            </div>
            <div className="flex items-center gap-[1.5rem] justify-center mt-[2rem]">
              <button
                className="px-[2rem] py-[1rem] bg-[#e7e7e7] rounded-[.8rem] hover:opacity-[.8] cursor-pointer"
                onClick={() => setIsCancelOrderTable(null)}
              >
                Quay lại
              </button>
              <button
                className="px-[2rem] py-[1rem] bg-green-600 text-[#fff] rounded-[.8rem] hover:opacity-[.8] cursor-pointer"
                onClick={() => handleCancelTable(isCanceledOrderTable)}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default InfoUserOrder;
