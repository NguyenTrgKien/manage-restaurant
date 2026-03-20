import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { STATUS_OPTIONS } from "../../../constants/staff";
import { changeStatusStaff } from "../../../apis/staff.api";

function ChangeStatusModal({ staff, onClose, onSuccess }) {
  const [selectedStatus, setSelectedStatus] = useState(staff?.status || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleSubmit = async () => {
    if (!selectedStatus) {
      setMessageError("Vui lòng chọn trạng thái!");
      return;
    }
    if (selectedStatus === staff?.status) {
      setMessageError("Trạng thái mới phải khác trạng thái hiện tại!");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessageError("");

      const res = await changeStatusStaff({
        id: staff.id,
        status: selectedStatus,
      });
      if (res.status === 200) {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setMessageError(err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColorMap = {
    active: "bg-green-100 text-green-700 border-green-300",
    inactive: "bg-red-100 text-red-700 border-red-300",
    on_leave: "bg-amber-100 text-amber-700 border-amber-300",
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[1.2rem] shadow-xl w-full max-w-[46rem] mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-[2.4rem] py-[1.8rem] border-b border-gray-100">
          <h3 className="text-[1.8rem] font-semibold text-gray-800">
            Cập nhật trạng thái nhân viên
          </h3>
          <button
            onClick={onClose}
            className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="px-[2.4rem] py-[2rem] space-y-[2rem]">
          <div className="flex items-center gap-[1.4rem] p-[1.4rem] bg-gray-50 rounded-[.8rem]">
            <img
              src={staff?.image}
              alt={staff?.fullName}
              className="w-[5rem] h-[5rem] rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <p className="text-[1.6rem] font-medium text-gray-800">
                {staff?.fullName}
              </p>
              <p className="text-[1.4rem] text-gray-500">{staff?.email}</p>
            </div>
            <div className="ml-auto">
              <span
                className={`inline-flex items-center px-[1rem] py-[.3rem] rounded-full text-[1.3rem] font-medium border ${
                  statusColorMap[staff?.status] ||
                  "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                {STATUS_OPTIONS.find((s) => s.value === staff?.status)?.label ||
                  staff?.status}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[1.4rem] font-medium text-gray-700 mb-[1rem]">
              Chọn trạng thái mới
            </p>
            <div className="space-y-[.8rem]">
              {STATUS_OPTIONS.map((opt) => {
                const isCurrentStatus = opt.value === staff?.status;
                const isSelected = opt.value === selectedStatus;

                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-[1.2rem] p-[1.2rem] rounded-[.8rem] border cursor-pointer transition-all ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${isCurrentStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      checked={isSelected}
                      disabled={isCurrentStatus}
                      onChange={() => {
                        setSelectedStatus(opt.value);
                        setMessageError("");
                      }}
                      className="w-[1.6rem] h-[1.6rem]"
                    />
                    <span
                      className={`inline-flex items-center px-[1rem] py-[.3rem] rounded-full text-[1.3rem] font-medium border ${
                        statusColorMap[opt.value] ||
                        "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isCurrentStatus && (
                      <span className="ml-auto text-[1.2rem] text-gray-400 italic">
                        Hiện tại
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {messageError && (
            <p className="text-red-500 text-[1.4rem] bg-red-50 px-[1.2rem] py-[.8rem] rounded-[.6rem] border border-red-200">
              {messageError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-[1rem] px-[2.4rem] py-[1.6rem] border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-[2rem] py-[.9rem] rounded-[.8rem] text-gray-600 text-[1.5rem] font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-[.6rem] px-[2rem] py-[.9rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 text-white text-[1.5rem] font-medium transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSubmitting && (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
            {isSubmitting ? "Đang lưu..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeStatusModal;
