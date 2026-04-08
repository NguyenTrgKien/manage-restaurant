import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faReceipt,
  faXmark,
  faAdd,
  faUtensils,
  faMinus,
  faPlus,
  faTrash,
  faSearch,
  faShoppingCart,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllOrderTableForAdmin,
  updateOrderTableStatus,
  createOrder,
} from "../../../apis/order.api";

const statusMap = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  CONFIRM: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  CHECKED_IN: { label: "Khách đã đến", color: "bg-purple-100 text-purple-800" },
  COMPLETED: { label: "Bàn đã dùng xong", color: "bg-teal-100 text-teal-800" },
  NO_SHOW: { label: "Khách không đến", color: "bg-gray-100 text-gray-800" },
  CANCELLED: { label: "Đã hủy đơn", color: "bg-red-100 text-red-800" },
};
const CAN_ADD_FOOD = ["CONFIRM", "CHECKED_IN"];
const TAB_LIST = [
  { key: "current", label: "Đơn hiện tại" },
  { key: "completed", label: "Đã hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];
const filterByTab = (orders, tab) => {
  if (tab === "current")
    return orders.filter(
      (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED",
    );
  if (tab === "completed")
    return orders.filter((o) => o.status === "COMPLETED");
  if (tab === "cancelled")
    return orders.filter((o) => o.status === "CANCELLED");
  return orders;
};
const isFinalStatus = (s) => s === "COMPLETED" || s === "CANCELLED";

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-5 border-r border-gray-200">
        <div className="h-[1.4rem] w-[4rem] rounded bg-gray-200" />
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-[1.4rem] w-[10rem] rounded bg-gray-200" />
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-[1.4rem] w-[12rem] rounded bg-gray-200" />
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-[1.4rem] w-[6rem] rounded bg-gray-200" />
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-[1.4rem] w-[8rem] rounded bg-gray-200" />
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-[2.4rem] w-[12rem] rounded-full bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="flex gap-[.8rem]">
          <div className="h-[3rem] w-[8rem] rounded-[.5rem] bg-gray-200" />
          <div className="h-[3rem] w-[8rem] rounded-[.5rem] bg-gray-200" />
        </div>
      </td>
    </tr>
  );
}

function FoodSkeleton() {
  return (
    <div className="animate-pulse rounded-[.8rem] border border-gray-200 overflow-hidden">
      <div className="h-[10rem] bg-gray-200" />
      <div className="p-[1rem] space-y-2">
        <div className="h-[1.4rem] w-3/4 bg-gray-200 rounded" />
        <div className="h-[1.2rem] w-1/2 bg-gray-200 rounded" />
        <div className="h-[3rem] w-full bg-gray-200 rounded-[.6rem]" />
      </div>
    </div>
  );
}

function AddFoodModal({ orderTable, onClose, onSuccess }) {
  const [cart, setCart] = useState([]);
  const [searchFood, setSearchFood] = useState("");
  const [serverError, setServerError] = useState("");
  const { data: foodRes, isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: getAllFood,
  });
  const foods = foodRes?.data?.data ?? [];
  const filteredFoods = foods.filter((f) =>
    (f.name ?? "").toLowerCase().includes(searchFood.toLowerCase()),
  );
  const addToCart = (food) =>
    setCart((prev) => {
      const ex = prev.find((i) => i.id === food.id);
      if (ex)
        return prev.map((i) =>
          i.id === food.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...food, qty: 1 }];
    });
  const increase = (id) =>
    setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const decrease = (id) =>
    setCart((p) =>
      p
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  const removeItem = (id) => setCart((p) => p.filter((i) => i.id !== id));
  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const mutation = useMutation({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (res) => {
      if (res?.errCode === 0) {
        onSuccess();
        onClose();
      } else setServerError(res?.message || "Thêm món thất bại!");
    },
  });
  const handleSubmit = () => {
    if (cart.length === 0) {
      setServerError("Vui lòng chọn ít nhất một món!");
      return;
    }
    setServerError("");
    mutation.mutate({
      fullName: orderTable.user?.fullName ?? "Khách",
      orderTableId: orderTable.id,
      paymentMethod: "CASH",
      items: cart.map((i) => ({ foodId: i.id, quantity: i.qty })),
    });
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#6060606d] z-[950]">
      <div className="w-[90rem] max-w-[95vw] h-[85vh] bg-white rounded-[1rem] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-[2.5rem] py-[1.8rem] border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="text-[1.8rem]  text-gray-800 flex items-center gap-[.8rem]">
              <FontAwesomeIcon icon={faUtensils} className="text-cyan-500" />
              Thêm món — Đơn #{orderTable.id}
            </h3>
            <p className="text-[1.4rem] text-gray-400 mt-[.2rem]">
              Bàn:{" "}
              <strong className="text-gray-600">
                {orderTable.table?.name ?? "—"}
              </strong>
              {" · "}Khách:{" "}
              <strong className="text-gray-600">
                {orderTable.user?.fullName ?? "—"}
              </strong>
              {" · "}
              <span
                className={`px-[.8rem] py-[.1rem] rounded-full text-[1.3rem] font-medium ${statusMap[orderTable.status]?.color}`}
              >
                {statusMap[orderTable.status]?.label}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[1.8rem]" />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
            <div className="px-[2rem] py-[1.5rem] border-b border-gray-100 flex-shrink-0">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-[1.4rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
                />
                <input
                  type="text"
                  placeholder="Tìm tên món..."
                  value={searchFood}
                  onChange={(e) => setSearchFood(e.target.value)}
                  className="w-full h-[4rem] pl-[4rem] pr-[1.4rem] border border-gray-300 rounded-[.8rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-[2rem]">
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-[1.2rem]">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <FoodSkeleton key={i} />
                  ))
                ) : filteredFoods.length === 0 ? (
                  <div className="col-span-3 py-[4rem] text-center text-gray-400 text-[1.6rem]">
                    Không tìm thấy món nào
                  </div>
                ) : (
                  filteredFoods.map((food) => {
                    const inCart = cart.find((i) => i.id === food.id);
                    const outOfStock = food.quantity === 0;
                    return (
                      <div
                        key={food.id}
                        className={`rounded-[.8rem] border overflow-hidden transition-all ${inCart ? "border-cyan-400 shadow-[0_0_0_2px_rgba(6,182,212,.15)]" : "border-gray-200 hover:border-gray-300"} ${outOfStock ? "opacity-50" : ""}`}
                      >
                        <div className="relative">
                          <img
                            src={food.image || "/placeholder-food.png"}
                            alt={food.name}
                            className="w-full h-[10rem] object-cover bg-gray-100"
                          />
                          {inCart && (
                            <span className="absolute top-[.8rem] right-[.8rem] bg-cyan-500 text-white text-[1.1rem] font-medium px-[.8rem] py-[.2rem] rounded-full">
                              x{inCart.qty}
                            </span>
                          )}
                          {outOfStock && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <span className="text-[1.5rem] text-gray-500 font-medium">
                                Hết hàng
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-[1rem]">
                          <p className="text-[1.5rem] font-medium text-gray-800 line-clamp-1 mb-[.2rem]">
                            {food.name}
                          </p>
                          <p className="text-[1.4rem] text-red-500 font-medium mb-[.8rem]">
                            {Number(food.price).toLocaleString("vi-VN")}đ
                          </p>
                          <button
                            disabled={outOfStock}
                            onClick={() => addToCart(food)}
                            className="w-full h-[3rem] rounded-[.6rem] bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[1.4rem] font-medium transition-colors"
                          >
                            {inCart ? "Thêm nữa" : "Chọn món"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="w-[30rem] flex-shrink-0 flex flex-col">
            <div className="px-[2rem] py-[1.5rem] border-b border-gray-100 flex-shrink-0">
              <h4 className="text-[1.6rem]  text-gray-700 flex items-center gap-[.8rem]">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-cyan-500"
                />
                Giỏ món
                {cart.length > 0 && (
                  <span className="ml-auto text-[1.3rem] font-normal text-gray-400">
                    {cart.length} loại
                  </span>
                )}
              </h4>
            </div>
            <div className="flex-1 overflow-y-auto px-[2rem] py-[1.5rem]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-200">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="text-[4rem] mb-[1rem]"
                  />
                  <p className="text-[1.5rem] text-gray-400">
                    Chưa chọn món nào
                  </p>
                </div>
              ) : (
                <div className="space-y-[.8rem]">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-[1rem] py-[.8rem] border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={item.image || "/placeholder-food.png"}
                        alt={item.name}
                        className="w-[4.4rem] h-[4.4rem] rounded-[.6rem] object-cover flex-shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[1.4rem] font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[1.3rem] text-red-500">
                          {Number(item.price).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <div className="flex items-center gap-[.4rem]">
                        <button
                          onClick={() => decrease(item.id)}
                          className="w-[2.2rem] h-[2.2rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="text-[1rem]"
                          />
                        </button>
                        <span className="text-[1.4rem] font-medium w-[1.8rem] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increase(item.id)}
                          className="w-[2.2rem] h-[2.2rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-[1rem]"
                          />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-[2.2rem] h-[2.2rem] rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 ml-[.2rem]"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-[1rem]"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-[2rem] py-[1.5rem] border-t border-gray-200 flex-shrink-0 space-y-[1.2rem]">
              {cart.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[1.5rem] text-gray-600">Tổng cộng</span>
                  <span className="text-[1.8rem]  text-red-500">
                    {Number(totalAmount).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              {serverError && (
                <p className="text-red-500 text-[1.4rem]">{serverError}</p>
              )}
              <div className="flex gap-[1rem]">
                <button
                  onClick={onClose}
                  className="flex-1 h-[4.2rem] rounded-[.8rem] border border-gray-300 text-gray-600 text-[1.5rem] hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={mutation.isPending || cart.length === 0}
                  className="flex-1 h-[4.2rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[1.5rem] font-medium transition-colors flex items-center justify-center gap-[.6rem]"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {mutation.isPending ? "Đang lưu..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTable() {
  const tabRefs = useRef([]);
  const [currentTab, setCurrentTab] = useState("current");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [messageUpdate, setMessageUpdate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [addFoodOrder, setAddFoodOrder] = useState(null);

  const fetchOrderTable = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrderTableForAdmin();
      if (response.errCode === 0) {
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setListData(sorted);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderTable();
  }, []);
  useEffect(() => {
    const idx = TAB_LIST.findIndex((t) => t.key === currentTab);
    const el = tabRefs.current[idx];
    if (el) setIndicatorStyle({ width: el.offsetWidth, left: el.offsetLeft });
  }, [currentTab, isLoading]);

  const filtered = filterByTab(listData, currentTab).filter((order) => {
    const q = searchFilter.toLowerCase();
    return (
      order.id.toString().includes(q) ||
      (order.table?.name ?? "").toLowerCase().includes(q) ||
      (order.user?.fullName ?? "").toLowerCase().includes(q) ||
      (statusMap[order.status]?.label ?? "").toLowerCase().includes(q)
    );
  });

  const handleUpdateStatus = async () => {
    if (!updateStatus) {
      setMessageUpdate("Vui lòng chọn trạng thái!");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await updateOrderTableStatus({
        orderTableId: updateStatusOrder.id,
        status: updateStatus,
      });
      if (response?.errCode === 0) {
        setUpdateStatusOrder(null);
        setUpdateStatus("");
        setMessageUpdate("");
        fetchOrderTable();
      } else setMessageUpdate(response?.message || "Cập nhật thất bại!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem]  text-gray-800">Quản lý đơn đặt bàn</h3>
          <p className="text-gray-500">
            Quản lý toàn bộ đơn đặt bàn của nhà hàng.
          </p>
        </div>
        <Link
          to={"create"}
          className="flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors text-white text-[1.6rem]"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span>Tạo đơn đặt bàn</span>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-5">
        <input
          type="text"
          placeholder="Tìm mã đơn, tên bàn, tên khách..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full h-[4.2rem] px-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
        />
      </div>
      <div className="relative flex items-center gap-[2rem] pb-[1rem] border-b border-gray-200">
        {TAB_LIST.map((tab, idx) => (
          <span
            key={tab.key}
            ref={(el) => (tabRefs.current[idx] = el)}
            className={`cursor-pointer select-none text-[1.6rem] transition-colors ${currentTab === tab.key ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCurrentTab(tab.key)}
          >
            {tab.label}
          </span>
        ))}
        <div
          className="absolute bottom-0 h-[.2rem] rounded-full bg-blue-500 transition-all duration-[.35s]"
          style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
        />
      </div>
      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200 w-[7rem]">
                Mã đơn
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Tên bàn
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Khách hàng
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Số khách
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Ngày đến
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 font-medium text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="text-center py-[4rem] text-gray-400 text-[1.6rem]">
                    Không có đơn hàng nào
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                >
                  <td className="p-5 text-gray-500 border-r border-gray-200">
                    #{order.id}
                  </td>
                  <td className="p-5 font-medium text-gray-800 border-r border-gray-200">
                    <span className="line-clamp-1">
                      {order.table?.name ?? "—"}
                    </span>
                  </td>
                  <td className="p-5 text-gray-700 border-r border-gray-200">
                    <span className="line-clamp-1">
                      {order.user?.fullName ?? "—"}
                    </span>
                  </td>
                  <td className="p-5 text-gray-500 border-r border-gray-200">
                    {order.numberGuests} người
                  </td>
                  <td className="p-5 text-gray-500 border-r border-gray-200">
                    {moment(order.orderDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-5 border-r border-gray-200">
                    <span
                      className={`text-[1.5rem] rounded-full px-[1rem] py-[.3rem] font-medium whitespace-nowrap ${statusMap[order.status]?.color ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {statusMap[order.status]?.label ?? order.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex items-center justify-center gap-[.8rem]">
                      <Link
                        to={`detail/${order.id}`}
                        className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-blue-50 text-blue-600 text-[1.6rem] rounded-[.6rem] hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        <FontAwesomeIcon icon={faReceipt} />
                        Chi tiết
                      </Link>
                      {CAN_ADD_FOOD.includes(order.status) && (
                        <button
                          onClick={() => setAddFoodOrder(order)}
                          className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-orange-50 text-orange-500 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-orange-100 transition-colors whitespace-nowrap"
                        >
                          <FontAwesomeIcon icon={faUtensils} />
                          Thêm món
                        </button>
                      )}
                      {!isFinalStatus(order.status) && (
                        <button
                          onClick={() => setUpdateStatusOrder(order)}
                          className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-green-50 text-green-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-green-100 transition-colors whitespace-nowrap"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Cập nhật
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {updateStatusOrder && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#6060606d] z-[950]">
          <div className="w-[40rem] h-auto p-[3rem] rounded-[1rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between mb-[2rem]">
              <h3 className="text-[1.6rem] text-gray-700 font-medium">
                Cập nhật đơn{" "}
                <span className="text-blue-600">#{updateStatusOrder.id}</span>
              </h3>
              <FontAwesomeIcon
                icon={faXmark}
                className="text-[1.6rem] text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => {
                  setUpdateStatusOrder(null);
                  setMessageUpdate("");
                  setUpdateStatus("");
                }}
              />
            </div>
            <select
              className="w-full h-[4.4rem] border border-gray-300 outline-none px-[1.5rem] rounded-[.5rem] focus:border-cyan-500 transition-all text-[1.6rem]"
              value={updateStatus}
              onChange={(e) => {
                setUpdateStatus(e.target.value);
                setMessageUpdate("");
              }}
            >
              <option value="" hidden>
                Chọn trạng thái
              </option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRM">Đã xác nhận</option>
              <option value="CHECKED_IN">Khách đã đến</option>
              <option value="COMPLETED">Bàn đã dùng xong</option>
              <option value="NO_SHOW">Khách không đến</option>
              <option value="CANCELLED">Hủy đơn hàng</option>
            </select>
            {messageUpdate && (
              <p className="text-red-500 text-[1.6rem] mt-[.8rem]">
                {messageUpdate}
              </p>
            )}
            <div className="flex items-center justify-end gap-[1rem] mt-[2rem]">
              <button
                className="px-[2rem] py-[1rem] rounded-[.8rem] bg-[#e7e7e7] text-gray-700 hover:bg-gray-300 cursor-pointer text-[1.6rem]"
                onClick={() => {
                  setUpdateStatusOrder(null);
                  setMessageUpdate("");
                  setUpdateStatus("");
                }}
              >
                Hủy
              </button>
              <button
                className="px-[2rem] py-[1rem] rounded-[.8rem] bg-[#1fc5c5] hover:bg-[#0cb7b7] text-white cursor-pointer disabled:opacity-60 transition-colors text-[1.6rem]"
                onClick={handleUpdateStatus}
                disabled={isUpdating}
              >
                {isUpdating ? "Đang lưu..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {addFoodOrder && (
        <AddFoodModal
          orderTable={addFoodOrder}
          onClose={() => setAddFoodOrder(null)}
          onSuccess={fetchOrderTable}
        />
      )}
    </div>
  );
}

export default OrderTable;
