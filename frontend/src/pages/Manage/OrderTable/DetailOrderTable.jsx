import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChair,
  faClock,
  faCalendarDays,
  faUser,
  faUsers,
  faUtensils,
  faReceipt,
  faCheckCircle,
  faXmark,
  faSpinner,
  faStickyNote,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import { getOrderTableById } from "../../../apis/order.api";
import { updateOrderTableStatus } from "../../../apis/order.api";

const STATUS_MAP = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-400",
  },
  CONFIRM: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800",
    dot: "bg-blue-400",
  },
  CHECKED_IN: {
    label: "Khách đã đến",
    color: "bg-purple-100 text-purple-800",
    dot: "bg-purple-400",
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "bg-teal-100 text-teal-800",
    dot: "bg-teal-400",
  },
  NO_SHOW: {
    label: "Khách không đến",
    color: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-400",
  },
};

const ORDER_STATUS_MAP = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  CONFIRM: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Đang chuẩn bị", color: "bg-purple-100 text-purple-800" },
  READY: { label: "Sẵn sàng", color: "bg-indigo-100 text-indigo-800" },
  WAITPAYMENT: {
    label: "Chờ thanh toán",
    color: "bg-amber-100 text-amber-800",
  },
  PAID: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
  COMPLETED: { label: "Hoàn thành", color: "bg-teal-100 text-teal-800" },
};

const VALID_STATUSES = [
  "PENDING",
  "CONFIRM",
  "CHECKED_IN",
  "COMPLETED",
  "NO_SHOW",
  "CANCELLED",
];
const FINAL_STATUSES = ["COMPLETED", "CANCELLED", "NO_SHOW"];

function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-[2rem]">
      <div className="h-[8rem] bg-gray-200 rounded-[.8rem]" />
      <div className="grid grid-cols-3 gap-[1.5rem]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[10rem] bg-gray-200 rounded-[.8rem]" />
        ))}
      </div>
      <div className="h-[20rem] bg-gray-200 rounded-[.8rem]" />
    </div>
  );
}

