import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCategory } from "../../../apis/category.api";
import { createFood, editFood } from "../../../apis/menu.api";
import { motion } from "framer-motion";

function ActionFood({ action, dataUpdate, onClose, refetch }) {
  const [urlImage, setUrlImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: categoryRes, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });
  const categories = categoryRes?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (action === "edit" && dataUpdate) {
      reset({
        name: dataUpdate.name || "",
        description: dataUpdate.description || "",
        price: dataUpdate.price || "",
        quantity: dataUpdate.quantity || 1,
        categoryId: dataUpdate.categoryId || "",
      });
      if (dataUpdate.image) {
        setUrlImage(dataUpdate.image);
      }
    }
  }, [action, dataUpdate]);

  const onSubmit = async (data) => {
    data.price = data.price.replace(/\D/g, "");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        if (value?.[0]) {
          formData.append("image", value[0]);
        }
      } else {
        formData.append(key, value);
      }
    });

    try {
      setIsLoading(true);
      let res;
      if (action === "create") {
        res = await createFood(formData);
      } else {
        res = await editFood(dataUpdate.id, formData);
      }
      await refetch();
      toast.success(res.data.message || "Thêm món ăn thành công!");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra! Vui lòng thử lại",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (file) setUrlImage(URL.createObjectURL(file));
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const parsePrice = (value) => {
    return value.replace(/\D/g, "");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-[90%] md:w-[80%] xl:w-[65rem] h-auto bg-[#fff] shadow-nav p-10 rounded-[1rem]"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="absolute w-10 h-10 top-5 right-5 flex justify-center items-center rounded-[.4rem] bg-[#e9e9e9] hover:bg-[#dadada] cursor-pointer"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
          </div>

          <h2
            className={`text-[2.5rem] text-center mb-[1rem] md:mb-[2rem] ${action === "create" ? "text-green-600" : "text-amber-600"}`}
          >
            {action === "create" ? "Thêm món ăn" : "Cập nhật món ăn"}
          </h2>

          <div className="grid md:grid-cols-2 gap-[2rem]">
            <div className="w-full">
              <label htmlFor="name">Tên món</label>
              <input
                type="text"
                id="name"
                placeholder="Nhập tên món..."
                className="w-full h-[4.2rem] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 px-5"
                {...register("name", {
                  required:
                    action === "create" ? "Vui lòng nhập tên món" : false,
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-[1.4rem] mt-[.3rem]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="price">Giá món</label>
              <input
                type="text"
                id="price"
                placeholder="Nhập giá món..."
                className="w-full h-[4.2rem] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 px-5"
                {...register("price", {
                  required: action === "create" ? "Vui lòng nhập giá" : false,
                })}
                onChange={(e) => {
                  const rawValue = parsePrice(e.target.value);
                  setValue("price", rawValue);
                  e.target.value = formatPrice(rawValue);
                }}
              />
              {errors.price && (
                <p className="text-red-500 text-[1.4rem] mt-[.3rem]">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="w-full col-span-2">
              <label htmlFor="categoryId">Danh mục</label>
              <select
                id="categoryId"
                className="w-full h-[4.2rem] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 px-5"
                {...register("categoryId", {
                  required:
                    action === "create" ? "Vui lòng chọn danh mục" : false,
                })}
              >
                <option value="" disabled hidden>
                  {isCategoryLoading ? "Đang tải..." : "Chọn danh mục"}
                </option>
                {categories.map((item) => (
                  <option key={item.id} value={`${item.id}`}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-[1.4rem] mt-[.3rem]">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <div className="w-full col-span-2">
              <label htmlFor="description" className="block pb-[.5rem]">
                Mô tả
              </label>
              <textarea
                id="description"
                placeholder="Nhập mô tả cho món ăn..."
                rows={2}
                className="w-full p-5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                {...register("description", {
                  required: action === "create" ? "Vui lòng nhập mô tả" : false,
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-[1.4rem] mt-[.3rem]">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 justify-between mt-[1rem] md:mt-[2rem] gap-[1rem] md:gap-[2rem]">
            <div className="flex items-center gap-[2rem]">
              {urlImage ? (
                <img
                  src={urlImage}
                  alt="preview"
                  className="w-[10rem] h-[10rem] rounded-[50%] object-cover"
                />
              ) : (
                <div className="w-[10rem] h-[10rem] flex items-center justify-center border border-dashed rounded-full">
                  Ảnh
                </div>
              )}
              <label
                htmlFor="image"
                className="w-[15rem] flex justify-center items-center h-[4rem] cursor-pointer rounded-[.8rem] border border-gray-400 hover:border-cyan-400 transition-colors"
              >
                Thêm hình ảnh
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                {...register("image", {
                  required:
                    action === "create" ? "Vui lòng chọn hình ảnh" : false,
                })}
                onChange={(e) => {
                  register("image").onChange(e);
                  handlePreviewImage(e);
                }}
              />
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-[1.4rem] mt-[.3rem]">
              {errors.image.message}
            </p>
          )}
          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              className={`px-10 h-[4rem] rounded-[.5rem] text-gray-700 bg-gray-200 hover:bg-gray-300  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
              disabled={isLoading}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-10 h-[4rem] rounded-[.5rem] text-[#fff] ${action === "create" ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
              disabled={isLoading}
            >
              {isLoading
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

export default ActionFood;
