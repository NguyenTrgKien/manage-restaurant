import { faEdit, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import EditFood from "../ContentManage/EditFood";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllFood } from "../../../apis/menu.api";
import { useAuth } from "../../../hooks/useAuth";
import DeleteFood from "./DeleteFood";
import { AnimatePresence } from "framer-motion";
import ActionFood from "./ActionFood";
import ToggleStatusFood from "./ToggleStatusFood";

export function FoodCardSkeleton() {
  return (
    <tr className="border-b border-gray-200 animate-pulse">
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>

      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>

      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>

      <td className="p-5 border-r border-gray-200">
        <div className="flex justify-center">
          <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
        </div>
      </td>

      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </td>

      <td className="p-5 border-r border-gray-200">
        <div className="flex items-center gap-2 justify-center">
          <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
          <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
          <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
        </div>
      </td>
    </tr>
  );
}

function Food() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openActionFood, setOpenActionFood] = useState({
    open: false,
    action: "",
    dataUpdate: null,
  });
  const [openToggleStatus, setOpenToggleStatus] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [showEdit, setShowEdit] = useState(null);
  const [valueSearch, setValueSearch] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [searchPrice, setSearchPrice] = useState("asc");
  const [queryFoodDefault, setQueryFoodDefault] = useState({
    limit: 10,
    page: 1,
    name: "",
    price: "asc",
    isActive: undefined,
  });

  const {
    data: dataRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allFood", queryFoodDefault],
    queryFn: () => getAllFood(queryFoodDefault),
  });
  const allFood = dataRes?.data?.data ?? [];

  const handleFilter = () => {
    setQueryFoodDefault((prev) => ({
      ...prev,
      name: valueSearch,
      price: searchPrice,
      isActive: isActive,
    }));
  };

  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[2.2rem] text-gray-800 font-medium">
            Quản lý thực đơn
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ thực đơn của nhà hàng.
          </p>
        </div>
        {user.role === "admin" && (
          <div
            className="px-8 py-4 flex gap-[1rem] justify-center items-center rounded-[1rem] bg-blue-500 cursor-pointer hover:bg-blue-600 transition-all duration-[.25s]"
            onClick={() =>
              setOpenActionFood({
                open: true,
                action: "create",
                dataUpdate: null,
              })
            }
          >
            <FontAwesomeIcon icon={faPlus} className="text-[#fff]" />
            <span className="text-[#fff]">Thêm Món Ăn</span>
          </div>
        )}
      </div>

      <div className="relative flex items-center gap-5">
        <input
          type="text"
          className="w-[16rem] sm:w-[22rem] md:w-[28rem] h-[4rem] md:h-[4.2rem] px-[1rem] pr-[3rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
          value={valueSearch}
          placeholder="Tìm tên món ăn..."
          onChange={(e) => setValueSearch(e.target.value)}
        />
        <select
          name="isActive"
          id="isActive"
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="w-[16rem] sm:w-[22rem] md:w-[28rem] h-[4rem] md:h-[4.2rem] px-[1rem] pr-[3rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
        >
          <option value="true">Đang hoạt động</option>
          <option value="false">Ngừng hoạt động</option>
        </select>
        <select
          name="price"
          id="price"
          value={searchPrice}
          onChange={(e) => setSearchPrice(e.target.value)}
          className="w-[16rem] sm:w-[22rem] md:w-[28rem] h-[4rem] md:h-[4.2rem] px-[1rem] pr-[3rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
        >
          <option value="asc">Cao đến thấp</option>
          <option value="desc">Thấp đến cao</option>
        </select>
        <button
          className="px-8 h-[4rem] md:h-[4.2rem] space-x-2 rounded-[0.75rem] bg-blue-500 text-white transition-all hover:bg-blue-600"
          onClick={handleFilter}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span className="ml-2">Lọc</span>
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200">
                Món ăn
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Giá bán
              </th>
              <th className="p-5 font-medium border-r border-gray-200">Kho</th>
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
              Array.from({ length: 8 }).map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))
            ) : allFood.length > 0 ? (
              allFood.map((food) => {
                console.log(food);

                return (
                  <tr
                    key={food.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      <div className="flex items-center gap-4">
                        <img
                          src={food.image}
                          alt={`image-${food.name}`}
                          className="w-20 h-20 rounded-sm object-cover"
                        />
                        <p className="line-clamp-1">{food.name}</p>
                      </div>
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      {formatPrice(food.price)}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      {food.stock}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <div className="flex justify-center">
                        <span
                          className={`block px-5 py-2 rounded-full ${food.isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"} text-center`}
                        >
                          {food.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <div className="flex items-center gap-2 justify-center">
                        <button className="px-4 py-2 text-[1.4rem] rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                          Chi tiết
                        </button>
                        <button
                          className={`px-4 py-2 text-[1.4rem] space-x-2 rounded-md ${food.isActive ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-green-500 hover:bg-green-600 text-white"} `}
                          onClick={() => setOpenToggleStatus(food)}
                        >
                          {food.isActive ? "Ngừng" : "Mở"}
                        </button>
                        <button
                          className="space-x-2 px-4 py-2 text-[1.4rem] rounded-md bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() =>
                            setOpenActionFood({
                              open: true,
                              action: "edit",
                              dataUpdate: food,
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Sửa</span>
                        </button>
                        <button
                          className="px-4 py-2 text-[1.4rem] rounded-md bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => setShowDelete(food.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <td colSpan={6} className="w-full text-center">
                <p className="py-14">Không có dữ liệu</p>
              </td>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {openActionFood.open && (
          <ActionFood
            action={openActionFood.action}
            dataUpdate={openActionFood.dataUpdate}
            onClose={() =>
              setOpenActionFood({
                open: false,
                action: "",
                dataUpdate: null,
              })
            }
            refetch={refetch}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDelete && (
          <DeleteFood
            foodId={showDelete}
            onClose={() => setShowDelete(false)}
          />
        )}
      </AnimatePresence>

      {showEdit && (
        <EditFood
          title="Chỉnh sửa món ăn"
          food={showEdit}
          handleShowEdit={() => setShowEdit(null)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["allFood"] })
          }
        />
      )}

      <AnimatePresence>
        {openToggleStatus && (
          <ToggleStatusFood
            food={openToggleStatus}
            onClose={() => setOpenToggleStatus(null)}
            refetch={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Food;
