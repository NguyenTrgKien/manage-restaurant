import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { deleteFood } from "../../../apis/menu.api";

function DeleteFood({ foodId, onClose }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (foodId) => deleteFood(foodId),
    onSuccess: (res) => {
      setShowDelete(null);
      queryClient.invalidateQueries({ queryKey: ["allFood"] });
      toast.success(res.data.message || "Xóa món ăn thành công!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Đã có lỗi xảy ra! Vui lòng thử lại.",
      );
    },
  });
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-auto h-auto relative bg-[#fff] rounded-[1rem] p-[2.5rem]"
      >
        <div className="text-[1.8rem]">Bạn có chắc muốn xóa món ăn này?</div>
        <div className="flex items-center gap-4 justify-end mt-[2rem]">
          <button
            className="px-10 py-2.5 bg-[#e7e7e7] rounded-md hover:opacity-80 cursor-pointer disabled:opacity-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-10 py-2.5 bg-red-600 text-[#fff] rounded-md hover:opacity-80 cursor-pointer"
            onClick={() => deleteMutation.mutate(foodId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Đang xóa..." : "Có"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteFood;
