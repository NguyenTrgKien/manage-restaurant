import dayjs from "dayjs";
import { forwardRef } from "react";
import { formatPrice } from "../../../../utils/formatPrice";

const Invoice = forwardRef(({ prop }, ref) => {
  const receipt = prop?.data;

  return (
    <div ref={ref} className="hidden print:block p-10 font-sans text-[14px]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">PHIẾU NHẬP KHO</h1>
        <p>Mã phiếu: {receipt?.receiptCode}</p>
        <p>Ngày: {dayjs(receipt?.receiptDate).format("DD/MM/YYYY")}</p>
      </div>

      <div className="mb-4 space-y-1">
        <p>
          <strong>Nhà cung cấp:</strong> {receipt?.supplier?.name || "N/A"}
        </p>
        <p>
          <strong>SĐT:</strong> {receipt?.supplier?.phone || "N/A"}
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-400 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 p-2 text-left">
              Nguyên liệu
            </th>
            <th className="border border-gray-400 p-2 text-center">Số lượng</th>
            <th className="border border-gray-400 p-2 text-center">Đơn giá</th>
            <th className="border border-gray-400 p-2 text-center">NSX</th>
            <th className="border border-gray-400 p-2 text-center">HSD</th>
          </tr>
        </thead>
        <tbody>
          {receipt?.items?.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-400 p-2">
                {item.ingredient?.name}
              </td>
              <td className="border border-gray-400 p-2 text-center">
                {item.quantity}
              </td>
              <td className="border border-gray-400 p-2 text-center">
                {formatPrice(item.unitPrice)}
              </td>
              <td className="border border-gray-400 p-2 text-center">
                {dayjs(item.manufactureDate).format("DD/MM/YYYY")}
              </td>
              <td className="border border-gray-400 p-2 text-center">
                {dayjs(item.expiryAt).format("DD/MM/YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold text-lg">
        Tổng tiền: {formatPrice(receipt?.totalAmount)}
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";
export default Invoice;
