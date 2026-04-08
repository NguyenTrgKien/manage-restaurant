import { faAdd, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllInventory } from "../../../apis/inventory.api";
import { formatPrice } from "../../../utils/formatPrice";

function StatsInventory({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-[1.2rem]">
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">
          Tổng nguyên liệu
        </p>
        <p className="text-[2.5rem]  text-blue-600 font-semibold">
          {stats.totalProducts}
        </p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem] ">
          Tổng số lượng nguyên liệu
        </p>
        <p className="text-[2.5rem]  text-green-700 font-semibold">
          {stats.totalQuantity}
        </p>
        <p className="text-[1.2rem] text-gray-500 mt-[.4rem]">tổng số lượng</p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem] ">
          Tổng giá trị hàng tồn
        </p>
        <p className="text-[2.5rem]  text-amber-700 font-semibold">
          {formatPrice(stats.totalValue)}
        </p>
        <p className="text-[1.2rem] text-gray-500 mt-[.4rem]">tổng giá trị</p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-400 mb-[.6rem] ">
          Tống sản phẩm sắp hết
        </p>
        <p className="text-[2.5rem]  text-red-700 font-semibold">
          {stats.lowStock}
        </p>
        <p className="text-[1.2rem] text-gray-400 mt-[.4rem]">tổng số lượng</p>
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

function Inventory() {
  const [queryInput, setQueryInput] = useState({
    name: "",
  });
  const [queryDefault, setQueryDefault] = useState({
    limit: 10,
    page: 1,
    ...queryInput,
  });
  const { data: inventoriesData, isLoading } = useQuery({
    queryKey: ["inventories", queryDefault],
    queryFn: () => getAllInventory(queryDefault),
  });

  const inventories = inventoriesData?.data || [];

  const stats = {
    totalProducts: inventories.length,
    lowStock: inventories.filter(
      (inventory) =>
        inventory.ingredient.minStock >= inventory.quantity &&
        inventory.quantity > 0,
    ).length,
    totalValue: inventories.reduce(
      (acc, inventory) =>
        acc + Number(inventory.quantity) * Number(inventory.avgPrice),
      0,
    ),
    totalQuantity: inventories.reduce(
      (acc, inventory) => acc + Number(inventory.quantity),
      0,
    ),
  };

  const handleFilter = () => {
    setQueryDefault((prev) => ({ ...prev, ...queryInput, page: 1 }));
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý tồn kho
          </h3>
          <p className="text-gray-500">Quản lý toàn bộ tồn kho của nhà hàng.</p>
        </div>
      </div>

      <StatsInventory stats={stats} />

      <div className="grid grid-cols-4 gap-5">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
          <input
            type="text"
            name="foodName"
            placeholder="Tìm tên món ăn..."
            value={queryInput.name || ""}
            onChange={(e) =>
              setQueryInput((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>
        <select
          name="status"
          value={queryInput.status || ""}
          onChange={(e) =>
            setQueryInput((prev) => ({ ...prev, status: e.target.value }))
          }
          className="w-full h-[4.2rem] px-4 border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          id="status"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="in_stock">Còn hàng</option>
          <option value="low_stock">Sắp hết hàng</option>
          <option value="out_of_stock">Hết hàng</option>
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
                Sản phẩm
              </th>
              <th className="p-5 font-medium border-r border-gray-200 ">
                Giá gốc / Tổng
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Số lượng
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
            ) : inventories.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  Không có sản phẩm nào trong kho.
                </td>
              </tr>
            ) : (
              inventories.map((inventory) => {
                return (
                  <tr
                    key={inventory.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {inventory.ingredient.name}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      {formatPrice(inventory.avgPrice)} /{" "}
                      {formatPrice(inventory.avgPrice * inventory.quantity)}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      {inventory.quantity} {inventory.ingredient.unit}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      {inventory.quantity > inventory.ingredient.minStock && (
                        <span className="bg-green-100 text-green-800 px-5 py-2 rounded-full">
                          Còn hàng
                        </span>
                      )}
                      {inventory.quantity < inventory.ingredient.minStock &&
                        inventory.quantity > 0 && (
                          <span className="bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full">
                            Tồn kho thấp
                          </span>
                        )}
                      {inventory.quantity === 0 && (
                        <span className="bg-red-100 text-red-800 px-5 py-2 rounded-full">
                          Hết hàng
                        </span>
                      )}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white">
                          Chi tiết
                        </button>
                        <Link
                          to={"stock-in"}
                          className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Nhập hàng
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

export default Inventory;
