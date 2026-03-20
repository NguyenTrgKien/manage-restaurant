import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import {
  faAdd,
  faCheckCircle,
  faReceipt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailForAdmin from "../../../components/DetailForAdmin";
import { Link } from "react-router";
import { getAllOrderForAdmin } from "../../../apis/order.api";

const statusMap = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  CONFIRM: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Đang chuẩn bị", color: "bg-purple-100 text-purple-800" },
  READY: { label: "Sẵn sàng phục vụ", color: "bg-indigo-100 text-indigo-800" },
  WAITPAYMENT: {
    label: "Chờ thanh toán",
    color: "bg-amber-100 text-amber-800",
  },
  PAID: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Đã hoàn thành", color: "bg-teal-100 text-teal-800" },
  NO_SHOW: { label: "Khách không đến", color: "bg-gray-100 text-gray-800" },
  FAILED: { label: "Thất bại", color: "bg-gray-100 text-gray-800" },
};

const TAB_LIST = [
  { key: "pending", label: "Chờ xác nhận" },
  { key: "paid", label: "Đã thanh toán" },
  { key: "canceled", label: "Đã hủy" },
];

const filterByTab = (orders, tab) => {
  if (tab === "pending")
    return orders.filter(
      (o) => o.status !== "PAID" && o.status !== "CANCELLED",
    );
  if (tab === "paid") return orders.filter((o) => o.status === "PAID");
  if (tab === "canceled") return orders.filter((o) => o.status === "CANCELLED");
  return orders;
};

const isFinalStatus = (status) => status === "PAID" || status === "CANCELLED";

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-5">
        <div className="h-[1.4rem] w-[4rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[12rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[10rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[4rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[8rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[2.4rem] w-[10rem] rounded-full bg-gray-200" />
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

function OrderDish() {
  const queryClient = useQueryClient();
  const tabRefs = useRef([]);
  const [currentTab, setCurrentTab] = useState("pending");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const [searchFilter, setSearchFilter] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [messageUpdate, setMessageUpdate] = useState("");

  const { data: dataRes, isLoading } = useQuery({
    queryKey: ["orderDish"],
    queryFn: getAllOrderForAdmin,
  });

  const orders = [...(dataRes?.data ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  useEffect(() => {
    const idx = TAB_LIST.findIndex((t) => t.key === currentTab);
    const el = tabRefs.current[idx];
    if (el) setIndicatorStyle({ width: el.offsetWidth, left: el.offsetLeft });
  }, [currentTab]);

  const filtered = filterByTab(orders, currentTab).filter((order) => {
    const q = searchFilter.toLowerCase();
    return (
      order.id.toString().includes(q) ||
      (order.fullName ?? "").toLowerCase().includes(q) ||
      (statusMap[order.status]?.label ?? "").toLowerCase().includes(q)
    );
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, status }) => authPayment({ orderId, status }),
    onSuccess: (res) => {
      if (res.errCode === 0) {
        queryClient.invalidateQueries({ queryKey: ["orderDish"] });
        setUpdateStatusOrder(null);
        setUpdateStatus("");
        setMessageUpdate("");
      }
    },
  });

  const handleUpdateStatus = () => {
    if (!updateStatus) {
      setMessageUpdate("Vui lòng chọn trạng thái!");
      return;
    }
    updateMutation.mutate({
      orderId: updateStatusOrder.id,
      status: updateStatus,
    });
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý đơn đặt món
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ đơn hàng món ăn của nhà hàng.
          </p>
        </div>
        <div>
          <Link
            to={"create"}
            className="flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          >
            <FontAwesomeIcon icon={faAdd} />
            <span>Tạo đơn</span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        <input
          type="text"
          placeholder="Tìm mã đơn..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full h-[4.2rem] px-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
        />
        <input
          type="text"
          placeholder="Tên khách..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full h-[4.2rem] px-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <div className="relative flex items-center gap-[2rem] pb-[1rem] border-b border-gray-200">
        {TAB_LIST.map((tab, idx) => (
          <span
            key={tab.key}
            ref={(el) => (tabRefs.current[idx] = el)}
            className={`cursor-pointer select-none text-[1.6rem] transition-colors ${
              currentTab === tab.key
                ? "text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
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
                Khách hàng
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Ngày đặt
              </th>
              <th className="p-5 font-medium border-r border-gray-200 w-[8rem]">
                Số món
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Tổng tiền
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
                    <span className="line-clamp-1">{order.fullName}</span>
                  </td>
                  <td className="p-5 text-gray-500 border-r border-gray-200">
                    {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="p-5 text-gray-500 border-r border-gray-200">
                    {order.orderItems?.length ?? 0} món
                  </td>
                  <td className="p-5 text-red-500 font-medium border-r border-gray-200">
                    {Number(order.totalAmount).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="p-5 border-r border-gray-200">
                    <span
                      className={`text-[1.6rem] rounded-full px-[1rem] py-[.3rem] font-medium whitespace-nowrap ${statusMap[order.status]?.color ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {statusMap[order.status]?.label ?? order.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex items-center justify-center gap-[.8rem]">
                      <button
                        className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-blue-50 text-blue-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap"
                        onClick={() => setDetailOrder(order)}
                      >
                        <FontAwesomeIcon icon={faReceipt} />
                        Chi tiết
                      </button>
                      {!isFinalStatus(order.status) && (
                        <button
                          className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-green-50 text-green-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-green-100 transition-colors whitespace-nowrap"
                          onClick={() => setUpdateStatusOrder(order)}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Xác nhận
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

      {detailOrder && (
        <DetailForAdmin detail={detailOrder} setShowDetail={setDetailOrder} />
      )}

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
                }}
              />
            </div>

            <select
              className="w-full h-[4.4rem] border border-gray-300 outline-none px-[1.5rem] rounded-[.5rem] focus:border-cyan-500 transition-all"
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
              <option value="PREPARING">Đang chuẩn bị</option>
              <option value="READY">Sẵn sàng phục vụ</option>
              <option value="WAITPAYMENT">Chờ thanh toán</option>
              <option value="PAID">Thanh toán thành công</option>
              <option value="CANCELLED">Hủy đơn hàng</option>
            </select>

            {messageUpdate && (
              <p className="text-red-500 text-[1.6rem] mt-[.8rem]">
                {messageUpdate}
              </p>
            )}

            <div className="flex items-center justify-end gap-[1rem] mt-[2rem]">
              <button
                className="px-[2rem] py-[1rem] rounded-[.8rem] bg-[#e7e7e7] text-gray-700 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setUpdateStatusOrder(null);
                  setMessageUpdate("");
                }}
              >
                Hủy
              </button>
              <button
                className="px-[2rem] py-[1rem] rounded-[.8rem] bg-[#1fc5c5] hover:bg-[#0cb7b7] text-white cursor-pointer disabled:opacity-60 transition-colors"
                onClick={handleUpdateStatus}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Đang lưu..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDish;
