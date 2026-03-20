import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../components/Header";
import noCart from "../../../assets/image/cart_empty.png";
import Footer from "../../../components/Footer";
import WarnLogin from "../../../components/WarnLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faCheck,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router";
import { FoodContext } from "../../../contexts/FoodContext";

function OrderTable() {
  const [login, setLogin] = useState({});
  const location = useLocation();
  const [casePayment, setCasePayment] = useState(location.state || "");
  const [listTimeFrame, setListTimeFrame] = useState([]);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  const { cart, getCartUser, dataAllFood } = useContext(FoodContext);
  const [quantityOrder, setQuantityOrder] = useState({});
  const navigate = useNavigate();
  const [showViewTable, setShowViewTable] = useState(false);
  const [tableSelected, setTableSelected] = useState(null);
  const [showWarnSelectTable, setShowWarnSelectTable] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const errMessageRef = useRef();
  const [isOnlyOrderTable, setIsOnlyOrderTable] = useState(false);
  const [valueInfoPaymentTable, setValueInfoPaymentTable] = useState({
    timeFrameId: "",
    guests: "",
    orderDate: new Date().toISOString().split("T")[0],
    userId: login?.id || null,
    messageUser: "",
    phoneNumber: "",
    fullName: "",
    status: "CONFIRM",
  });
  const [valueInfoPayment, setValueInfoPayment] = useState({
    fullName: "",
    orderDate: "",
    phoneNumber: "",
  });
  let init = {};
  const listCart =
    dataAllFood.length > 0 &&
    dataAllFood.filter(
      (it) => cart.length > 0 && cart.find((item) => item.foodId === it.id),
    );

  useEffect(() => {
    if (cart.length > 0) {
      cart.map((it) => {
        init[it.foodId] = it.quantityOrder;
      });
      setQuantityOrder(init);
    }
  }, [cart]);

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
    const timeFrame = async () => {
      try {
        const response = await getAllTimeFrame();
        if (response.errCode === 0) {
          setListTimeFrame(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    timeFrame();
  }, []);

  const handleChangeValueInfoPaymentTable = ({ target }) => {
    const { name, value } = target;
    setValueInfoPaymentTable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeValueInfoPayment = ({ target }) => {
    const { name, value } = target;
    setValueInfoPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSetQuantityOrder = (id, action) => {
    const quantity =
      listCart.length > 0 && listCart.find((it) => it.id === id).quantity;
    setQuantityOrder((prev) => ({
      ...prev,
      [id]:
        action === "incre"
          ? Math.min(prev[id] + 1, quantity || 1)
          : Math.max(prev[id] - 1, 1),
    }));
  };

  const handleRemoveItemCart = async (id) => {
    try {
      const userId = login.id;
      const foodId = id;
      const message = await deleteProductCart(userId, foodId);
      if (message.errCode === 0) {
        getCartUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveAllCart = async () => {
    try {
      const userId = login.id;
      const message = await deleteAllCart(userId);
      if (message.errCode === 0) {
        getCartUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrderTable = async () => {
    try {
      if (login && !login.id) {
        setShowWarnLogin(true);
        return;
      }
      const userId = login;
      if (casePayment === "paymentTable") {
        // Gọi api kiểm tra điều kiện ngày giờ và trạng thái bàn

        const { timeFrameId, guests, orderDate, tableId, phoneNumber } =
          valueInfoPaymentTable;
        if (!tableSelected) {
          setShowWarnSelectTable(true);
          return;
        }
        if (!timeFrameId || !guests || !orderDate || !tableId || !phoneNumber) {
          setErrMessage("Vui lòng nhập đầy đủ thông tin!");
          setTimeout(() => {
            errMessageRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 100);
          return;
        }
        const message = await checkOrderTableDish({
          timeFrameId,
          tableId: tableId,
          orderDate,
        });

        if (message.errCode === 1) {
          setErrMessage(
            "Thời gian và bàn này đã có người đặt! Vui lòng chọn thời gian hoặc bàn khác.",
          );
          return;
        }
        const time = listTimeFrame.find((it) => it.id === Number(timeFrameId));
        dispatch(
          getPaymentInfo({
            paymentTable: {
              infoCustomer: valueInfoPaymentTable,
              product:
                !isOnlyOrderTable && listCart.length > 0 ? listCart : null,
              timeFrame: time,
              userId: userId,
            },
            quantityOrder: quantityOrder,
          }),
        );
        navigate("/payment-dish-table");
      } else {
        const { fullName, orderDate, phoneNumber } = valueInfoPayment;
        if (!fullName || !orderDate || !phoneNumber) {
          setErrMessage("Vui lòng nhập đầy đủ thông tin!");
          return;
        }
        const total = listCart.reduce((acc, curr) => {
          return acc + (Number(curr.price) * quantityOrder[curr.id] || 1);
        }, 0);
        dispatch(
          getPaymentInfo({
            payment: {
              amount: total,
              product: listCart,
              userId: login.id,
              valueInfoPayment,
              fullName: valueInfoPayment.fullName,
            },
            quantityOrder: quantityOrder,
          }),
        );
        navigate("/payment-dish-table");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleTotalPrice = useMemo(() => {
    if (listCart.length > 0) {
      return listCart.reduce((acc, curr) => {
        return acc + (Number(curr.price) * quantityOrder[curr.id] || 1);
      }, 0);
    }
    return 0;
  }, [listCart]);

  const handleSelectTable = (table) => {
    valueInfoPaymentTable.tableId = table;
    setTableSelected(table);
  };

  return (
    <div className="w-full h-auto">
      <Header
        login={login}
        setLogin={setLogin}
        isShowCart={false}
        isBg={true}
      />
      <div className="w-full h-auto px-[2rem] md:px-[5rem] lg:px-[10rem] xl:px-[20rem] pt-[9.5rem] md:pt-[10.8rem]">
        <h2 className="text-[2.5rem] md:text-[3.4rem] text-center font-bold text-green-800 mb-[1rem]">
          Thanh toán và đặt bàn
        </h2>
        <Link
          to={`/category-dish`}
          className="w-[18rem] h-[4rem] flex justify-center items-center gap-[.5rem] cursor-pointer bg-[#e8e8e8] rounded-[.5rem] mb-[1rem] md:mb-[2rem]"
        >
          <FontAwesomeIcon
            icon={faCaretLeft}
            className="text-[1.8rem] text-[#444]"
          />
          Tiếp tục chọn món
        </Link>
        <div className="w-full h-auto ">
          <div className="table-order hidden md:block">
            {
              <table className="w-full">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Món ăn</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                    <th>Tổng thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {!isOnlyOrderTable &&
                    listCart.length > 0 &&
                    listCart.map((item, index) => {
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
                              <span>{item.dishName}</span>
                            </div>
                          </td>
                          <td>{item.price}đ</td>
                          <td>
                            <div className="w-full flex justify-center items-center">
                              <span
                                className="w-[2.5rem] h-[2.5rem flex justify-center items-center rounded-[.4rem] select-none border-[.1rem] border-[#969696]"
                                onClick={() =>
                                  handleSetQuantityOrder(item.id, "decre")
                                }
                              >
                                -
                              </span>
                              <span className="w-[2.5rem] h-[2.5rem flex justify-center items-center select-none">
                                {quantityOrder[item.id] || 1}
                              </span>
                              <span
                                className="w-[2.5rem] h-[2.5rem flex justify-center items-center rounded-[.4rem] select-none border-[.1rem] border-[#969696]"
                                onClick={() =>
                                  handleSetQuantityOrder(item.id, "incre")
                                }
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td className="text-[red]">
                            {(
                              item.price * quantityOrder[item.id] || 1
                            ).toLocaleString("vi-VN", {
                              maximumFractionDigits: 3,
                              minimumFractionDigits: 3,
                            })}
                            đ
                          </td>
                          <td>
                            <span
                              className="w-[3.4rem] mx-auto h-[3.4rem] flex justify-center items-center bg-red-500 rounded-[.5rem] cursor-pointer"
                              onClick={() => handleRemoveItemCart(item.id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className="text-[1.6rem] text-[#fff]"
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            }
          </div>
          <div className="w-full md:hidden">
            {listCart.length > 0 &&
              listCart.map((item) => {
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
                        <span className="text-[1.2rem]">{item.price}</span>
                      </div>
                    </div>
                    <div className="w-[25%] flex justify-center items-center">
                      <span
                        className="w-[2rem] h-[2rem] flex justify-center items-center rounded-[.4rem] select-none border-[.1rem] border-[#969696]"
                        onClick={() => handleSetQuantityOrder(item.id, "decre")}
                      >
                        -
                      </span>
                      <span className="w-[2rem] h-[2rem] flex justify-center items-center select-none">
                        {quantityOrder[item.id] || 1}
                      </span>
                      <span
                        className="w-[2rem] h-[2rem] flex justify-center items-center rounded-[.4rem] select-none border-[.1rem] border-[#969696]"
                        onClick={() => handleSetQuantityOrder(item.id, "incre")}
                      >
                        +
                      </span>
                    </div>
                    <div className="w-[25%] flex items-center gap-[.5rem] justify-end">
                      <span className="text-[1.2rem]">{item.price}đ</span>
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

          {cart.length > 0 ? (
            !isOnlyOrderTable && (
              <div className="mt-[2rem] md:flex items-start">
                <div className="flex flex-col items-start gap-[1rem]">
                  {casePayment && casePayment === "paymentTable" && (
                    <div
                      className="w-[10rem] h-[4rem] flex justify-center items-center gap-[.6rem] text-[1.5rem] bg-red-500 text-[#fff] cursor-pointer rounded-[.5rem]"
                      onClick={() => handleRemoveAllCart()}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-[1.8rem] text-[#fff]"
                      />
                      Xóa hêt
                    </div>
                  )}

                  <div className="flex flex-col mt-[1rem]">
                    <label htmlFor="casePayment">
                      Chọn hình thức thanh toán
                    </label>
                    <select
                      name="casePayment"
                      value={casePayment}
                      id="casePayment"
                      className="md:w-[42rem] h-[4rem] rounded-[.5rem] border-[.1rem] border-gray-400 focus:ring-2 focus:ring-cyan-300 pl-[1.5rem] outline-none"
                      onChange={(e) => setCasePayment(e.target.value)}
                    >
                      {casePayment && casePayment === "payment" ? (
                        <>
                          <option value="paymentTable">
                            Dùng tại nhà hàng
                          </option>
                          <option value="payment">Mang đi</option>
                        </>
                      ) : (
                        <>
                          <option value="payment">Mang đi</option>
                          <option value="paymentTable">
                            Dùng tại nhà hàng
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="hidden md:block w-[25rem] h-auto px-[2rem] ml-auto">
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
            )
          ) : (
            <div className="w-full flex flex-col mt-[2rem] items-center justify-center">
              <img src={noCart} alt="img" className="w-[20rem]" />
              <p className="text-gray-400">Không có sản phẩm</p>
            </div>
          )}

          <div className="flex items-center gap-[1rem] font-bold mt-[2rem]">
            Chỉ đặt bàn
            <label
              htmlFor="inputCase"
              className="w-[2rem] h-[2rem] flex justify-center items-center border border-gray-500 rounded-[.2rem]"
              onClick={() => {
                setIsOnlyOrderTable((prev) => !prev);
              }}
            >
              {isOnlyOrderTable && (
                <FontAwesomeIcon icon={faCheck} className="text-blue-500" />
              )}
            </label>
            <input type="checkbox" id="inputCase" className="hidden" />
          </div>
        </div>
        {casePayment && casePayment === "paymentTable" ? (
          <div>
            <div className="w-full mt-[3rem] h-auto py-[1rem] md:px-[4rem] flex justify-center rounded-[1.5rem] border-[.1rem] border-[#bdbdbd]">
              <div className="w-full p-[2rem] rounded-[1rem]">
                <h3 className="md:text-[2.4rem] text-[2rem] font-bold text-green-700 text-center pb-[4rem]">
                  Nhập thông tin để đặt bàn
                </h3>
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-[1rem]">
                  <div className="md:mb-[2rem] w-full">
                    <label htmlFor="fullName">Tên khách hàng</label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      className="w-full h-[5rem] border-[.1rem] focus:ring-2 focus:ring-cyan-300 border-gray-400 rounded-[.5rem] pl-[1.5rem] mt-[.5rem]"
                      placeholder="Nhập họ tên..."
                      onFocus={() => setErrMessage("")}
                      onChange={(e) => handleChangeValueInfoPaymentTable(e)}
                    />
                  </div>
                  <div className="md:mb-[2rem] w-full">
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <input
                      type="number"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="w-full h-[5rem] border-[.1rem] focus:ring-2 focus:ring-cyan-300 border-gray-400 rounded-[.5rem] pl-[1.5rem] mt-[.5rem]"
                      placeholder="Nhập số điện thoại..."
                      onFocus={() => setErrMessage("")}
                      onChange={(e) => handleChangeValueInfoPaymentTable(e)}
                    />
                  </div>
                  <div className="md:mb-[2rem] w-full">
                    <label htmlFor="guests">Số lượng khách</label>
                    <input
                      type="number"
                      name="guests"
                      id="guests"
                      value={valueInfoPaymentTable.guests}
                      className="w-full h-[5rem] border-[.1rem] focus:ring-2 focus:ring-cyan-300 border-gray-400 rounded-[.5rem] pl-[1.5rem] mt-[.5rem]"
                      placeholder="Nhập số lượng thoại..."
                      onFocus={() => setErrMessage("")}
                      onChange={(e) => handleChangeValueInfoPaymentTable(e)}
                    />
                  </div>
                </div>
                <div className="w-full grid md:grid-cols-3 grid-cols-1 mt-[1rem] gap-[1rem]">
                  <div className=" w-full">
                    <label htmlFor="orderDate">
                      Chọn ngày (Tối đa 5 ngày tới)
                    </label>
                    <input
                      type="date"
                      name="orderDate"
                      value={valueInfoPaymentTable.orderDate}
                      id="orderDate"
                      className="w-full h-[5rem] border-[.1rem] border-[#777777] rounded-[.5rem] px-[1.5rem] mt-[.5rem]"
                      min={new Date().toISOString().split("T")[0]}
                      max={
                        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      } // Giới hạn tối đa 7 ngày tới
                      onFocus={() => setErrMessage("")}
                      onChange={(e) => handleChangeValueInfoPaymentTable(e)}
                    />
                  </div>
                  <div className="mb-[2rem] w-full">
                    <label htmlFor="timeFrameId">Khung giờ</label>
                    <select
                      name="timeFrameId"
                      id="timeFrameId"
                      value={valueInfoPaymentTable.timeFrameId}
                      className="w-full h-[5rem] rounded-[.5rem] focus:ring-2 focus:ring-cyan-300 border-gray-400 border-[.1rem] mt-[.5rem] pl-[1.5rem] outline-none"
                      onFocus={() => setErrMessage("")}
                      onChange={(e) => handleChangeValueInfoPaymentTable(e)}
                    >
                      <option value="" hidden>
                        Chọn khung giờ
                      </option>
                      {listTimeFrame.length > 0 &&
                        listTimeFrame.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.timeFrameName}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="flex items-center gap-[2rem] w-full">
                    <span
                      className="px-[2rem] py-[1rem] btn-green text-[#fff] rounded-[5rem] cursor-pointer"
                      onClick={() => setShowViewTable(true)}
                    >
                      Chọn bàn
                    </span>
                    {tableSelected ? (
                      <div className="w-[8rem] h-[8rem] flex justify-center rounded-[1rem] items-center text-[1.6rem] bg-[#e8ffe8] border-[.3rem] border-[#00ba00] select-none font-bold">
                        {(tableSelected && tableSelected.tableName) ||
                          currentTableSeleted.tableName}
                      </div>
                    ) : (
                      <div className="w-[8rem] h-[8rem] flex justify-center rounded-[.4rem] items-center text-center text-[1.2rem] bg-[#eeeeee] border-[.3rem] border-[#adadad] select-none font-bold">
                        Chưa chọn bàn
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-[1rem]">
                  <textarea
                    name="messageUser"
                    id="messageUser"
                    rows={3}
                    className="w-full border-[.1rem] rounded-[.5rem] outline-none p-[2rem] focus:ring-2 focus:ring-cyan-300 border-gray-400"
                    placeholder="Lời nhắn tới nhà hàng..."
                    onChange={(e) => handleChangeValueInfoPaymentTable(e)}
                  ></textarea>
                </div>
                {errMessage && (
                  <div className="text-[red]" ref={errMessageRef}>
                    {errMessage}
                  </div>
                )}
                <div
                  className="w-[15rem] h-[4rem] mx-auto flex justify-center items-center gap-[.5rem] linearItem2 text-[#fff] rounded-[5rem] mt-[2rem] cursor-pointer"
                  onClick={() => handleOrderTable()}
                >
                  Đặt bàn
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="text-[#fff]"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full mt-[3rem] h-auto py-[1rem] px-[2rem] md:px-[4rem] rounded-[1.5rem] border-[.1rem] border-[#bdbdbd]">
            <h3 className="text-[2rem] md:text-[2.4rem] text-center text-green-700 font-semibold mb-[3rem]">
              Thông tin đặt hàng
            </h3>
            <div className="grid md:grid-cols-3  gap-[1rem]">
              <div className="w-full mb-4">
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="name"
                >
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  id="name"
                  name="fullName"
                  value={valueInfoPayment.fullName}
                  className="w-full px-4 h-[5rem] border rounded-lg focus:outline-none focus:ring-2 border-gray-400 focus:ring-cyan-300"
                  placeholder="Nhập tên khách hàng..."
                  onChange={(e) => handleChangeValueInfoPayment(e)}
                />
              </div>

              <div className="w-full mb-4">
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="phone"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phoneNumber"
                  value={valueInfoPayment.phoneNumber}
                  className="w-full px-4 h-[5rem] border rounded-lg focus:outline-none focus:ring-2 border-gray-400 focus:ring-cyan-300"
                  placeholder="Nhập số điện thoại..."
                  onChange={(e) => handleChangeValueInfoPayment(e)}
                />
              </div>

              <div className="w-full mb-4">
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="date"
                >
                  Ngày lấy hàng (Tối đa 5 ngày tới)
                </label>
                <input
                  type="date"
                  id="date"
                  name="orderDate"
                  value={valueInfoPayment.orderDate}
                  className="w-full px-4 h-[5rem] border rounded-lg focus:ring-2 border-gray-400 focus:ring-cyan-300"
                  min={new Date().toISOString().split("T")[0]}
                  max={
                    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  } // Giới hạn tối đa 7 ngày tới
                  onChange={(e) => handleChangeValueInfoPayment(e)}
                />
              </div>
            </div>
            {errMessage && (
              <div className="text-[red]" ref={errMessageRef}>
                {errMessage}
              </div>
            )}
            <div
              className="w-[12rem] mt-[1rem] h-[4rem] flex justify-center items-center text-[1.5rem] gap-[.5rem] bg-[#3dbe3b] text-[#fff] cursor-pointer rounded-[.5rem]"
              onClick={() => handleOrderTable()}
            >
              Thanh toán
              <FontAwesomeIcon
                icon={faCaretRight}
                className="text-[1.8rem] text-[#fff]"
              />
            </div>
          </div>
        )}
      </div>
      {showWarnLogin && (
        <WarnLogin
          setShowWarnLogin={setShowWarnLogin}
          pathRedirect={`/order-table`}
          info={"đặt bàn"}
        />
      )}
      {showViewTable && (
        <Tables
          setShowViewTable={setShowViewTable}
          login={login}
          handleSelectTable={handleSelectTable}
          infoOrder={{
            timeFrameId: valueInfoPaymentTable.timeFrameId,
            orderDate: valueInfoPaymentTable.orderDate,
          }}
        />
      )}
      {showWarnSelectTable && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#5c5c5c2b] z-[999]">
          <div className="relative w-auto h-auto p-[4rem] rounded-[1rem] bg-[#fff] shadow-2xl">
            <div className="text-[1.8rem] text-[#d56b00]">
              Bạn chưa chọn bàn! Vui lòng chọn bàn để đặt
            </div>
            <span
              className="absolute top-[1rem] w-[2rem] h-[2rem] rounded-[.3rem] bg-[#e8e8e8] right-[1rem] flex justify-center items-center hover:bg-[red] group transition-all duration-[.25s]"
              onClick={() => setShowWarnSelectTable(false)}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-[#616161] group-hover:text-[#fff] transition-all duration-[.25s]"
              />
            </span>
            <div className="flex items-center justify-center gap-[1rem] mt-[2rem]">
              <button
                className="w-auto px-[2rem] h-[4rem] bg-[#cdcdcd] rounded-[.5rem] transition-all duration-[.25s] select-none cursor-pointer text-[#fff]"
                onClick={() => setShowWarnSelectTable(false)}
              >
                Không
              </button>
              <div
                className="w-auto px-[2rem] h-[4rem] bg-[#20ba28] rounded-[.5rem] hover:bg-[#07b60f] text-[#fff] transition-all duration-[.25s] select-none cursor-pointer flex justify-center items-center"
                onClick={() => {
                  setShowViewTable(true);
                  setShowWarnSelectTable(false);
                }}
              >
                Chọn bàn
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default OrderTable;
