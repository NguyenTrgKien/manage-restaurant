import { useEffect, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";
import Footer from "../../../components/Footer";

function PaymentDishTable() {
  const navigate = useNavigate();
  const [responseDetailOrder, setResponseDetailOrder] = useState({});
  const product = [];
  const [login, setLogin] = useState({});
  const [methodPay, setMethodPay] = useState("HERE");
  const [openPaymentAtRestaurant, setOpenPaymentAtRestaurant] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [openOrderTableSuccess, setOpenOrderTableSuccess] = useState(false);

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

  const handleTotalPrice = useMemo(() => {
    if (product.length > 0) {
      const quantity = dataOrder?.quantityOrder || 1;
      return product.reduce((acc, curr) => {
        return acc + (Number(curr?.price) * quantity[curr.id] || 1);
      }, 0);
    }
    return 0;
  }, []);

  const handleBack = () => {
    navigate("/order-table", {
      replace: true,
    });
  };

  const handleOrderProduct = async () => {
    try {
      if (!dataOrder.paymentTable) return;
      const quantityOrder = dataOrder.quantityOrder;
      const totalPrice = dataOrder.paymentTable.product.reduce((acc, curr) => {
        return acc + (curr.price * quantityOrder[curr.id] || 1);
      }, 0);
      const order = {
        ...dataOrder.paymentTable.infoCustomer,
        tableId: dataOrder.paymentTable.infoCustomer.tableId.id,
        userId: dataOrder.paymentTable.userId.id,
        product,
        amount: Number(totalPrice),
        paymentMethod: methodPay,
        status: "PENDING",
        quantityOrder: quantityOrder,
      };
      if (methodPay === "MOMO") {
        if (dataOrder.paymentTable.product.length > 0) {
          const response = await postOrderDishTable(order);
          console.log(response);
          const redirectMomo = response.paymentUrl.payUrl;
          if (response.errCode === 0 && response.paymentUrl) {
            if (redirectMomo) {
              window.location.href = redirectMomo;
            }
          }
        }
      } else {
        if (dataOrder.paymentTabl.product.length > 0) {
          const response = await paymentAtRestaurant(order);
          console.log(response);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentTableAtRestaurant = async () => {
    const paymentTable = dataOrder?.paymentTable;
    try {
      if (!paymentTable) return;
      const quantityOrder = dataOrder.quantityOrder;
      const totalPrice = product.reduce((acc, curr) => {
        return acc + (curr.price * quantityOrder[curr.id] || 1);
      }, 0);
      const order = {
        ...paymentTable?.infoCustomer,
        tableId: paymentTable?.infoCustomer?.tableId?.id,
        userId: paymentTable?.userId?.id,
        product,
        amount: Number(totalPrice),
        paymentMethod: methodPay,
        status: "PENDING",
        quantityOrder: quantityOrder,
      };
      if (paymentTable?.product?.length > 0) {
        const response = await paymentTableAtRestaurant(order);
        console.log(response);
        if (response.errCode === 0) {
          setResponseDetailOrder(response.detailOrder);
          window.history.replaceState(null, "", "/order-table");
          setOpenPaymentAtRestaurant(true);
        } else {
          setErrMessage(response.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentMomo = async () => {
    try {
      if (!login || !login.id) {
        return;
      }
      if (!dataOrder.payment) return;
      const order = {
        product: product,
        amount: handleTotalPrice,
        paymentMethod: methodPay,
        status: "PENDING",
        userId: login.id,
        quantityOrder: dataOrder.quantityOrder,
        fullName: dataOrder.payment.fullName,
      };
      if (!dataOrder.payment.product) return;
      if (dataOrder.payment.product.length > 0) {
        const message = await postOrder(order);
        const redirectMomo = message.paymentUrl.payUrl;
        if (message.errCode === 0 && message.paymentUrl) {
          if (redirectMomo) {
            window.history.replaceState(null, "", "/order-table");
            window.location.href = redirectMomo;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentAtRestaurant = async () => {
    const payment = dataOrder?.payment;
    if (!payment) return;
    const quantityOrder = dataOrder?.quantityOrder || {};
    const totalPrice = product?.reduce((acc, curr) => {
      return acc + (curr.price * quantityOrder[curr.id] || 1);
    }, 0);
    if (!product?.length) return;
    const orderDate = payment?.valueInfoPayment?.orderDate || "";
    const order = {
      userId: dataOrder?.payment?.userId,
      product,
      amount: Number(totalPrice),
      paymentMethod: methodPay,
      status: "PENDING",
      orderDate: orderDate,
      quantityOrder: dataOrder.quantityOrder,
      fullName: payment?.fullName,
    };
    const response = await postPaymentAtRestaurant(order);
    console.log(response);
    if (!response && response.errCode !== 0) {
      console.log("Lỗi", response);
      return;
    }
    setResponseDetailOrder(response.detailOrder);
    setOpenPaymentAtRestaurant(true);
    window.history.replaceState(null, "", "/order-table");
    // dispatch(detailOrder({
    //     status: 'CONFIRM',
    //     product: product,
    //     orderDate: payment?.valueInfoPayment?.orderDate || dataOrder?.paymentTable?.valueInfoPayment?.orderDate,
    //     quantityOrder: payment?.quantityOrder || dataOrder?.paymentTable?.quantityOrder,
    //     paymentMethod: methodPay,
    //     table: dataOrder?.paymentTable?.infoCustomer?.tableId
    // }));
  };

  const handleOrderTable = async () => {
    const paymentTable = dataOrder?.paymentTable;
    if (!paymentTable) return;
    try {
      const order = {
        ...paymentTable?.infoCustomer,
        tableId: paymentTable?.infoCustomer?.tableId?.id,
        userId: paymentTable?.userId?.id,
        status: "PENDING",
      };
      const message = await orderTable(order);
      if (message.errCode === 0) {
        setOpenOrderTableSuccess(message.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <Header login={login} setLogin={setLogin} isBg={true} />
      <div className="px-[2rem] md:px-[5rem] lg:px-[10rem] xl:px-[20rem] pt-[9.5rem] md:pt-[10.8rem]">
        <h2 className="text-[3.4rem] hidden md:block font-bold text-green-800">
          Thanh toán
        </h2>
        <div className="flex md:flex-row flex-col-reverse md:gap-0 gap-[1rem] md:items-center md:mt-[2rem]">
          <div
            className="flex items-center justify-center gap-[.5rem] w-[10rem] rounded-[.5rem] h-[3rem] bg-[#e7e7e7] cursor-pointer text-[1.5rem]"
            onClick={() => handleBack()}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
            Quay về
          </div>
          {dataOrder.paymentTable ? (
            product.length > 0 ? (
              <h3 className="text-[2.4rem] text-green-800 font-bold mx-auto">
                THANH TOÁN TRƯỚC CHO ĐƠN ĐẶT BÀN
              </h3>
            ) : (
              <h3 className="text-[2.4rem] text-green-800 font-bold mx-auto">
                XÁC NHẬN ĐẶT BÀN
              </h3>
            )
          ) : (
            <h3 className="text-[2.4rem] text-green-800 font-bold mx-auto">
              THANH TOÁN ĐƠN HÀNG
            </h3>
          )}
        </div>
        <div className="flex md:flex-row flex-col items-start gap-[2rem]">
          <div className="w-full md:w-[60%] h-auto border-[.1rem] border-[#ccc] mt-[4rem] rounded-[1rem]">
            <h3 className="text-[1.8rem] text-[#006b00] px-[2rem] py-[1rem] rounded-tr-[1rem] rounded-tl-[1rem] bg-[#c9ffff]">
              Thông tin đơn đặt bàn
            </h3>
            <div className="">
              {dataOrder.paymentTable ? (
                <>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Tên khách đặt bàn</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder?.paymentTable?.userId.fullName || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Số điện thoại</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder?.paymentTable?.infoCustomer?.phoneNumber ||
                          ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Bàn</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder?.paymentTable.infoCustomer.tableId
                          .tableName || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Số lượng khách</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder?.paymentTable?.infoCustomer?.guests || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Thời gan dùng bữa dự kiến</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder?.paymentTable?.infoCustomer?.orderDate
                          .split("-")
                          .reverse()
                          .join("-") || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Khung giờ</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        ({" "}
                        {dataOrder?.paymentTable?.timeFrame?.timeFrameName ||
                          ""}{" "}
                        )
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Tên khách hàng</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder.payment?.valueInfoPayment?.fullName || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Số điện thoại</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder.payment?.valueInfoPayment?.phoneNumber || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-[1.5rem] px-[2rem]">
                    <span className="w-[50%]">Ngày đến nhận hàng</span>
                    <div className="w-[50%] ml-auto ">
                      <span>:</span>
                      <span className="ml-[2rem]">
                        {dataOrder.payment?.valueInfoPayment?.orderDate
                          .split("-")
                          .reverse()
                          .join("-") || ""}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {product?.length > 0 && (
                <>
                  <h3 className="text-[1.8rem] text-[#006b00] px-[2rem] py-[1rem] bg-[#c9ffff]">
                    Thông tin món ăn
                  </h3>
                  <div className="p-[2rem] table-payment w-full">
                    <table className="w-full hidden-table-payment">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên món ăn</th>
                          <th>Giá bán</th>
                          <th>Số lượng</th>
                          <th>Tổng giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product?.map((item, index) => {
                          return (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="w-full flex justify-start items-center">
                                  <img
                                    src={`http://localhost:3000/${item.image}`}
                                    alt="imageFood"
                                    className="w-[4.8rem] h-[4.8rem] object-cover mr-[1rem]"
                                  />
                                  <span className="maxlineOne">
                                    {item.dishName}
                                  </span>
                                </div>
                              </td>
                              <td>{item.price}đ</td>
                              <td>
                                <span>{dataOrder?.quantityOrder[item.id]}</span>
                              </td>
                              <td>
                                {(
                                  item.price * dataOrder.quantityOrder[item.id]
                                ).toLocaleString("vi-VN", {
                                  maximumFractionDigits: 3,
                                  minimumFractionDigits: 3,
                                })}
                                đ
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <th colSpan={3} style={{ textAlign: "center" }}>
                            Tổng cộng
                          </th>
                          <th
                            colSpan={2}
                            style={{ textAlign: "center", color: "red" }}
                          >
                            {handleTotalPrice.toLocaleString("vi-VN", {
                              maximumFractionDigits: 3,
                              minimumFractionDigits: 3,
                            })}
                            đ
                          </th>
                        </tr>
                      </tbody>
                    </table>
                    <div className="w-full h-[30rem] overflow-y-scroll removeScrollbar md:hidden">
                      {product.length > 0 &&
                        product.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-[1.5rem] border-b-[.1rem] border-b-[#ccc]"
                            >
                              <div className="w-[50%] flex items-center gap-[1rem]">
                                <img
                                  src={`http://localhost:3000/${item.image}`}
                                  alt="img"
                                  className="w-[4rem] h-[4rem] object-cover"
                                />
                                <div className="flex flex-col">
                                  <h4 className="maxlineOne text-[1.4rem] font-bold">
                                    {item.dishName}
                                  </h4>
                                  <p className="maxlineOne text-[1.2rem]">
                                    {item.description}
                                  </p>
                                  <span className="text-[1.2rem]">
                                    {item.price}
                                  </span>
                                </div>
                              </div>
                              <div className="w-[25%] flex items-center gap-[.5rem] justify-end">
                                <span className="text-[1.2rem]">
                                  {item.price}đ
                                </span>
                                <span
                                  className="w-[2.4rem] h-[2.4rem] flex justify-center items-center bg-[#e14d4d] rounded-[.5rem] cursor-pointer"
                                  onClick={() => handleRemoveItemCart(item.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    className="text-[1rem] text-[#fff]"
                                  />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      <div className="w-[25rem] h-auto mt-[2rem]">
                        <div className="pb-[.5rem] flex justify-between items-center">
                          <span>Tạm tính:</span>
                          <span>
                            {handleTotalPrice.toLocaleString("vi-VN", {
                              maximumFractionDigits: 3,
                              minimumFractionDigits: 3,
                            })}
                            đ
                          </span>
                        </div>
                        <div className="py-[.5rem] flex justify-between items-center">
                          <span>Khuyến mãi:</span>
                        </div>
                        <div className="py-[.5rem] flex justify-between items-center">
                          <span className="font-bold">Tổng giá: </span>
                          <span className="text-[red]">
                            {handleTotalPrice.toLocaleString("vi-VN", {
                              maximumFractionDigits: 3,
                              minimumFractionDigits: 3,
                            })}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full md:w-[40%] h-auto border-[.1rem] border-[#ccc] mt-[4rem] rounded-[1rem]">
            <div className="text-[1.6rem] text-[#006b00] px-[2rem] py-[1rem] rounded-tr-[1rem] rounded-tl-[1rem] bg-[#c9ffff] font-bold">
              THANH TOÁN
            </div>
            <div className="px-[2rem]">
              <div className="py-[1.5rem] flex justify-between">
                <span>Tạm tính:</span>
                <span>
                  {handleTotalPrice.toLocaleString("vi-VN", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
                  đ
                </span>
              </div>
              <div className="py-[1.5rem] border-b-[.1rem] border-b-[#ccc]">
                <span>Khuyến mãi:</span>
              </div>
              <div className="py-[1.5rem] flex justify-between border-b-[.3rem] border-b-[#c4c4c4]">
                <span className="font-bold">Tổng cộng:</span>
                <span className="text-[red] font-bold">
                  {handleTotalPrice.toLocaleString("vi-VN", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
                  đ
                </span>
              </div>
              {product?.length > 0 && (
                <div className="py-[1.5rem]">
                  <span className="">Phương thức thanh toán</span>
                  <div className="flex items-center gap-[1rem] pt-[1.5rem]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={methodPay === "HERE"}
                      id="here"
                      className="ml-[.5rem]"
                      onChange={() => setMethodPay("HERE")}
                    />
                    <label htmlFor="here">Thanh toán tại nhà hàng</label>
                  </div>
                  <div className="flex items-center gap-[1rem] pt-[1.5rem]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={methodPay === "MOMO"}
                      id="momo"
                      className="ml-[.5rem]"
                      onChange={() => setMethodPay("MOMO")}
                    />
                    <label htmlFor="momo">Thanh toán qua ví MOMO</label>
                  </div>
                </div>
              )}
              <div
                className="w-full my-[1.5rem] h-[4rem] text-[1.5rem] flex items-center justify-center text-[#fff] rounded-[.5rem] bg-[#159d15] cursor-pointer hover:bg-[#069206]"
                onClick={() => {
                  if (dataOrder.paymentTable) {
                    if (product?.length > 0) {
                      if (methodPay === "MOMO") {
                        handleOrderProduct();
                      } else {
                        handlePaymentTableAtRestaurant();
                      }
                    } else {
                      handleOrderTable();
                    }
                  } else {
                    console.log("Thúy vân");
                    if (methodPay === "MOMO") {
                      handlePaymentMomo();
                    } else {
                      handlePaymentAtRestaurant();
                    }
                  }
                }}
              >
                {product?.length > 0 ? "THANH TOÁN" : "ĐẶT BÀN"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openPaymentAtRestaurant && (
        <div className="fixed flex justify-center items-center inset-0 bg-[#6868688e] z-[950]">
          <div className="w-[38rem] h-auto rounded-[.5rem] p-[2rem] text-center shadow-2xl bg-[#fff]">
            <span className="text-[4rem] text-[#09b309] ">✔</span>
            <h5 className="text-[1.8rem] font-bold text-gray-800">
              Xác nhận đơn hàng đã được ghi nhận
            </h5>
            <p className="px-[5rem]">
              Vui lòng thanh toán trực tiếp tại quầy thu ngân.
            </p>
            <div className="flex flex-col p-[1rem] gap-[1rem] rounded-[.5rem] bg-gray-100 mt-[2rem]">
              <span>
                <strong>Mã đơn hàng:</strong>
                {responseDetailOrder?.id}
              </span>
              <span>
                <strong>Tổng tiền: </strong>
                <span className="text-red-500">
                  {responseDetailOrder?.totalAmount.toLocaleString("vi-Vn", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
                  đ
                </span>
              </span>
              {dataOrder?.paymentTable && (
                <div>
                  <span>
                    <strong>Tên bàn: </strong>
                    Bàn 01
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-[1rem] justify-center mt-[2rem]">
              <button
                className="px-[1.5rem] py-[.5rem] bg-gray-200 hover:bg-gray-300 transition-all duration-[.25s] rounded-[.5rem] text-gray-600 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  setOpenPaymentAtRestaurant(false);
                }}
              >
                Quay về trang chủ
              </button>
              <button
                className="px-[1.5rem] py-[.5rem] bg-green-500 hover:bg-green-600 transition-all duration-[.25s] rounded-[.5rem] text-[#fff] cursor-pointer"
                onClick={() => {
                  navigate(`/detail-order`, {
                    state: {
                      orderId: responseDetailOrder?.id,
                    },
                  });
                }}
              >
                Chi tiết đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
      {errMessage && (
        <div className="fixed inset-0 flex justify-center items-center  bg-[#49494969] z-[950]">
          <div className="w-auto h-auto p-[4rem] bg-white rounded-[.5rem]">
            <h3 className="text-[2.5rem] text-center mb-6">❌ Lỗi</h3>
            <p className="text-center">{errMessage}</p>
            <div className="flex items-center justify-center mt-4">
              <Link
                to={`/`}
                className="px-[2rem] py-[.8rem] bg-gray-200 rounded-[.5rem] cursor-pointer hover:bg-gray-300"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      )}

      {openOrderTableSuccess && (
        <div className="fixed flex justify-center items-center inset-0 bg-[#6868688e] z-[950]">
          <div className="w-[38rem] h-auto rounded-[.5rem] p-[2rem] text-center shadow-2xl bg-[#fff]">
            <span className="text-[4rem] text-[#09b309] ">✔</span>
            <h5 className="text-[1.8rem] font-bold text-gray-800">
              Đặt bàn thành công
            </h5>
            <p className="px-[5rem]">
              Cảm ơn quý khách đã đặt bàn tại nhà hàng của chúng tôi.
            </p>
            <div className="flex flex-col p-[1rem] gap-[1rem] rounded-[.5rem] bg-gray-100 mt-[2rem]">
              <span>Mã đơn hàng: {openOrderTableSuccess?.id}</span>

              {
                <div>
                  <span>
                    Tên bàn:{" "}
                    {dataOrder?.paymentTable?.infoCustomer.tableId.tableName}
                  </span>
                </div>
              }
            </div>
            <div className="flex items-center gap-[1rem] justify-center mt-[2rem]">
              <button
                className="px-[1.5rem] py-[.5rem] bg-gray-200 hover:bg-gray-300 transition-all duration-[.25s] rounded-[.5rem] text-gray-600 cursor-pointer"
                onClick={() => setOpenPaymentAtRestaurant(false)}
              >
                Quay về trang chủ
              </button>
              <button
                className="px-[1.5rem] py-[.5rem] bg-green-500 hover:bg-green-600 transition-all duration-[.25s] rounded-[.5rem] text-[#fff] cursor-pointer"
                onClick={() => {
                  navigate(`/detail-order`, {
                    state: {
                      orderTableId: openOrderTableSuccess?.id,
                    },
                  });
                }}
              >
                Chi tiết đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default PaymentDishTable;
