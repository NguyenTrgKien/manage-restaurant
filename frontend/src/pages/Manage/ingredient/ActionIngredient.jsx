import { motion } from "framer-motion";
import { IngredientUnit } from "../../../constants/ingredient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIngredient,
  editIngredient,
  getAllIngredientCategory,
} from "../../../apis/ingredient.api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

function ActionIngredient({ action, dataUpdate, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    description: "",
    categoryId: "",
    minStock: "",
  });
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  const { data: dataIngredientCate, isLoading } = useQuery({
    queryKey: ["ingredientCategories"],
    queryFn: getAllIngredientCategory,
  });

  const ingredientCategories = dataIngredientCate?.data || [];

  useEffect(() => {
    if (action === "edit" && dataUpdate) {
      setFormData({
        name: dataUpdate.name || "",
        unit: dataUpdate.unit || "",
        description: dataUpdate.description || "",
        categoryId: dataUpdate.categoryId || "",
        minStock: dataUpdate.minStock || "",
      });
    }
  }, [action, dataUpdate]);

  const createMutation = useMutation({
    mutationFn: (payload) => {
      return createIngredient(payload);
    },
    onSuccess: async (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["ingredients"]);
      onClose();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Đã có lỗi xảy ra! Vui lòng thử lại.",
      );
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload) => {
      const { id, data } = payload;
      return editIngredient(id, data);
    },
    onSuccess: async (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["ingredients"]);
      onClose();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Đã có lỗi xảy ra! Vui lòng thử lại.",
      );
    },
  });

  const validateForm = (data) => {
    let isValid = true;
    const newErrors = {};
    if (!data.name) {
      newErrors.name = "Vui lòng nhập tên nguyên liệu!";
      isValid = false;
    }
    if (!data.unit) {
      newErrors.unit = "Vui lòng chọn đơn vị!";
      isValid = false;
    }
    if (!data.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục!";
      isValid = false;
    }
    if (!data.minStock) {
      newErrors.minStock = "Vui lòng nhập ngưỡng tồn kho!";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      unit: formData.get("unit"),
      minStock: Number(formData.get("minStock")),
      categoryId: Number(formData.get("categoryId")),
      description: formData.get("description"),
    };

    if (!validateForm(data)) {
      return;
    }

    if (action === "create") {
      createMutation.mutate(data);
    } else {
      editMutation.mutate({
        action,
        id: dataUpdate.id,
        data,
      });
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-[60rem] h-auto bg-[#fff] shadow-nav p-10 rounded-[1rem]"
      >
        <h3 className="text-[1.8rem] font-bold mb-5">
          {action === "create" ? "Thêm nguyên liệu" : "Chỉnh sửa nguyên liệu"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-8">
            <div className="w-full">
              <label htmlFor="name">Tên nguyên liệu</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                className="w-full h-[4.2rem] border border-gray-300 outline-none rounded-md px-5"
                placeholder="Nhập tên..."
                onChange={handleChangeInput}
                onFocus={() => setErrors((prev) => ({ ...prev, name: "" }))}
              />
              {errors.name && (
                <p className="text-[1.4rem] text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="unit">Đơn vị</label>
              <select
                name="unit"
                id="unit"
                value={formData.unit}
                className="w-full h-[4.2rem] border border-gray-300 outline-none rounded-md px-5"
                onChange={handleChangeInput}
                onFocus={() => setErrors((prev) => ({ ...prev, unit: "" }))}
              >
                <option value="">--Chọn đơn vị--</option>
                {IngredientUnit.map((it) => (
                  <option key={it.value} value={it.value}>
                    {it.label}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="text-[1.4rem] text-red-500 mt-1">{errors.unit}</p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="minStock">Mức tồn kho tối thiểu</label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                className="w-full h-[4.2rem] border border-gray-300 outline-none rounded-md px-5"
                placeholder="VD: 5"
                onChange={handleChangeInput}
                onFocus={() => setErrors((prev) => ({ ...prev, minStock: "" }))}
              />
              {errors.minStock && (
                <p className="text-[1.4rem] text-red-500 mt-1">
                  {errors.minStock}
                </p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="categoryId">Danh mục</label>
              <select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId}
                className="w-full h-[4.2rem] border border-gray-300 outline-none rounded-md px-5"
                onChange={handleChangeInput}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, categoryId: "" }))
                }
              >
                <option value="">--Chọn danh mục--</option>
                {isLoading ? (
                  <option>Đang tải dữ liệu...</option>
                ) : ingredientCategories.length > 0 ? (
                  ingredientCategories.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })
                ) : (
                  <option>Không có sanh mục nguyên liệu</option>
                )}
              </select>
              {errors.categoryId && (
                <p className="text-[1.4rem] text-red-500 mt-1">
                  {errors.categoryId}
                </p>
              )}
            </div>
            <div className="w-full col-span-2">
              <label htmlFor="description">Mô tả</label>
              <textarea
                type="text"
                rows={3}
                name="description"
                value={formData.description}
                className="w-full col-span-2 border border-gray-300 outline-none rounded-md p-5"
                placeholder="Nhập ghi chú..."
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              className={`px-10 h-[4rem] rounded-[.5rem] text-gray-700 bg-gray-200 hover:bg-gray-300  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
              disabled={createMutation.isPending || editMutation.isPending}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-10 h-[4rem] rounded-[.5rem] text-[#fff] ${action === "create" ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
              disabled={createMutation.isPending || editMutation.isPending}
            >
              {createMutation.isPending || editMutation.isPending
                ? "Đang xử lý..."
                : action === "create"
                  ? "Thêm"
                  : "Lưu"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ActionIngredient;
