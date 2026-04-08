import { faEye, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllTransactions } from "../../../../apis/inventory.api";
import { formatPrice } from "../../../../utils/formatPrice";
import DetailModal from "./DetailModal";

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </td>
    </tr>
  );
}

function HistoryTransaction() {
  const [queryInput, setQueryInput] = useState({
    ingredientName: "",
    type: "",
    createdAt: "",
  });
  const [queryDefault, setQueryDefault] = useState({
    limit: 10,
    page: 1,
    ...queryInput,
  });
  const [openDetail, setOpenDetail] = useState({
    open: false,
    data: null,
  });
  const { data: dataTransactions, isLoading } = useQuery({
    queryKey: ["inventoryTransactions", queryDefault],
    queryFn: () => getAllTransactions(queryDefault),
  });
  const transactions = dataTransactions?.data || [];

  const handleFilter = () => {
    setQueryDefault((prev) => ({
      ...prev,
      ...queryInput,
    }));
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div>
        <h3 className="text-[2.2rem] font-semibold text-gray-800">
          Lịch sử giao dịch
        </h3>
        <p className="text-gray-500">
          Xem lịch sử các giao dịch liên quan đến tồn kho.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
          <input
            type="text"
            name="ingredientName"
            value={queryInput.ingredientName}
            onChange={(e) =>
              setQueryInput((prev) => ({
                ...prev,
                ingredientName: e.target.value,
              }))
            }
            placeholder="Tìm tên nguyên liệu..."
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>

        <input
          type="date"
          name="createdAt"
          value={queryInput.createdAt}
          onChange={(e) =>
            setQueryInput((prev) => ({
              ...prev,
              createdAt: e.target.value,
            }))
          }
          max={new Date().toISOString().split("T")[0]}
          className="w-full h-[4.2rem] px-5 border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
        />
        <select
          name="type"
          value={queryInput.type}
          className="w-full h-[4.2rem] px-4 border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          id="type"
          onChange={(e) =>
            setQueryInput((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
        >
          <option value="">Tất cả loại giao dịch</option>
          <option value="stock_in">Nhập hàng</option>
          <option value="stock_out">Xuất hàng</option>
        </select>
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
                Mã giao dịch
              </th>
              <th className="p-5 font-medium border-r border-gray-200 ">
                Nguyên liệu
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Số lượng
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Giá
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Loại giao dịch
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
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  Không có giao dịch nào để hiển thị.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {transaction.id}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      {transaction.ingredient.name}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      {transaction.quantity}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      {formatPrice(transaction.costPrice)}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      {transaction.type === "stock_in"
                        ? "Nhập hàng"
                        : "Xuất hàng"}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => {
                            setOpenDetail({
                              open: true,
                              data: transaction,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Chi tiết</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {openDetail.open && (
        <DetailModal
          open={openDetail.open}
          data={openDetail.data}
          onClose={() =>
            setOpenDetail({
              open: false,
              data: null,
            })
          }
        />
      )}
    </div>
  );
}

export default HistoryTransaction;
