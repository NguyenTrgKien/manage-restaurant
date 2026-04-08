import { faAdd, faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { getAllIngredientCategory } from "../../../../apis/ingredient.api";
import { AnimatePresence } from "framer-motion";
import ActionCateIngre from "./ActionCateIngre";

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
      <td className="p-5 text-gray-500 border-r border-gray-200 ">
        <div className="h-4 w-40 bg-gray-300 rounded"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="flex items-center gap-4 justify-center">
          <div className="w-40 h-4 bg-gray-300 rounded"></div>
          <div className="w-40 h-4 bg-gray-300 rounded"></div>
        </div>
      </td>
    </tr>
  );
}

function IngredientCategory() {
  const [cateName, setCateName] = useState("");
  const [openActionCate, setOpenActionCate] = useState({
    open: false,
    action: "",
    dataUpdate: null,
  });
  const {
    data: dataIngredientCate,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ingredientCategories"],
    queryFn: getAllIngredientCategory,
  });

  const ingredientCategories = dataIngredientCate?.data || [];

  const filtered =
    ingredientCategories.filter((i) =>
      cateName ? i.name.toLowerCase().includes(cateName) : i,
    ) || [];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý danh mục nguyên liệu
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ danh mục nguyên liệu của nhà hàng.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() =>
            setOpenActionCate({
              open: true,
              action: "create",
              dataUpdate: null,
            })
          }
        >
          <FontAwesomeIcon icon={faAdd} />
          <span>Thêm danh mục</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
          <input
            type="text"
            name="name"
            placeholder="Tìm tên danh mục..."
            value={cateName || ""}
            onChange={(e) => setCateName(e.target.value)}
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200">Tên</th>
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
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-10 text-center text-gray-500">
                  Không có sản phẩm nào trong kho.
                </td>
              </tr>
            ) : (
              filtered.map((cate) => {
                return (
                  <tr
                    key={cate.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {cate.name}
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white"
                          type="button"
                          onClick={() =>
                            setOpenActionCate({
                              open: true,
                              action: "create",
                              dataUpdate: null,
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Sửa</span>
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

      <AnimatePresence>
        {openActionCate.open && (
          <ActionCateIngre
            action={openActionCate.open}
            dataUpdate={openActionCate.dataUpdate}
            onClose={() =>
              setOpenActionCate({
                open: false,
                action: "",
                dataUpdate: null,
              })
            }
            refetch={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default IngredientCategory;
