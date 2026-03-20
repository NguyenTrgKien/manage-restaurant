import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useState } from "react";
import { markAttendance } from "../../../apis/attendance.api";
import { toast } from "react-toastify";

function ReasonModal({ staff, status, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const staffId = staff.id;

      const res = await markAttendance({
        staffId,
        status,
        note: reason,
      });
      if (res.status === 200) {
        toast.success("Đã lưu chấm công!");
        await onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Lưu chấm công thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-[1.2rem] shadow-xl w-full max-w-[48rem] mx-4 overflow-hidden p-10">
        <div className="mb-8">
          <h3 className="text-[1.8rem] font-semibold text-gray-800">
            Chỉnh sửa chấm công
          </h3>
          <p className="text-[1.5rem] text-gray-400">
            {dayjs(new Date()).format("dddd, DD/MM/YYYY")}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-[3.2rem] h-[3.2rem] text-[1.6rem] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="flex flex-col gap-[.6rem]">
          <label className="text-[1.6rem] font-medium text-gray-700">
            Lý do
          </label>
          <textarea
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Lý do đi trễ, vắng mặt... (tuỳ chọn)"
            className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.6rem] focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>
        <div className="flex items-center justify-end gap-[1rem] border-t border-gray-100 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-[2rem] py-[.9rem] rounded-[.8rem] text-gray-600 text-[1.5rem] font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="button"
            className="flex items-center gap-[.6rem] px-[2rem] py-[.9rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 text-white text-[1.5rem] font-medium transition-colors cursor-pointer disabled:opacity-60"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReasonModal;
