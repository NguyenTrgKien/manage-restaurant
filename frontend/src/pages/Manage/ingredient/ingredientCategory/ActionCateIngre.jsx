import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createIngreCate } from "../../../../apis/ingredient.api";
import { toast } from "react-toastify";

function ActionCateIngre({ action, dataUpdate, onClose, refetch }) {
  const [cateName, setCateName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (action === "edit" && dataUpdate) {
      setCateName(dataUpdate.name);
    }
  }, [action, dataUpdate]);

  const mutationCreate = useMutation({
    mutationFn: createIngreCate,
    onSuccess: async (res) => {
      toast.success(res.data.message);
      await refetch();
      onClose();
    },
    onError: (err) => {
      toast.error(err.response.data?.message);
    },
  });

  const handleSubmit = () => {
    if (!cateName) {
      setErrorMessage("Vui lòng nhập tên danh mục!");
      return;
    }
    mutationCreate.mutate(cateName);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-[50rem] h-auto bg-[#fff] shadow-nav p-10 rounded-[1rem]"
      >
        <h3 className="text-[1.8rem] font-bold mb-5">
          Thêm danh mục nguyên liệu
        </h3>
        <div className="">
          <label htmlFor="name" className="block mb-2">
            Tên danh mục
          </label>
          <input
            type="text"
            name="name"
            placeholder="Vd: Gia vị"
            value={cateName}
            onChange={(e) => setCateName(e.target.value)}
            className="w-full h-[4.2rem] border border-gray-300 rounded-md outline-none px-5"
            onFocus={() => setErrorMessage("")}
          />
          {errorMessage && (
            <p className="text-[1.4rem] text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="flex items-center justify-end gap-5">
          <button
            type="button"
            className={`px-10 h-[4rem] rounded-[.5rem] text-gray-700 bg-gray-200 hover:bg-gray-300  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
            disabled={mutationCreate.isPending}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={`px-10 h-[4rem] rounded-[.5rem] text-[#fff] ${action === "create" ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
            disabled={mutationCreate.isPending}
            onClick={handleSubmit}
          >
            {mutationCreate.isPending
              ? "Đang xử lý..."
              : action === "create"
                ? "Thêm"
                : "Lưu"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ActionCateIngre;