function InfoCard({ icon, label, value, accent = false }) {
  return (
    <div className="flex items-start gap-[1.2rem] p-[1.5rem] rounded-[.8rem] border border-gray-200 bg-white">
      <div
        className={`w-[4rem] h-[4rem] rounded-[.8rem] flex items-center justify-center flex-shrink-0 ${accent ? "bg-cyan-50" : "bg-gray-50"}`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`text-[1.8rem] ${accent ? "text-cyan-500" : "text-gray-400"}`}
        />
      </div>
      <div>
        <p className="text-[1.3rem] text-gray-400">{label}</p>
        <p className="text-[1.6rem] font-semibold text-gray-800 mt-[.2rem]">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

function DetailOrderTable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["orderTable", id],
    queryFn: () => getOrderTableById(id),
    enabled: !!id,
  });

  const detail = res?.data ?? null;

  const statusMutation = useMutation({
    mutationFn: ({ orderTableId, status }) =>
      updateOrderTableStatus({ orderTableId, status }),
    onSuccess: (res) => {
      if (res?.errCode === 0) {
        queryClient.invalidateQueries({ queryKey: ["orderTable", id] });
        queryClient.invalidateQueries({ queryKey: ["order-tables"] });
        setShowStatusModal(false);
        setNewStatus("");
        setStatusError("");
      } else {
        setStatusError(res?.message || "Cập nhật thất bại!");
      }
    },
  });

  const handleUpdateStatus = () => {
    if (!newStatus) {
      setStatusError("Vui lòng chọn trạng thái!");
      return;
    }
    statusMutation.mutate({ orderTableId: id, status: newStatus });
  };

  const isFinal = detail && FINAL_STATUSES.includes(detail.status);
  const statusInfo = detail
    ? (STATUS_MAP[detail.status] ?? {
        label: detail.status,
        color: "bg-gray-100 text-gray-600",
        dot: "bg-gray-400",
      })
    : null;

  const totalRevenue = (detail?.orders ?? []).reduce(
    (sum, o) =>
      sum + (o.status !== "CANCELLED" ? Number(o.totalAmount ?? 0) : 0),
    0,
  );

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-[2rem] min-h-[calc(100vh-10rem)]">
      <div className="flex items-center gap-[1.5rem]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[3.8rem] h-[3.8rem] rounded-[.8rem] border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex-1">
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Chi tiết đơn đặt bàn
            {detail && (
              <span className="text-gray-400 font-normal ml-[.8rem]">
                #{detail.id}
              </span>
            )}
          </h3>
          <p className="text-gray-500">Xem thông tin và quản lý đơn đặt bàn.</p>
        </div>
        {detail && !isFinal && (
          <button
            onClick={() => {
              setShowStatusModal(true);
              setNewStatus("");
              setStatusError("");
            }}
            className="flex items-center gap-[.8rem] px-[2rem] py-[1rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 text-white text-[1.6rem] font-medium transition-colors"
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            Cập nhật trạng thái
          </button>
        )}
      </div>

      {isLoading ? (
        <SkeletonDetail />
      ) : !detail ? (
        <div className="py-[6rem] text-center text-gray-400 text-[1.6rem]">
          Không tìm thấy đơn đặt bàn
        </div>
      ) : (
        <>
          <div
            className={`inline-block px-[2rem] py-[1.4rem] rounded-full border ${statusInfo.color} border-transparent`}
          >
            <div className="flex items-center gap-[1rem]">
              <span
                className={`w-[1rem] h-[1rem] rounded-full ${statusInfo.dot}`}
              />
              <span className="text-[1.6rem] font-semibold">
                {statusInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-[1.5rem] text-[1.4rem] opacity-80">
              <span>
                Tạo lúc: {moment(detail.createdAt).format("DD/MM/YYYY HH:mm")}
              </span>
              {detail.updatedAt !== detail.createdAt && (
                <span>
                  Cập nhật:{" "}
                  {moment(detail.updatedAt).format("DD/MM/YYYY HH:mm")}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1.5rem]">
            <InfoCard
              icon={faChair}
              label="Tên bàn"
              value={detail.table?.name}
              accent
            />
            <InfoCard
              icon={faCalendarDays}
              label="Ngày đến"
              value={moment(detail.orderDate).format("dddd, DD/MM/YYYY")}
              accent
            />
            <InfoCard
              icon={faClock}
              label="Khung giờ"
              value={
                detail.timeFrame
                  ? `${detail.timeFrame.startTime} – ${detail.timeFrame.endTime}`
                  : "—"
              }
              accent
            />
            <InfoCard
              icon={faUser}
              label="Khách hàng"
              value={detail.user?.fullName ?? detail.fullName}
            />
            <InfoCard
              icon={faUsers}
              label="Số khách"
              value={`${detail.numberGuests} người`}
            />
            <InfoCard
              icon={faReceipt}
              label="Tổng doanh thu"
              value={
                totalRevenue > 0
                  ? `${Number(totalRevenue).toLocaleString("vi-VN")}đ`
                  : "Chưa có"
              }
            />
          </div>

          {detail.note && (
            <div className="flex items-start gap-[1rem] px-[1.5rem] py-[1.2rem] bg-amber-50 border border-amber-200 rounded-[.8rem]">
              <FontAwesomeIcon
                icon={faStickyNote}
                className="text-amber-500 text-[1.6rem] mt-[.2rem] flex-shrink-0"
              />
              <p className="text-[1.5rem] text-amber-800">{detail.note}</p>
            </div>
          )}

          {detail.cancelReason && (
            <div className="flex items-start gap-[1rem] px-[1.5rem] py-[1.2rem] bg-red-50 border border-red-200 rounded-[.8rem]">
              <FontAwesomeIcon
                icon={faXmark}
                className="text-red-500 text-[1.6rem] mt-[.2rem] flex-shrink-0"
              />
              <div>
                <p className="text-[1.4rem] font-medium text-red-700 mb-[.2rem]">
                  Lý do hủy
                </p>
                <p className="text-[1.5rem] text-red-600">
                  {detail.cancelReason}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-[.8rem] border border-gray-200 overflow-hidden">
            <div className="px-[2rem] py-[1.4rem] bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h4 className="text-[1.6rem] font-semibold text-gray-800 flex items-center gap-[.8rem]">
                <FontAwesomeIcon icon={faUtensils} className="text-cyan-500" />
                Đơn món ăn
                <span className="text-[1.4rem] font-normal text-gray-400">
                  ({detail.orders?.length ?? 0} đơn)
                </span>
              </h4>
              {totalRevenue > 0 && (
                <span className="text-[1.6rem] font-semibold text-red-500">
                  Tổng: {Number(totalRevenue).toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            {!detail.orders || detail.orders.length === 0 ? (
              <div className="py-[4rem] text-center text-gray-400 text-[1.6rem]">
                <FontAwesomeIcon
                  icon={faUtensils}
                  className="text-[3rem] mb-[1rem] block mx-auto text-gray-200"
                />
                Chưa có đơn món nào
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {detail.orders.map((order) => {
                  const oStatus = ORDER_STATUS_MAP[order.status] ?? {
                    label: order.status,
                    color: "bg-gray-100 text-gray-600",
                  };
                  const isExpanded = expandedOrderId === order.id;
                  const orderTotal = (order.orderItems ?? []).reduce(
                    (sum, item) =>
                      sum + Number(item.price ?? 0) * (item.quantity ?? 0),
                    0,
                  );

                  return (
                    <div key={order.id}>
                      <div
                        className="flex items-center gap-[1.5rem] px-[2rem] py-[1.4rem] hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order.id)
                        }
                      >
                        <span className="text-[1.5rem] text-gray-500 w-[6rem]">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[1.4rem] px-[1rem] py-[.3rem] rounded-full font-medium whitespace-nowrap ${oStatus.color}`}
                        >
                          {oStatus.label}
                        </span>
                        <span className="text-[1.5rem] text-gray-500 flex-1">
                          {order.orderItems?.length ?? 0} món
                        </span>
                        <span className="text-[1.5rem] font-semibold text-red-500">
                          {Number(
                            order.totalAmount ?? orderTotal,
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                        <span className="text-[1.4rem] text-gray-400">
                          {moment(order.createdAt).format("HH:mm DD/MM")}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-gray-400 text-[1.4rem] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>

                      {isExpanded && (
                        <div className="bg-gray-50 border-t border-gray-100 px-[2rem] py-[1.5rem]">
                          {!order.orderItems ||
                          order.orderItems.length === 0 ? (
                            <p className="text-[1.5rem] text-gray-400 text-center py-[2rem]">
                              Không có món
                            </p>
                          ) : (
                            <div className="space-y-[.8rem]">
                              {order.orderItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-[1.2rem] bg-white rounded-[.6rem] p-[1rem] border border-gray-100"
                                >
                                  <img
                                    src={
                                      item.food?.image ||
                                      "/placeholder-food.png"
                                    }
                                    alt={item.foodName}
                                    className="w-[4.8rem] h-[4.8rem] rounded-[.6rem] object-cover bg-gray-100 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[1.5rem] font-medium text-gray-800 truncate">
                                      {item.foodName || item.food?.name}
                                    </p>
                                    <p className="text-[1.3rem] text-gray-400">
                                      {Number(item.price).toLocaleString(
                                        "vi-VN",
                                      )}
                                      đ × {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-[1.5rem] font-semibold text-gray-700 flex-shrink-0">
                                    {Number(
                                      item.price * item.quantity,
                                    ).toLocaleString("vi-VN")}
                                    đ
                                  </p>
                                </div>
                              ))}
                              <div className="flex justify-end pt-[.8rem] border-t border-gray-200">
                                <span className="text-[1.5rem] text-gray-500 mr-[1rem]">
                                  Tổng đơn này:
                                </span>
                                <span className="text-[1.6rem] font-semibold text-red-500">
                                  {Number(
                                    order.totalAmount ?? orderTotal,
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#6060606d] z-[950]">
          <div className="w-[44rem] h-auto p-[3rem] rounded-[1rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between mb-[2.5rem]">
              <div className="flex items-center gap-[1rem]">
                <div className="w-[4rem] h-[4rem] rounded-[.8rem] bg-cyan-50 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-cyan-500 text-[1.8rem]"
                  />
                </div>
                <h3 className="text-[1.8rem] font-semibold text-gray-800">
                  Cập nhật trạng thái
                  <span className="text-cyan-500 ml-[.6rem]">
                    #{detail?.id}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusError("");
                }}
                className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="text-[1.8rem]" />
              </button>
            </div>

            <div className="mb-[1.5rem] px-[1.4rem] py-[1rem] bg-gray-50 rounded-[.6rem] flex items-center gap-[.8rem]">
              <span className="text-[1.4rem] text-gray-500">Hiện tại:</span>
              <span
                className={`text-[1.4rem] px-[1rem] py-[.2rem] rounded-full font-medium ${statusInfo?.color}`}
              >
                {statusInfo?.label}
              </span>
            </div>

            <select
              className="w-full h-[4.4rem] border border-gray-300 outline-none px-[1.5rem] rounded-[.6rem] focus:border-cyan-500 transition-all text-[1.6rem]"
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setStatusError("");
              }}
            >
              <option value="" hidden>
                Chọn trạng thái mới
              </option>
              {VALID_STATUSES.filter((s) => s !== detail?.status).map((s) => (
                <option key={s} value={s}>
                  {STATUS_MAP[s]?.label ?? s}
                </option>
              ))}
            </select>

            {statusError && (
              <p className="text-red-500 text-[1.4rem] mt-[.8rem]">
                {statusError}
              </p>
            )}

            <div className="flex items-center justify-end gap-[1rem] mt-[2.5rem]">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusError("");
                }}
                className="px-[2.4rem] py-[1rem] rounded-[.8rem] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-[1.6rem] cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={statusMutation.isPending}
                className="flex items-center gap-[.6rem] px-[2.4rem] py-[1rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-[1.6rem] font-medium transition-colors cursor-pointer"
              >
                {statusMutation.isPending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailOrderTable;
