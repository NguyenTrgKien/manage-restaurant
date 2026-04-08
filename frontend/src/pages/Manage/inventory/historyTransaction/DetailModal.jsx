import dayjs from "dayjs";
import { useAuth } from "../../../../hooks/useAuth";
import { IngredientUnit } from "../../../../constants/ingredient";

function DetailModal({ open, data, onClose }) {
  const { user } = useAuth();
  if (!open || !data) return null;

  const formatMoney = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") + " đ" : "—";
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "stock_in":
        return "Nhập kho";
      case "stock_out":
        return "Xuất kho";
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#38383840] flex items-center justify-center z-500">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[1.6rem] font-semibold">Chi tiết giao dịch</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="p-5 border border-gray-200 shadow-sm rounded-md  mb-4 space-y-2">
          <p>
            <b>ID:</b> {data.id}
          </p>
          <p>
            <b>Loại giao dịch:</b> {getTypeLabel(data.type)}
          </p>
          <p>
            <b>Thời gian:</b>{" "}
            {dayjs(data.createdAt).format("HH:mm - DD/MM/YYYY")}
          </p>
          <p>
            <b>Thực hiện bởi:</b>{" "}
            {data.createdBy === user?.id ? user.fullName : "Người dùng khác"}
          </p>
        </div>

        <div className="p-5 border border-gray-200 shadow-sm rounded-md mb-4 space-y-2">
          <p>
            <b>Nguyên liệu:</b> {data.ingredient?.name}
          </p>
          <p>
            <b>Đơn vị:</b>{" "}
            {
              IngredientUnit.find((u) => u.value === data.ingredient?.unit)
                ?.label
            }
          </p>
          <p>
            <b>Tồn tối thiểu:</b> {data.ingredient?.minStock}
          </p>
        </div>

        <div className="p-5 border border-gray-200 shadow-sm rounded-md  mb-4 space-y-2">
          <p>
            <b>Số lượng thay đổi:</b> {data.quantity}
          </p>
          <p>
            <b>Số lượng trước thay đổi:</b> {data.beforeQuantity}
          </p>
          <p>
            <b>Số lượng sau thay đổi:</b> {data.afterQuantity}
          </p>
          <p>
            <b>Giá nguyên liệu:</b> {formatMoney(data.costPrice)}
          </p>
        </div>

        {data.note && (
          <>
            <hr className="my-3" />
            <p>
              <b>Ghi chú:</b> {data.note}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DetailModal;
