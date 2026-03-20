import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../../../apis/category.api";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:8080";

function EditFood({ title, food, handleShowEdit, onSuccess }) {
  const queryClient = useQueryClient();
  const [urlImage, setUrlImage] = useState(food.image ?? null);
  const [editSuccess, setEditSuccess] = useState(false);

  const { data: categoryRes, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });
  const categories = categoryRes?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: food.name ?? "",
      description: food.description ?? "",
      price: food.price ?? "",
      quantity: food.quantity ?? 1,
      categoryId: food.categoryId ? `${food.categoryId}` : "",
      foodId: food.id,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUrlImage(URL.createObjectURL(file)); // preview
    setValue("image", file); // set File object vào react-hook-form
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value ?? "");
    });

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    formData.append("oldImage", food.image ?? "");

    try {
      const res = await editFood(formData);
      console.log(res);

      if (res.status === 200) {
        setEditSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["allFood"] });
        onSuccess?.();
        setTimeout(() => {
          setEditSuccess(false);
          handleShowEdit(null);
        }, 800);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageUrl =
    urlImage?.startsWith("http") || urlImage?.startsWith("blob")
      ? urlImage
      : urlImage
        ? `${BASE_URL}/${urlImage}`
        : null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <div className="relative w-[90%] md:w-[80%] xl:w-[60%] h-auto bg-[#fff] shadow-nav py-[2rem] px-[2rem] md:py-[4rem] md:px-[5rem] rounded-[1rem]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="absolute top-0 right-0 md:top-[2rem] md:right-[2rem] w-[4rem] h-[4rem] flex justify-center items-center rounded-[.4rem] bg-[#e9e9e9] hover:bg-[#dadada] cursor-pointer"
            onClick={() => handleShowEdit(null)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[2.4rem] text-[#7d7d7d]"
            />
          </div>

          <h2 className="text-[2.5rem] lg:text-[3.5rem] text-amber-600 font-bold text-center mb-[1rem] md:mb-[2rem]">
            {title}
          </h2>

          <input type="hidden" {...register("foodId")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
            <div className="w-full">
              <label htmlFor="name">Tên món</label>
              <input
                type="text"
                id="name"
                placeholder="Nhập tên món..."
                className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] mt-[.5rem] focus:ring-2 focus:ring-amber-300 focus:outline-none ${errors.name ? "border-red-400" : "border-gray-400"}`}
                {...register("name", { required: "Vui lòng nhập tên món" })}
              />
              {errors.name && (
                <p className="text-red-500 text-[1.2rem] mt-[.3rem]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-[1rem]">
              <div className="w-full">
                <label htmlFor="price">Giá món</label>
                <input
                  type="text"
                  id="price"
                  placeholder="Nhập giá món..."
                  className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] mt-[.5rem] focus:ring-2 focus:ring-amber-300 focus:outline-none ${errors.price ? "border-red-400" : "border-gray-400"}`}
                  {...register("price", {
                    required: "Vui lòng nhập giá",
                    pattern: { value: /^\d+$/, message: "Giá phải là số" },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-[1.2rem] mt-[.3rem]">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="quantity">Số lượng</label>
                <input
                  type="text"
                  id="quantity"
                  placeholder="Nhập số lượng..."
                  className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] mt-[.5rem] focus:ring-2 focus:ring-amber-300 focus:outline-none ${errors.quantity ? "border-red-400" : "border-gray-400"}`}
                  {...register("quantity", {
                    required: "Vui lòng nhập số lượng",
                    pattern: { value: /^\d+$/, message: "Số lượng phải là số" },
                  })}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-[1.2rem] mt-[.3rem]">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <label
            htmlFor="description"
            className="block mt-[1rem] md:mt-[2rem] pb-[.5rem]"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            placeholder="Nhập mô tả cho món ăn..."
            className="w-full h-[5rem] border border-gray-400 focus:ring-2 focus:ring-amber-300 outline-none rounded-[.5rem] p-[1rem]"
            {...register("description")}
          />

          <div className="grid md:grid-cols-2 mt-[1rem] md:mt-[2rem] items-center md:gap-[2rem]">
            <div className="flex items-center gap-[2rem]">
              <label
                htmlFor="image"
                className="w-[15rem] flex justify-center items-center h-[4rem] cursor-pointer rounded-[.8rem] border border-gray-400 hover:border-amber-400 transition-colors"
              >
                Thêm hình ảnh
              </label>

              <input
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="md:w-[10rem] md:h-[10rem] w-[6rem] h-[6rem] rounded-[50%] object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="md:w-[10rem] md:h-[10rem] w-[6rem] h-[6rem] rounded-[50%] border border-gray-400" />
              )}
            </div>

            <div className="w-full mt-[1rem] md:mt-0">
              <label htmlFor="categoryId">Danh mục</label>
              <select
                id="categoryId"
                className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] outline-none pl-[1rem] mt-[.5rem] focus:ring-2 focus:ring-amber-300 ${errors.categoryId ? "border-red-400" : "border-gray-400"}`}
                {...register("categoryId", {
                  required: "Vui lòng chọn danh mục",
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
                <p className="text-red-500 text-[1.2rem] mt-[.3rem]">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[4.6rem] md:h-[5rem] rounded-[.5rem] text-[#fff] bg-amber-500 hover:bg-amber-600 transition-colors mt-[1rem] md:mt-[3rem] cursor-pointer"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>

      {editSuccess && (
        <div className="fixed inset-0 bg-[#3f3f3f73] flex justify-center items-center z-[1000]">
          <div className="min-w-[10rem] h-auto rounded-[.5rem] flex flex-col gap-[1rem] justify-center items-center bg-[#fff] px-[5rem] py-[3rem] text-[2rem] shadow-2xl">
            <div className="flex justify-center items-center w-[5rem] h-[5rem] border-[.1rem] border-[#05b405] rounded-[50%]">
              <FontAwesomeIcon icon={faCheck} className="text-[#05b405]" />
            </div>
            Cập nhật thành công!
          </div>
        </div>
      )}
    </div>
  );
}

export default EditFood;
