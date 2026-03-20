import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../apis/category.api";

function AddDish({ title, handeSetShowAddDish, onSuccess }) {
  const [urlImage, setUrlImage] = useState("");
  const [statusAdd, setStatusAdd] = useState(false);

  const { data: categoryRes, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });
  const categories = categoryRes?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: 1,
      categoryId: "",
      food_outstanding: false,
      banner: false,
    },
  });

  const isCheckPopular = watch("food_outstanding");
  const isCheckBanner = watch("banner");

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key === "image" ? value[0] : value);
    });
    for (const a of formData.entries()) {
      console.log(a[0], a[1]);
    }
    try {
      const res = await createFood(formData);

      if (res.status === 201) {
        setStatusAdd(true);
        setTimeout(() => {
          handeSetShowAddDish();
          onSuccess?.(); // invalidate query từ component cha nếu cần
          setStatusAdd(false);
        }, 600);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (file) setUrlImage(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <div className="relative w-[90%] md:w-[80%] xl:w-[60%] h-auto bg-[#fff] shadow-nav py-[2rem] md:py-[4rem] px-[2rem] md:px-[5rem] rounded-[1rem]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="absolute top-0 md:top-[2rem] right-0 md:right-[2rem] md:w-[4rem] md:h-[4rem] w-[3.5rem] h-[3.5rem] flex justify-center items-center rounded-[.4rem] bg-[#e9e9e9] hover:bg-[#dadada] cursor-pointer"
            onClick={handeSetShowAddDish}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[2rem] md:text-[2.4rem] text-[#7d7d7d]"
            />
          </div>

          <h2 className="text-[2.5rem] md:text-[3.5rem] text-green-600 font-bold text-center mb-[1rem] md:mb-[2rem]">
            {title}
          </h2>

          <div className="grid md:grid-cols-2 gap-[1rem]">
            <div className="w-full">
              <label htmlFor="name">Tên món</label>
              <input
                type="text"
                id="name"
                placeholder="Nhập tên món..."
                className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] mt-[.5rem] focus:ring-2 focus:ring-cyan-300 focus:outline-none ${errors.name ? "border-red-400" : "border-gray-400"}`}
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
                  className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] mt-[.5rem] focus:ring-2 focus:ring-cyan-300 focus:outline-none ${errors.price ? "border-red-400" : "border-gray-400"}`}
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
                  className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] pl-[1.5rem] mt-[.5rem] focus:ring-2 focus:ring-cyan-300 focus:outline-none ${errors.quantity ? "border-red-400" : "border-gray-400"}`}
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
            className={`w-full h-[5rem] border rounded-[.5rem] p-[1rem] focus:ring-2 focus:ring-cyan-300 outline-none ${errors.description ? "border-red-400" : "border-gray-400"}`}
            {...register("description", { required: "Vui lòng nhập mô tả" })}
          />
          {errors.description && (
            <p className="text-red-500 text-[1.2rem] mt-[.3rem]">
              {errors.description.message}
            </p>
          )}

          <div className="grid md:grid-cols-2 justify-between mt-[1rem] md:mt-[2rem] gap-[1rem] md:gap-[2rem]">
            <div className="flex items-center gap-[2rem]">
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
                {...register("image")}
                onChange={(e) => {
                  register("image").onChange(e);
                  handlePreviewImage(e);
                }}
              />
              {urlImage ? (
                <img
                  src={urlImage}
                  alt="preview"
                  className="w-[10rem] h-[10rem] rounded-[50%] object-cover"
                />
              ) : (
                <div className="w-[6rem] md:w-[10rem] h-[6rem] md:h-[10rem] rounded-[50%] border border-gray-400" />
              )}
            </div>

            <div className="w-full">
              <label htmlFor="categoryId">Danh mục</label>
              <select
                id="categoryId"
                className={`w-full h-[4.6rem] md:h-[5rem] border rounded-[.5rem] outline-none pl-[1rem] mt-[.5rem] focus:ring-2 focus:ring-cyan-300 ${errors.categoryId ? "border-red-400" : "border-gray-400"}`}
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

          <div className="grid md:grid-cols-2 justify-start gap-[1rem]">
            <div className="w-full flex items-center mt-[1rem] md:mt-[2rem]">
              <input
                type="checkbox"
                id="food_outstanding"
                hidden
                {...register("food_outstanding")}
              />
              <span>Món ăn nổi bật:</span>
              <label
                htmlFor="food_outstanding"
                className="w-[2.5rem] h-[2.5rem] rounded-[.5rem] border border-gray-400 flex justify-center items-center ml-[1.5rem] cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`${isCheckPopular ? "opacity-100 text-cyan-600" : "opacity-0"} text-[1.8rem]`}
                />
              </label>
            </div>

            <div className="w-full flex items-center mt-[1rem] md:mt-[2rem]">
              <input
                type="checkbox"
                id="banner"
                hidden
                {...register("banner")}
              />
              <span>Hiển thị đầu trang:</span>
              <label
                htmlFor="banner"
                className="w-[2.5rem] h-[2.5rem] rounded-[.5rem] border border-gray-400 flex justify-center items-center ml-[1.5rem] cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`${isCheckBanner ? "opacity-100 text-cyan-600" : "opacity-0"} text-[1.8rem]`}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[4.6rem] md:h-[5rem] rounded-[.5rem] text-[#fff] bg-green-500 hover:bg-green-600 mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors"
          >
            Thêm
          </button>
        </form>
      </div>

      {statusAdd && (
        <div className="fixed inset-0 bg-[#3f3f3f73] flex justify-center items-center">
          <div className="min-w-[10rem] h-auto rounded-[.5rem] flex flex-col gap-[1rem] justify-center items-center bg-[#fff] px-[5rem] py-[3rem] text-[2rem] shadow-2xl">
            <div className="flex justify-center items-center w-[5rem] h-[5rem] border-[.1rem] border-[#05b405] rounded-[50%]">
              <FontAwesomeIcon icon={faCheck} className="text-[#05b405]" />
            </div>
            Thêm món ăn thành công!
            <div
              className="w-[8rem] h-[4rem] flex justify-center items-center bg-[#3a84d3] rounded-[1rem] text-[#fff] border-[.3rem] text-[1.5rem] cursor-pointer border-[#98dbff]"
              onClick={() => setStatusAdd(false)}
            >
              Ok
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDish;
