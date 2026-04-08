import { useNavigate, useParams } from "react-router";
import {
  approveReceipt,
  getReceiptById,
  rejectReceipt,
} from "../../../../apis/inventory.api";
import { useQuery } from "@tanstack/react-query";
import { ReceiptStatus } from "../../../../constants/inventory";
import { useAuth } from "../../../../hooks/useAuth";
import dayjs from "dayjs";
import { formatPrice } from "../../../../utils/formatPrice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faCheck,
  faEdit,
  faPrint,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Invoice from "./Invoice";

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    </div>
  );
}

function Detail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejecting, setRejecting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const receiptId = parseInt(id, 10);
  const componentRef = useRef();
  const { data: dataReceipt, refetch } = useQuery({
    queryKey: ["receipt", receiptId],
    queryFn: () => getReceiptById(receiptId),
  });

  const handleConfirmApprove = async () => {
    try {
      setIsLoading(true);
      const response = await approveReceipt(receiptId);
      refetch();
      toast.success(response.data.message || "Duyệt phiếu nhập thành công!");
      setConfirming(false);
      navigate("/manage/inventory-receipts");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Duyệt phiếu nhập thất bại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    try {
      setIsLoading(true);
      const response = await rejectReceipt(receiptId, reason);
      toast.success(response.data.message || "Từ chối phiếu nhập thành công!");
      setRejecting(false);
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Từ chối phiếu nhập thất bại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Hoa-don-${dataReceipt?.data?.receiptCode}`,
    pageStyle: `
        @page {
          size: A4;
          margin: 20mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
    `,
  });

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div>
        <button
          type="button"
          className="bg-gray-200 rounded-sm px-5 py-2 text-gray-700 cursor-pointer"
          onClick={() => navigate("/manage/inventory-receipts")}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
          <span>Quay lại</span>
        </button>
      </div>
      <div className="w-7xl h-auto rounded-xl shadow-md p-10 mx-auto border border-gray-200">
        <h3 className="text-[2rem] text-center font-semibold mb-10">
          Thông tin phiếu nhập
        </h3>
        {dataReceipt ? (
          <div className="flex items-start justify-between flex-wrap gap-10">
            <div className="space-y-5">
              <p>
                <strong>Mã phiếu nhập:</strong> {dataReceipt.data.receiptCode}
              </p>
              <p>
                <strong>Nhà cung cấp:</strong>{" "}
                {dataReceipt.data.supplier?.name || "N/A"}
              </p>
              <p>
                <strong>SĐT nhà cung cấp:</strong>{" "}
                {dataReceipt.data.supplier?.phone || "N/A"}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {ReceiptStatus[dataReceipt.data.status].label || "N/A"}
              </p>
              {dataReceipt.data.status === "cancelled" && (
                <p>
                  <strong>Lý do hủy:</strong>{" "}
                  {dataReceipt.data.cancelReason || "N/A"}
                </p>
              )}
            </div>
            <div className="space-y-5">
              <p>
                <strong>Nhân viên:</strong>{" "}
                {Number(dataReceipt.data.createdBy) === user.id
                  ? user.fullName
                  : "N/A"}
              </p>
              <p>
                <strong>Ngày nhập:</strong>{" "}
                {dayjs(dataReceipt.data.receiptDate).format("DD/MM/YYYY") ||
                  "N/A"}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {formatPrice(dataReceipt.data.totalAmount)}
              </p>
            </div>
            <div className="w-full">
              <h4 className="text-[1.6rem] font-semibold mt-6 mb-4">
                Chi tiết nguyên liệu:
              </h4>
              <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
                <table className="w-full text-[1.6rem] border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
                      <th className="p-5 font-medium border-r border-gray-200">
                        Tên nguyên liệu
                      </th>
                      <th className="p-5 font-medium border-r border-gray-200 text-center">
                        Số lượng
                      </th>
                      <th className="p-5 font-medium border-r border-gray-200 text-center">
                        Đơn giá
                      </th>
                      <th className="p-5 font-medium border-r border-gray-200 text-center">
                        Ngày sản xuất
                      </th>
                      <th className="p-5 font-medium border-r border-gray-200 text-center">
                        Ngày hết hạn
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataReceipt.data.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.ingredient?.name || "N/A"}
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {formatPrice(item.unitPrice)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {dayjs(item.manufactureDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {dayjs(item.expiryAt).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end gap-3 mt-5">
                {dataReceipt.data.status === "completed" && (
                  <button
                    className="mt-6 px-6 py-3 space-x-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handlePrint}
                  >
                    <FontAwesomeIcon icon={faPrint} />
                    <span>In phiếu nhập</span>
                  </button>
                )}
                {dataReceipt.data.status === "draft" && (
                  <button
                    className="mt-6 px-6 py-3 space-x-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() =>
                      navigate(`/manage/inventory-receipts/edit/${receiptId}`)
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
                {dataReceipt.data.status === "cancelled" && (
                  <button className="mt-6 px-6 py-3 space-x-2 rounded-md bg-red-500 text-white">
                    <span>Đã hủy</span>
                  </button>
                )}
                {dataReceipt.data.status === "draft" && (
                  <>
                    <button
                      className="mt-6 px-6 py-3 space-x-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setRejecting(true)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Từ chối phiếu nhập</span>
                    </button>
                    <button
                      className="mt-6 px-6 py-3 space-x-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => setConfirming(true)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      <span>Duyệt phiếu nhập</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      <AnimatePresence>
        {rejecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#41414152] z-[500] bg-opacity-50 flex items-center justify-center "
          >
            <div className="bg-white p-10 rounded-md shadow-md w-[50rem]">
              <h3 className="text-[1.8rem] mb-4 font-bold">
                Xác nhận từ chối phiếu nhập
              </h3>
              <div className="mb-6 w-full">
                <label>Vui lòng nhập lý do từ chối phiếu nhập (optional)</label>
                <textarea
                  className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  placeholder="Nhập lý do từ chối..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                  onClick={() => setRejecting(false)}
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleConfirmReject()}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#41414152] z-[500] bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-10 rounded-md shadow-md w-[400px]">
              <h3 className="text-[1.8rem] mb-8">Xác nhận duyệt phiếu nhập</h3>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                  onClick={() => setConfirming(false)}
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleConfirmApprove()}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Invoice prop={dataReceipt} ref={componentRef} />
    </div>
  );
}

export default Detail;
