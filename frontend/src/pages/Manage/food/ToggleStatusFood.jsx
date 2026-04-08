import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../configs/axiosInstance";

function ToggleStatusFood({ food, onClose, refetch }) {
  console.log(food);

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.patch(`/api/v1/foods/${food.id}/toggle`);
      await refetch();
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra! Vui lòng thử lại",
      );
    } finally {
      onClose();
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-[60rem] h-auto relative bg-[#fff] rounded-[1rem] p-[2rem]"
      >
        <h3 className="text-[1.8rem]">
          Bạn có chắc muốn {food.isActive ? "ngừng" : "mở"} món ăn này?
        </h3>
        <div className="flex items-center justify-end gap-[1rem] mt-10">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md cursor-pointer transition-all duration-[.25s]"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md cursor-pointer transition-all duration-[.25s]"
            disabled={isLoading}
            onClick={handleToggle}
          >
            {isLoading ? "Đang xử lý..." : food.isActive ? "Ngừng" : "Mở"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ToggleStatusFood;
