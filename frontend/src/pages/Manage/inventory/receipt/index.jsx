import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "../../../../utils/formatPrice";
import { getAllReceipt } from "../../../../apis/inventory.api";
import { useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { ReceiptStatus } from "../../../../constants/inventory";
import { getAllSuppliers } from "../../../../apis/supplier.api";

function StatReceipt({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-[1.2rem]">
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">
          Tổng phiếu nhập
        </p>
        <p className="text-[2.5rem] text-blue-600 font-semibold">
          {stats.totalReceipts}
        </p>
      </div>

      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">Chờ duyệt</p>
        <p className="text-[2.5rem] text-yellow-600 font-semibold">
          {stats.pendingReceipts}
        </p>
      </div>

      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">Đã duyệt</p>
        <p className="text-[2.5rem] text-green-600 font-semibold">
          {stats.completedReceipts}
        </p>
      </div>

      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">
          Tổng giá trị nhập
        </p>
        <p className="text-[2.5rem] text-red-600 font-semibold">
          {formatPrice(stats.totalAmount)}
        </p>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
      <td className="p-5 text-gray-500 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </td>
    </tr>
  );
}

function Receipt() {
  const [queryInput, setQueryInput] = useState({
    supplierId: "",
    receiptDate: "",
    receiptCode: "",
    status: "",
  });
  const [queryDefault, setQueryDefault] = useState({
    page: 1,
    limit: 10,
    ...queryInput,
  });
  const {
    data: dataReceipt,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "receipts",
      queryDefault.supplierId,
      queryDefault.receiptDate,
      queryDefault.receiptCode,
      queryDefault.status,
    ],
    queryFn: () => getAllReceipt(queryDefault),
  });
  const receipts = dataReceipt?.data || [];
  const { data: dataSuppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliers,
  });
  const suppliers = dataSuppliers?.data || [];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setQueryInput((prev) => ({ ...prev, [name]: value }));
  };

  const stats = {
    totalReceipts: receipts.length,
    pendingReceipts: receipts.filter((r) => r.status === "draft").length,
    completedReceipts: receipts.filter((r) => r.status === "completed").length,
    cancelledReceipts: receipts.filter((r) => r.status === "cancelled").length,
    totalAmount: receipts.reduce(
      (sum, receipt) => sum + Number(receipt.totalAmount),
      0,
    ),
  };

  const handleFilter = () => {
    setQueryDefault((prev) => ({
      ...prev,
      supplierId: queryInput.supplierId,
      receiptDate: queryInput.receiptDate,
      receiptCode: queryInput.receiptCode,
      status: queryInput.status,
    }));
    refetch();
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý phiếu nhập
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ phiếu nhập của nhà hàng.
          </p>
        </div>
      </div>

      <StatReceipt stats={stats} />

      <div className="grid grid-cols-4 gap-5 my-10">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
          <input
            type="text"
            name="receiptCode"
            placeholder="Nhập mã phiếu..."
            value={queryInput.receiptCode || ""}
            onChange={handleChangeInput}
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>
        <select
          name="supplierId"
          value={queryInput.supplierId || ""}
          onChange={handleChangeInput}
          className="w-full h-[4.2rem] px-4 border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          id="supplierId"
        >
          <option value="">-- Chọn nhà cung cấp --</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="receiptDate"
          value={queryInput.receiptDate || ""}
          onChange={handleChangeInput}
          className="w-full h-[4.2rem] px-5 border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          max={new Date().toISOString().split("T")[0]}
        />
        <div className="col-span-1">
          <button
            className="px-6 h-[4.2rem] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleFilter}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200">
                Mã phiếu
              </th>
              <th className="p-5 font-medium border-r border-gray-200 ">
                Nhà cung cấp
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Tổng giá
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Trạng thái
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : receipts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  Không có phiếu nhập nào.
                </td>
              </tr>
            ) : (
              receipts.map((receipt) => {
                const supplier = suppliers.find(
                  (s) => s.id === receipt.supplierId,
                );
                return (
                  <tr
                    key={receipt.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {receipt.receiptCode}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <div>
                        <p>
                          {supplier
                            ? `${supplier.phone} - ${supplier.name}`
                            : "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      {formatPrice(receipt.totalAmount)}
                    </td>
                    <td className={`p-5 border-r border-gray-200 text-center `}>
                      <div className="flex justify-center">
                        <span
                          className={`px-10 py-2 block rounded-full ${ReceiptStatus[receipt.status].color}`}
                        >
                          {ReceiptStatus[receipt.status].label}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Link
                          to={`${receipt.id}`}
                          className="space-x-2 px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Xem</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Receipt;
