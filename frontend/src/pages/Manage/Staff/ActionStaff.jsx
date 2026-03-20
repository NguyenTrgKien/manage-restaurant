import { useState, useRef, useEffect } from "react";
import {
  faAdd,
  faFloppyDisk,
  faUser,
  faSpinner,
  faEye,
  faEyeSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { POSITION_OPTIONS, STATUS_OPTIONS } from "../../../constants/staff";
import { useNavigate, useParams } from "react-router";
import {
  createStaff,
  getStaffById,
  updateStaff,
} from "../../../apis/staff.api";

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const initialForm = {
  email: "",
  password: "",
  position: POSITION_OPTIONS[0].value,
  fullName: "",
  status: STATUS_OPTIONS[0].value,
  phoneNumber: "",
  salary: "",
  gender: GENDER_OPTIONS[0].value,
  startDate: "",
};

function ActionStaff() {
  const { id } = useParams();

  const isAdd = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchStaff = async () => {
      try {
        setIsFetching(true);

        const res = await getStaffById(id);
        const staff = res?.data?.data || null;
        if (res.status === 200) {
          setForm({
            email: staff.email || "",
            password: "",
            position: staff.position || POSITION_OPTIONS[0].value,
            fullName: staff.fullName || "",
            status: staff.status || STATUS_OPTIONS[0].value,
            phoneNumber: staff.phoneNumber || "",
            salary: staff.salary?.toString() || "",
            gender: staff.gender || GENDER_OPTIONS[0].value,
            startDate: staff.startDate ? staff.startDate.slice(0, 10) : "",
          });

          if (staff.image) {
            setImagePreview(staff.image);
          }
        }
      } catch (err) {
        setMessageError("Không thể tải thông tin nhân viên!");
      } finally {
        setIsFetching(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (messageError) setMessageError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessageError("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessageError("Ảnh không được vượt quá 5MB!");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const { email, password, fullName, phoneNumber, salary, startDate } = form;

    if (!fullName.trim()) return "Vui lòng nhập họ tên nhân viên!";
    if (!email.trim()) return "Vui lòng nhập email!";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ!";
    if (isAdd && !password) return "Vui lòng nhập mật khẩu!";
    if (isAdd && password.length < 6)
      return "Mật khẩu phải có ít nhất 6 ký tự!";
    if (!isAdd && password && password.length < 6)
      return "Mật khẩu mới phải có ít nhất 6 ký tự!";
    if (!phoneNumber.trim()) return "Vui lòng nhập số điện thoại!";
    if (!/^[0-9]{9,11}$/.test(phoneNumber))
      return "Số điện thoại không hợp lệ!";
    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0)
      return "Vui lòng nhập mức lương hợp lệ!";
    if (!startDate) return "Vui lòng chọn ngày bắt đầu làm việc!";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageError("");

    const error = validate();
    if (error) {
      setMessageError(error);
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "password" && !isAdd && !value) return;
        formData.append(key, value);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }
      let res;
      if (isAdd) {
        res = await createStaff(formData);
      } else {
        res = await updateStaff({ id, formData });
      }

      if (res.status === 200) {
        if (isAdd) {
          setForm(initialForm);
        } else {
          navigate("/manage/staff");
        }
      }

      for (let [key, val] of formData.entries()) {
        console.log(key, val);
      }
    } catch (err) {
      setMessageError(err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview(null);
    setMessageError("");
  };

  if (isFetching) {
    return (
      <div className="w-full h-full bg-white p-[2rem] rounded-md min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-[3rem] animate-spin text-cyan-500"
          />
          <p className="text-[1.5rem]">Đang tải thông tin nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center gap-[1.5rem] mb-[2.5rem]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[3.8rem] h-[3.8rem] rounded-[.8rem] border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            {isAdd ? "Thêm nhân viên" : "Chỉnh sửa nhân viên"}
          </h3>
          <p className="text-gray-500">
            {isAdd
              ? "Nhập thông tin nhân viên vào form để thêm dữ liệu."
              : "Cập nhật thông tin nhân viên."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-start gap-4 pt-[2rem]">
          <div
            className="w-[20rem] h-[20rem] flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-md cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-colors overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <FontAwesomeIcon icon={faUser} className="text-[4rem]" />
                <FontAwesomeIcon icon={faAdd} className="text-[1.4rem]" />
                <span className="text-[1.3rem]">Chọn hình ảnh</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="text-[1.3rem] text-red-400 hover:text-red-600"
            >
              Xóa ảnh
            </button>
          )}
          <p className="text-gray-400 text-[1.2rem] text-center">
            PNG, JPG tối đa 5MB
          </p>
        </div>

        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="px-[3rem] py-[2.5rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem]">
              <div className="space-y-[1.8rem]">
                <div className="pb-[1rem] border-b border-gray-100">
                  <h4 className="text-[1.5rem] font-semibold text-gray-500 uppercase tracking-wide">
                    Thông tin tài khoản
                  </h4>
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="email"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Email nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    disabled={!isAdd}
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="password"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    {isAdd ? (
                      <>
                        Mật khẩu <span className="text-red-500">*</span>
                      </>
                    ) : (
                      <>
                        Mật khẩu mới{" "}
                        <span className="text-gray-400 font-normal text-[1.3rem]">
                          (để trống nếu không đổi)
                        </span>
                      </>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={
                        isAdd ? "Tối thiểu 6 ký tự" : "Để trống nếu không đổi"
                      }
                      className="w-full border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400 pr-[4rem]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="position"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Vị trí <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400 bg-white"
                  >
                    {POSITION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="status"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400 bg-white"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-[1.8rem]">
                <div className="pb-[1rem] border-b border-gray-100">
                  <h4 className="text-[1.5rem] font-semibold text-gray-500 uppercase tracking-wide">
                    Thông tin cá nhân
                  </h4>
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="fullName"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="phoneNumber"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="0901234567"
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="gender"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400 bg-white"
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="salary"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Lương (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="salary"
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="5000000"
                    min={0}
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex flex-col gap-[.6rem]">
                  <label
                    htmlFor="startDate"
                    className="text-[1.4rem] font-medium text-gray-700"
                  >
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[.6rem] px-[1.2rem] py-[.8rem] text-[1.4rem] focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {messageError && (
              <p className="text-red-500 text-[1.4rem] mt-[1.5rem] bg-red-50 px-[1.2rem] py-[.8rem] rounded-[.6rem] border border-red-200">
                {messageError}
              </p>
            )}

            <div className="flex items-center justify-end gap-[1rem] mt-[2.5rem] pt-[2rem] border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-[2.4rem] py-[1rem] rounded-[.8rem] text-gray-600 text-[1.6rem] font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Đặt lại
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-[.6rem] px-[2.4rem] py-[1rem] rounded-[.8rem] text-white text-[1.6rem] font-medium transition-colors cursor-pointer disabled:opacity-60 ${
                  isAdd
                    ? "bg-cyan-500 hover:bg-cyan-600"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {isSubmitting ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faFloppyDisk} />
                )}
                {isSubmitting
                  ? "Đang lưu..."
                  : isAdd
                    ? "Thêm nhân viên"
                    : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ActionStaff;
