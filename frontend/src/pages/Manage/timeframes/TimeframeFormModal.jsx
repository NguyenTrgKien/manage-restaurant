import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faClock,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { createTimeframe, updateTimeframe } from "../../../apis/timeframe.api";

function TimeframeFormModal({ editData, onClose }) {
  const queryClient = useQueryClient();
  const isEdit = !!editData;

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      setStartTime(editData.startTime ?? "");
      setEndTime(editData.endTime ?? "");
    }
  }, [editData]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit
        ? updateTimeframe({ id: editData.id, ...payload })
        : createTimeframe(payload),
    onSuccess: (res) => {
        console.log(res);
        
      if (res?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["timeframes"] });
        onClose();
      } else {
        setErrors({ server: res?.message || "Thao tác thất bại!" });
      }
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!startTime) newErrors.startTime = "Vui lòng nhập giờ bắt đầu!";
    if (!endTime) newErrors.endTime = "Vui lòng nhập giờ kết thúc!";
    if (startTime && endTime && startTime >= endTime)
      newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu!";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutation.mutate({ startTime, endTime });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#6060606d] z-[950]">
      <div className="w-[44rem] h-auto p-[3rem] rounded-[1rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between mb-[2.5rem]">
          <div className="flex items-center gap-[1rem]">
            <div className="w-[4rem] h-[4rem] rounded-[.8rem] bg-cyan-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faClock}
                className="text-cyan-500 text-[1.8rem]"
              />
            </div>
            <h3 className="text-[1.8rem] font-semibold text-gray-800">
              {isEdit ? "Chỉnh sửa khung giờ" : "Thêm khung giờ mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[1.8rem]" />
          </button>
        </div>

        <div className="space-y-[1.6rem]">
          <div>
            <label className="block text-[1.6rem] text-gray-600 mb-[.6rem]">
              Giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (errors.startTime)
                  setErrors((p) => ({ ...p, startTime: "" }));
              }}
              className={`w-full h-[4.4rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${
                errors.startTime ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.startTime && (
              <p className="text-red-500 text-[1.4rem] mt-[.4rem]">
                {errors.startTime}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[1.6rem] text-gray-600 mb-[.6rem]">
              Giờ kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                if (errors.endTime) setErrors((p) => ({ ...p, endTime: "" }));
              }}
              className={`w-full h-[4.4rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${
                errors.endTime ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.endTime && (
              <p className="text-red-500 text-[1.4rem] mt-[.4rem]">
                {errors.endTime}
              </p>
            )}
          </div>

          {startTime && endTime && startTime < endTime && (
            <div className="flex items-center gap-[.8rem] px-[1.4rem] py-[1rem] bg-cyan-50 border border-cyan-200 rounded-[.6rem]">
              <FontAwesomeIcon
                icon={faClock}
                className="text-cyan-500 text-[1.6rem]"
              />
              <span className="text-[1.6rem] text-cyan-700 font-medium">
                {startTime} – {endTime}
              </span>
            </div>
          )}

          {errors.server && (
            <p className="text-red-500 text-[1.4rem]">{errors.server}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-[1rem] mt-[2.5rem]">
          <button
            onClick={onClose}
            className="px-[2.4rem] py-[1rem] rounded-[.8rem] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-[1.6rem] cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex items-center gap-[.6rem] px-[2.4rem] py-[1rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-[1.6rem] font-medium transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {mutation.isPending
              ? "Đang lưu..."
              : isEdit
                ? "Cập nhật"
                : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeframeFormModal;
