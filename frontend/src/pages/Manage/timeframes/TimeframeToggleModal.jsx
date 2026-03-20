import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faToggleOn,
  faToggleOff,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { toggleTimeframe } from "../../../apis/timeframe.api";

function TimeframeToggleModal({ toggleData, onClose }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");

  const isActivating = !toggleData.isActive;

  const mutation = useMutation({
    mutationFn: () => toggleTimeframe(toggleData.id),
    onSuccess: (res) => {
      console.log(res);

      if (res?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["timeframes"] });
        onClose();
      } else {
        setServerError(res?.message || "Thao tác thất bại, vui lòng thử lại!");
      }
    },
  });

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#6060606d] z-[950]">
      <div className="w-[42rem] h-auto p-[3rem] rounded-[1rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between mb-[2rem]">
          <div className="flex items-center gap-[1rem]">
            <h3 className="text-[1.8rem] font-semibold text-gray-800">
              {isActivating ? "Bật khung giờ" : "Tắt khung giờ"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[1.8rem]" />
          </button>
        </div>

        <p className="text-[1.6rem] text-gray-600 leading-relaxed mb-[.8rem]">
          Bạn có chắc chắn muốn{" "}
          <span
            className={`font-semibold ${
              isActivating ? "text-green-600" : "text-amber-600"
            }`}
          >
            {isActivating ? "bật" : "tắt"}
          </span>{" "}
          khung giờ{" "}
          <span className="font-semibold text-gray-800">
            {toggleData.startTime} – {toggleData.endTime}
          </span>{" "}
          không?
        </p>

        <p className="text-[1.4rem] text-gray-400 mb-[2rem]">
          {isActivating
            ? "Khung giờ này sẽ hiển thị và cho phép khách đặt bàn."
            : "Khung giờ này sẽ bị ẩn, khách hàng không thể đặt bàn trong khung giờ này nữa."}
        </p>

        {!isActivating && (
          <div className="flex items-start gap-[.8rem] px-[1.4rem] py-[1rem] bg-amber-50 border border-amber-200 rounded-[.6rem] mb-[2rem]">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-amber-500 text-[1.6rem] mt-[.2rem] flex-shrink-0"
            />
            <p className="text-[1.4rem] text-amber-700">
              Các đơn đặt bàn hiện tại dùng khung giờ này vẫn được giữ nguyên.
              Chỉ ngăn tạo đơn mới.
            </p>
          </div>
        )}

        {serverError && (
          <p className="text-red-500 text-[1.4rem] mb-[1.2rem]">
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-end gap-[1rem]">
          <button
            onClick={onClose}
            className="px-[2.4rem] py-[1rem] rounded-[.8rem] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-[1.6rem] cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`flex items-center gap-[.6rem] px-[2.4rem] py-[1rem] rounded-[.8rem] text-white text-[1.6rem] font-medium transition-colors cursor-pointer disabled:opacity-60 ${
              isActivating
                ? "bg-green-500 hover:bg-green-600"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            <FontAwesomeIcon icon={isActivating ? faToggleOn : faToggleOff} />
            {mutation.isPending
              ? "Đang xử lý..."
              : isActivating
                ? "Bật khung giờ"
                : "Tắt khung giờ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeframeToggleModal;
