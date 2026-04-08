import { useState } from "react";
import Stats from "../../../components/Stats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faEye,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import {
  getAllIngredient,
  getAllIngredientCategory,
} from "../../../apis/ingredient.api";
import ActionIngredient from "./ActionIngredient";
import { IngredientUnit } from "../../../constants/ingredient";
import IngredientDetailModal from "./IngredientDetailModal";
import { AnimatePresence } from "framer-motion";

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
      <td className="p-5 text-gray-500 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </td>
    </tr>
  );
}

function Ingredient() {
  const [ingredientName, setIngredientName] = useState("");
  const [openActionIngredient, setOpenActionIngredient] = useState({
    open: false,
    action: "",
    dataUpdate: null,
  });
  const [queryDefault, setQueryDefault] = useState({
    page: 1,
    limit: 10,
    name: "",
  });
  const [showDetail, setShowDetail] = useState(null);
  const { data: dataIngredient, isLoading } = useQuery({
    queryKey: ["ingredients", queryDefault.name],
    queryFn: () => getAllIngredient(queryDefault),
  });
  const ingredients = dataIngredient?.data || [];
  const { data: dataIngredientCate } = useQuery({
    queryKey: ["ingredientCategories"],
    queryFn: getAllIngredientCategory,
  });

  const ingredientCategories = dataIngredientCate?.data || [];

  const stats = [
    { title: "Tổng nguyên liệu", value: 10 },
    { title: "", value: 10 },
    { title: "", value: 10 },
  ];

  const handleFilter = () => {
    setQueryDefault((prev) => ({
      ...prev,
      name: ingredientName,
    }));
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý nguyên liệu
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ nguyên liệu của nhà hàng.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() =>
            setOpenActionIngredient({
              open: true,
              action: "create",
              dataUpdate: null,
            })
          }
        >
          <FontAwesomeIcon icon={faAdd} />
          <span>Thêm nguyên liệu</span>
        </button>
      </div>

      <Stats stats={stats} />

      <div className="grid grid-cols-4 gap-5">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
          <input
            type="text"
            name="name"
            placeholder="Tìm tên nguyên liệu..."
            value={ingredientName || ""}
            onChange={(e) => setIngredientName(e.target.value)}
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>

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
            <tr className="bg-gray-100 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-semibold border-r border-gray-200">
                Nguyên liệu
              </th>
              <th className="p-5 font-semibold border-r border-gray-200 text-center">
                Danh mục
              </th>
              <th className="p-5 font-semibold border-r border-gray-200 text-center">
                Đơn vị
              </th>
              <th className="p-5 font-semibold border-r border-gray-200 text-center">
                Trạng thái
              </th>
              <th className="p-5 font-semibold border-r border-gray-200 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : ingredients.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  Không có sản phẩm nào trong kho.
                </td>
              </tr>
            ) : (
              ingredients.map((ingre) => {
                const ingreCate = ingredientCategories.find(
                  (it) => it.id === ingre.categoryId,
                );
                const quantity = ingre.inventory?.quantity;
                const isWarning =
                  quantity < ingre.minStock
                    ? quantity === 0
                      ? "Đã hết hàng"
                      : `Sắp hết hàng (${quantity})`
                    : quantity;

                return (
                  <tr
                    key={ingre.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {ingre.name}
                    </td>

                    <td className="p-5 border-r border-gray-200 text-center">
                      {ingreCate.name}
                    </td>

                    <td className="p-5 border-r border-gray-200 text-center">
                      {
                        IngredientUnit.find((it) => it.value === ingre.unit)
                          .label
                      }
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      <div>
                        <span className="text-red-600 bg-red-50 px-5 py-2 rounded-full">
                          {isWarning}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => setShowDetail(ingre)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Chi tiết</span>
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() =>
                            setOpenActionIngredient({
                              open: true,
                              action: "edit",
                              dataUpdate: ingre,
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Sửa</span>
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

      {openActionIngredient.open && (
        <ActionIngredient
          action={openActionIngredient.action}
          dataUpdate={openActionIngredient.dataUpdate}
          onClose={() => {
            setOpenActionIngredient({
              open: false,
              action: "",
              dataUpdate: null,
            });
          }}
        />
      )}

      <AnimatePresence>
        {showDetail && (
          <IngredientDetailModal
            data={showDetail}
            categories={ingredientCategories}
            onClose={() => setShowDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Ingredient;
