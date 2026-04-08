import { motion } from "framer-motion";
import { IngredientUnit } from "../../../constants/ingredient";

function IngredientDetailModal({ data, categories, onClose }) {
  const quantity = data.inventory.quantity || 1;

  const getStatus = () => {
    if (quantity === 0) {
      return {
        label: "Đã hết hàng",
        color: "text-red-500",
      };
    }

    if (quantity < data.minStock) {
      return {
        label: `Sắp hết hàng (${quantity})`,
        color: "text-yellow-500",
      };
    }

    return {
      label: `Còn hàng (${quantity})`,
      color: "text-green-500",
    };
  };

  const status = getStatus();

  const category =
    categories.length > 0 && categories.find((i) => i.id === data.categoryId);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#59595957] z-[999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-[50rem] h-auto bg-[#fff] shadow-nav p-10 rounded-[1rem]"
      >
        <h3 className="text-[1.8rem] font-bold mb-5">Chi tiết nguyên liệu</h3>
        <div className="grid grid-cols-2 gap-10">
          {data && (
            <>
              <div>
                <p>Tên nguyên liệu</p>
                <p className="mt-2">{data.name}</p>
              </div>
              <div>
                <p>Danh mục</p>
                <p className="mt-2">{category.name}</p>
              </div>
              <div>
                <p>Đơn vị</p>
                <p className="mt-2">
                  {IngredientUnit.find((it) => it.value === data.unit).label}
                </p>
              </div>
              <div>
                <p>Trạng thái</p>
                <p className={`mt-2 ${status.color}`}>{status.label}</p>
              </div>
              <div>
                <p>Mô tả</p>
                <p className="">{data.name}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-5">
          <button
            type="button"
            className={`px-10 h-[4rem] rounded-[.5rem] text-gray-700 bg-gray-200 hover:bg-gray-300  mt-[1rem] md:mt-[2rem] cursor-pointer transition-colors`}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default IngredientDetailModal;
