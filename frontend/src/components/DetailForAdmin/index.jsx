import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

const STATUS_LABEL = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  CONFIRM: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Đang chuẩn bị", color: "bg-purple-100 text-purple-800" },
  READY: { label: "Sẵn sàng", color: "bg-indigo-100 text-indigo-800" },
  WAITPAYMENT: {
    label: "Chờ thanh toán",
    color: "bg-amber-100 text-amber-800",
  },
  PAID: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Hoàn thành", color: "bg-teal-100 text-teal-800" },
  CHECKED_IN: { label: "Khách đã đến", color: "bg-purple-100 text-purple-800" },
  NO_SHOW: { label: "Khách không đến", color: "bg-gray-100 text-gray-800" },
};

function DetailForAdmin({ detail, setShowDetail }) {
  const isOrderTable = !!detail.orderDate;
  const isOrder = !!detail.orderItems || !!detail.totalAmount;

  const statusInfo = STATUS_LABEL[detail.status] ?? {
    label: detail.status,
    color: "bg-gray-100 text-gray-800",
  };

  const customerName = detail.fullName || detail.user?.fullName || "—";

  const tableName = detail.table?.name || detail.orderTable?.table?.name || "—";

  const timeFrameText = detail.timeFrame
    ? `${detail.timeFrame.startTime} – ${detail.timeFrame.endTime}`
    : detail.orderTable?.timeFrame
      ? `${detail.orderTable.timeFrame.startTime} – ${detail.orderTable.timeFrame.endTime}`
      : null;

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center bg-[#50505063]">
      <div className="w-[95%] max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[2rem] font-bold">
                Chi tiết đơn #{detail.id}
              </h2>
              <span
                className={`text-[1.3rem] mt-2 inline-flex items-center px-[1rem] py-[.3rem] rounded-full font-medium ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <button
              onClick={() => setShowDetail(null)}
              className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[2rem]" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-[.8rem]">
              {tableName !== "—" && (
                <div className="flex items-center gap-[.8rem]">
                  <span className="text-gray-500 text-[1.5rem]">Bàn:</span>
                  <span className="font-semibold text-[1.6rem] text-gray-800">
                    {tableName}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-[.8rem]">
                <span className="text-gray-500 text-[1.5rem]">Khách hàng:</span>
                <span className="font-semibold text-[1.6rem] text-gray-800">
                  {customerName}
                </span>
              </div>
              <div className="flex items-center gap-[.8rem]">
                <span className="text-gray-500 text-[1.5rem]">Ngày tạo:</span>
                <span className="text-[1.5rem] text-gray-700">
                  {moment(detail.createdAt).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
              {isOrderTable && (
                <div className="flex items-center gap-[.8rem]">
                  <span className="text-gray-500 text-[1.5rem]">Số khách:</span>
                  <span className="text-[1.5rem] text-gray-700">
                    {detail.numberGuests} người
                  </span>
                </div>
              )}
              {detail.cancelReason && (
                <div className="flex items-center gap-[.8rem]">
                  <span className="text-gray-500 text-[1.5rem]">
                    Lý do hủy:
                  </span>
                  <span className="text-[1.5rem] text-red-500">
                    {detail.cancelReason}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-[.8rem]">
              {isOrderTable && (
                <>
                  <div className="flex items-center gap-[.8rem]">
                    <span className="text-gray-500 text-[1.5rem]">
                      Ngày đến:
                    </span>
                    <span className="text-[1.5rem] text-gray-700">
                      {moment(detail.orderDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  {timeFrameText && (
                    <div className="flex items-center gap-[.8rem]">
                      <span className="text-gray-500 text-[1.5rem]">
                        Khung giờ:
                      </span>
                      <span className="text-[1.5rem] text-gray-700">
                        {timeFrameText}
                      </span>
                    </div>
                  )}
                  {detail.note && (
                    <div className="flex items-center gap-[.8rem]">
                      <span className="text-gray-500 text-[1.5rem]">
                        Ghi chú:
                      </span>
                      <span className="text-[1.5rem] text-gray-700">
                        {detail.note}
                      </span>
                    </div>
                  )}
                </>
              )}

              {isOrder && (
                <>
                  <div className="flex items-center gap-[.8rem]">
                    <span className="text-gray-500 text-[1.5rem]">
                      Tổng tiền:
                    </span>
                    <span className="font-bold text-[1.6rem] text-red-500">
                      {Number(detail.totalAmount).toLocaleString("vi-VN", {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                      ₫
                    </span>
                  </div>
                  <div className="flex items-center gap-[.8rem]">
                    <span className="text-gray-500 text-[1.5rem]">
                      Thanh toán:
                    </span>
                    <span className="text-[1.5rem] text-gray-700">
                      {detail.paymentMethod === "MOMO"
                        ? "Ví MoMo"
                        : detail.paymentMethod === "CASH"
                          ? "Tiền mặt"
                          : (detail.paymentMethod ?? "—")}
                    </span>
                  </div>
                  {detail.paidAt && (
                    <div className="flex items-center gap-[.8rem]">
                      <span className="text-gray-500 text-[1.5rem]">
                        Thanh toán lúc:
                      </span>
                      <span className="text-[1.5rem] text-gray-700">
                        {moment(detail.paidAt).format("DD/MM/YYYY HH:mm")}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-[1.5rem]">
            {detail?.orderItems?.length > 0 ? (
              <>
                <h3 className="font-semibold text-[1.6rem] text-gray-800 mb-[1.2rem]">
                  Danh sách món ({detail.orderItems.length})
                </h3>
                <div className="space-y-[1rem] max-h-[32rem] overflow-y-auto pr-2">
                  {detail.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-[1.2rem] bg-gray-50 hover:bg-gray-100 rounded-[.8rem] transition-colors"
                    >
                      <img
                        src={item.food?.image || "/placeholder-food.png"}
                        alt={item.foodName}
                        className="w-[5.6rem] h-[5.6rem] rounded-[.6rem] object-cover bg-gray-200 flex-shrink-0"
                      />
                      <div className="ml-[1.2rem] flex-1 min-w-0">
                        <h4 className="font-medium text-[1.6rem] text-gray-900 truncate">
                          {item.foodName || item.food?.name}
                        </h4>
                        <p className="text-[1.4rem] text-gray-500">
                          {Number(item.price).toLocaleString("vi-VN")}₫ ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="ml-[1.2rem] text-right flex-shrink-0">
                        <p className="font-semibold text-[1.6rem] text-gray-800">
                          {Number(item.price * item.quantity).toLocaleString(
                            "vi-VN",
                            {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            },
                          )}
                          ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <span className="text-[1.5rem] text-amber-700 bg-amber-100 px-[2rem] py-[.8rem] rounded-full font-medium">
                  Đơn này chỉ đặt bàn, chưa có món
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowDetail(null)}
              className="px-[2.4rem] py-[1rem] bg-gray-100 hover:bg-gray-200 text-gray-700 text-[1.6rem] rounded-[.8rem] font-medium transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailForAdmin;
