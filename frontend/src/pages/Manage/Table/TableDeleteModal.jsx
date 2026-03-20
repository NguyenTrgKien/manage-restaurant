import {
  faWrench,
  faTriangleExclamation,
  faXmark,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { toggleMaintenanceTable } from "../../../apis/table.api";

function TableToggleModal({ toggleData, onClose }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");

  const isActivating = toggleData.status === "MAINTENANCE";

  const mutation = useMutation({
    mutationFn: () => toggleMaintenanceTable(toggleData.id),
    onSuccess: (res) => {
      if (res?.errCode === 0) {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
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
            <div
              className={`w-[4rem] h-[4rem] rounded-[.8rem] flex items-center justify-center ${
                isActivating ? "bg-green-50" : "bg-orange-50"
              }`}
            >
              <FontAwesomeIcon
                icon={isActivating ? faToggleOn : faWrench}
                className={`text-[1.8rem] ${
                  isActivating ? "text-green-500" : "text-orange-500"
                }`}
              />
            </div>
            <h3 className="text-[1.8rem] font-semibold text-gray-800">
              {isActivating ? "Kích hoạt bàn" : "Bảo trì bàn"}
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
              isActivating ? "text-green-600" : "text-orange-600"
            }`}
          >
            {isActivating ? "kích hoạt lại" : "chuyển sang bảo trì"}
          </span>{" "}
          bàn{" "}
          <span className="font-semibold text-gray-800">{toggleData.name}</span>{" "}
          không?
        </p>

        <p className="text-[1.4rem] text-gray-400 mb-[2rem]">
          {isActivating
            ? "Bàn sẽ chuyển về trạng thái hoạt động, khách hàng có thể đặt bàn này."
            : "Bàn sẽ tạm ngưng hoạt động, khách hàng không thể đặt bàn này."}
        </p>

        {!isActivating && (
          <div className="flex items-start gap-[.8rem] px-[1.4rem] py-[1rem] bg-orange-50 border border-orange-200 rounded-[.6rem] mb-[2rem]">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-orange-500 text-[1.6rem] mt-[.2rem] flex-shrink-0"
            />
            <p className="text-[1.4rem] text-orange-700">
              Nếu bàn đang có đơn chưa hoàn thành, hệ thống sẽ không cho phép
              chuyển sang bảo trì.
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
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            <FontAwesomeIcon icon={isActivating ? faToggleOn : faWrench} />
            {mutation.isPending
              ? "Đang xử lý..."
              : isActivating
                ? "Kích hoạt"
                : "Chuyển bảo trì"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableToggleModal;
