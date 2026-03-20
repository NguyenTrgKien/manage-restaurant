import {
  faCheck,
  faEdit,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategory,
} from "../../../apis/category.api";

function CategoryRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="px-[2rem] py-[1.6rem]">
        <div className="h-[1.6rem] w-[3rem] rounded bg-gray-200" />
      </td>
      <td className="px-[2rem] py-[1.6rem]">
        <div className="h-[1.6rem] w-[14rem] rounded bg-gray-200" />
      </td>
      <td className="px-[2rem] py-[1.6rem]">
        <div className="h-[1.6rem] w-[24rem] rounded bg-gray-200" />
      </td>
      <td className="px-[2rem] py-[1.6rem]">
        <div className="flex gap-[1rem]">
          <div className="h-[3.2rem] w-[8rem] rounded-[.6rem] bg-gray-200" />
          <div className="h-[3.2rem] w-[6rem] rounded-[.6rem] bg-gray-200" />
        </div>
      </td>
    </tr>
  );
}

function CategoryModal({ title, defaultValues, onClose, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues ?? { name: "", description: "" },
  });

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <div className="relative w-[50rem] bg-[#fff] shadow-nav p-10 rounded-[1rem]">
        <div
          className="absolute top-[1rem] right-[1rem] md:top-[2rem] md:right-[2rem] w-[3.5rem] h-[3.5rem] flex justify-center items-center rounded-[.4rem] bg-[#e9e9e9] hover:bg-[#dadada] cursor-pointer"
          onClick={onClose}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-[2rem] text-[#7d7d7d]"
          />
        </div>

        <h2 className="md:text-[2rem] text-green-600 text-center mb-[2rem]">
          {title}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[1.5rem]">
          <div>
            <label htmlFor="name" className="block mb-[.5rem]">
              Tên danh mục
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nhập tên danh mục..."
              className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] focus:ring-2 focus:ring-cyan-300 focus:outline-none ${
                errors.name ? "border-red-400" : "border-gray-400"
              }`}
              {...register("name", { required: "Vui lòng nhập tên danh mục" })}
            />
            {errors.name && (
              <p className="text-red-500 text-[1.2rem] mt-[.3rem]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block mb-[.5rem]">
              Mô tả
            </label>
            <textarea
              id="description"
              placeholder="Nhập mô tả danh mục..."
              className={`w-full h-[8rem] border rounded-[.5rem] p-[1rem] focus:ring-2 focus:ring-cyan-300 focus:outline-none resize-none ${
                errors.description ? "border-red-400" : "border-gray-400"
              }`}
              {...register("description")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[4.6rem] md:h-[5rem] rounded-[.5rem] text-[#fff] bg-green-500 hover:bg-green-600 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isLoading ? "Đang xử lý..." : title}
          </button>
        </form>
      </div>
    </div>
  );
}

function Category() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [valueSearch, setValueSearch] = useState("");

  const { data: dataRes, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });
  const categories = dataRes?.data ?? [];

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 1500);
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["category"] });

  const addMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (res) => {
      if (res.errCode === 0) {
        invalidate();
        setShowAdd(false);
        showToast("add");
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: editCategory,
    onSuccess: (res) => {
      if (res.errCode === 0) {
        invalidate();
        setEditItem(null);
        showToast("edit");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res) => {
      if (res.errCode === 0) {
        invalidate();
        setDeleteId(null);
        showToast("delete");
      }
    },
  });

  const handleAdd = (data) => addMutation.mutate(data);
  const handleEdit = (data) =>
    editMutation.mutate({ ...data, id: editItem.id });
  const handleDelete = () => deleteMutation.mutate(deleteId);

  const filtered = categories.filter((item) =>
    item.name.toLowerCase().includes(valueSearch.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[2.2rem] text-gray-800 font-medium">
            Quản lý danh mục
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ danh mục món ăn của nhà hàng.
          </p>
        </div>
        <div
          className="px-8 py-4 flex gap-[1rem] justify-center items-center rounded-[1rem] bg-[#1fc5c5] cursor-pointer hover:bg-[#0cb7b7] transition-all duration-[.25s]"
          onClick={() => setShowAdd(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="text-[#fff]" />
          <span className="text-[#fff]">Thêm danh mục</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <input
          type="text"
          className="w-[16rem] sm:w-[22rem] md:w-[28rem] h-[4rem] md:h-[4.2rem] px-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
          value={valueSearch}
          placeholder="Tìm tên danh mục..."
          onChange={(e) => setValueSearch(e.target.value)}
        />
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.4rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="px-[2rem] py-[1.5rem] font-medium w-[6rem] border-r border-gray-200">
                STT
              </th>
              <th className="px-[2rem] py-[1.5rem] font-medium w-[20rem] border-r border-gray-200">
                Tên danh mục
              </th>
              <th className="px-[2rem] py-[1.5rem] font-medium border-r border-gray-200">
                Mô tả
              </th>
              <th className="px-[2rem] py-[1.5rem] font-medium w-[18rem]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <CategoryRowSkeleton key={i} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="text-center py-[4rem] text-gray-400 text-[1.6rem]">
                    Không có danh mục nào
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                >
                  <td className="px-[2rem] py-[1.5rem] text-gray-500 border-r border-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-[2rem] py-[1.5rem] font-medium text-gray-800 border-r border-gray-200">
                    {item.name}
                  </td>
                  <td className="px-[2rem] py-[1.5rem] text-gray-500 border-r border-gray-200">
                    <p className="line-clamp-2">{item.description ?? "—"}</p>
                  </td>
                  <td className="px-[2rem] py-[1.5rem]">
                    <div className="flex items-center gap-[1rem]">
                      <button
                        className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-[#ffc107] text-[#fff] text-[1.3rem] rounded-[.6rem] cursor-pointer hover:bg-[#d3a10a] transition-all duration-[.25s]"
                        onClick={() => setEditItem(item)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Sửa
                      </button>
                      <button
                        className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-[#f50019] text-[#fff] text-[1.3rem] rounded-[.6rem] cursor-pointer hover:bg-[#c40014] transition-all duration-[.25s]"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <CategoryModal
          title="Thêm danh mục"
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          isLoading={addMutation.isPending}
        />
      )}

      {editItem && (
        <CategoryModal
          title="Chỉnh sửa danh mục"
          defaultValues={{
            name: editItem.name,
            description: editItem.description,
          }}
          onClose={() => setEditItem(null)}
          onSubmit={handleEdit}
          isLoading={editMutation.isPending}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
          <div className="w-auto h-auto relative bg-[#fff] rounded-[1rem] p-[6rem]">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[1.8rem] absolute top-[1rem] right-[1rem] p-[.5rem] bg-[#e6e6e6] text-[#767676] rounded-[.5rem] cursor-pointer"
              onClick={() => setDeleteId(null)}
            />
            <div className="text-[2rem] font-bold text-blue-700">
              Bạn có chắc muốn xóa danh mục này?
            </div>
            <div className="flex items-center gap-[1.5rem] justify-center mt-[2rem]">
              <button
                className="px-[2rem] py-[1rem] bg-[#e7e7e7] rounded-[.8rem] hover:opacity-80 cursor-pointer disabled:opacity-50"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Đang xóa..." : "Có"}
              </button>
              <button
                className="px-[2rem] py-[1rem] bg-green-600 text-[#fff] rounded-[.8rem] hover:opacity-80 cursor-pointer"
                onClick={() => setDeleteId(null)}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed flex justify-center items-center inset-0 z-[400] bg-[#50505052]">
          <div className="w-[40rem] h-auto py-[3rem] flex flex-col items-center gap-[1.5rem] bg-[#fff] rounded-[1rem] text-[2rem] font-bold">
            <FontAwesomeIcon
              icon={faCheck}
              className="p-[2rem] rounded-[50%] border-[.2rem] text-[#00be00] border-[#00be00]"
            />
            {toast === "add" && "Thêm danh mục thành công!"}
            {toast === "edit" && "Cập nhật danh mục thành công!"}
            {toast === "delete" && "Xóa danh mục thành công!"}
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
