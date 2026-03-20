import avataDefault from "../../../assets/image/avata.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBirthdayCake,
  faVenusMars,
  faCamera,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

function ProfileUser({ setDetailUser }) {
  const { user } = useAuth();
  const [dataProfile, setDataProfile] = useState({});
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [updateProfileIsSuccess, setUpdateProfileIsuccess] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    gender: "",
    birthday: "",
    userId: "",
    image: "",
  });
  const fetchUser = async () => {
    try {
      const response = await getProfileUser(user.id);
      if (response.errCode === 0) {
        setDataProfile(response.data);
        setDataUpdate((prev) => ({
          ...prev,
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address,
          gender: response.data.gender,
          birthday: response.data.birthday,
          userId: response.data.id,
          image: response.data.image,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const handleUpdateData = ({ target }) => {
    const { name, value } = target;
    if (name === "image") {
      const file = target.files[0];
      const url = URL.createObjectURL(file);
      if (url) {
        setUrlImage(url);
      }
      setDataUpdate((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setDataUpdate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitDataProfile = async () => {
    try {
      const formData = new FormData();
      Object.entries(dataUpdate).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const message = await updateProfileUser(formData);
      if (message.errCode === 0) {
        setUpdateProfileIsuccess(true);
        setIsUpdateProfile(false);
        setDetailUser(null);
        window.location.reload();
        setTimeout(() => {
          setUpdateProfileIsuccess(false);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#5454549a] z-[999] animate-fadeIn">
      {user?.id ? (
        <div className="w-full max-w-[50rem] p-[3rem] bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-[1.5rem] animate-slideUp">
          <div className="flex flex-col sm:flex-row items-center gap-[2rem] border-b border-blue-300 pb-[2rem]">
            <div className="relative flex justify-center items-center w-[12rem] h-[12rem] overflow-hidden ">
              {isUpdateProfile && (
                <label
                  htmlFor="image"
                  className="block absolute bottom-[2rem] right-[2rem] w-[2rem] h-[2rem] cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-[2rem] text-gray-200 absolute z-[100]"
                  />
                  <input
                    type="file"
                    className="image"
                    id="image"
                    name="image"
                    hidden
                    onChange={(e) => {
                      handleUpdateData(e);
                    }}
                  />
                </label>
              )}
              {urlImage ? (
                <img
                  src={urlImage}
                  alt="Avatar"
                  className="w-[10rem] h-[10rem] object-cover z-[0] border-[.3rem] border-blue-400 shadow-lg rounded-full"
                />
              ) : (
                <img
                  src={
                    dataProfile?.image?.includes("uploads")
                      ? `http://localhost:3000/${dataProfile.image}`
                      : dataProfile.image === "Chưa cập nhật"
                        ? avataDefault
                        : dataProfile.image
                  }
                  alt="Avatar"
                  className="w-[10rem] h-[10rem] object-cover z-[0] border-[.3rem] border-blue-400 shadow-lg rounded-full"
                />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-[2.5rem] font-bold text-gray-800">
                Xin chào, {dataProfile.fullName}
              </h3>
              <p className="text-[1.6rem] text-gray-600 mt-[0.5rem]">
                {dataProfile.email}
              </p>
            </div>
          </div>
          {!isUpdateProfile ? (
            <div className="mt-[2.5rem]">
              <h3 className="text-[2rem] font-semibold text-gray-700 mb-[1.5rem]">
                Thông Tin Cá Nhân
              </h3>
              <ul className="space-y-[1.5rem] text-[1.6rem] text-gray-700">
                <li className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-blue-500 w-[2rem]"
                  />
                  <span>
                    <strong className="text-gray-800">Họ và tên:</strong>{" "}
                    {dataProfile.fullName}
                  </span>
                </li>
                <li className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-blue-500 w-[2rem]"
                  />
                  <span>
                    <strong className="text-gray-800">Email:</strong>{" "}
                    {dataProfile?.email}
                  </span>
                </li>
                <li className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-blue-500 w-[2rem]"
                  />
                  <span>
                    <strong className="text-gray-800">Số điện thoại:</strong>{" "}
                    {dataProfile.phoneNumber || "Chưa cập nhật"}
                  </span>
                </li>
                <li className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-blue-500 w-[2rem]"
                  />
                  <span>
                    <strong className="text-gray-800">Địa chỉ:</strong>{" "}
                    {dataProfile.address || "Chưa cập nhật"}
                  </span>
                </li>
                <li className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faBirthdayCake}
                    className="text-blue-500 w-[2rem]"
                  />
                  <span>
                    <strong className="text-gray-800">Ngày sinh:</strong>{" "}
                    {dataProfile.dob || "Chưa cập nhật"}
                  </span>
                </li>
                <li className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faVenusMars}
                    className="text-blue-500 w-[2rem]"
                  />
                  <span>
                    <strong className="text-gray-800">Giới tính:</strong>{" "}
                    {dataProfile.gender || "Chưa cập nhật"}
                  </span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="mt-[2.5rem]">
              <h3 className="text-[2rem] font-semibold text-gray-700 mb-[1.5rem]">
                Chỉnh sửa thông tin
              </h3>
              <form onSubmit={handleSubmitDataProfile}>
                <div className="space-y-[1.5rem] text-[1.6rem] text-gray-700">
                  <div className="flex items-center gap-[1rem]">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-blue-500 w-[2rem]"
                    />
                    <label htmlFor="fullName">
                      <strong className="text-gray-800">Họ và tên:</strong>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={dataUpdate.fullName}
                      className="h-[2rem] border-b"
                      onChange={(e) => {
                        handleUpdateData(e);
                      }}
                    />
                  </div>
                  <li className="flex items-center gap-[1rem]">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-blue-500 w-[2rem]"
                    />
                    <label htmlFor="phoneNumber">
                      <strong className="text-gray-800">Số điện thoại:</strong>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={dataUpdate.phoneNumber}
                      id="phoneNumber"
                      className="h-[2rem] border-b"
                      onChange={(e) => {
                        handleUpdateData(e);
                      }}
                    />
                  </li>
                  <li className="flex items-center gap-[1rem]">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-blue-500 w-[2rem]"
                    />
                    <label htmlFor="address">
                      <strong className="text-gray-800">Địa chỉ:</strong>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={dataUpdate.address}
                      id="address"
                      className="h-[2rem] border-b"
                      onChange={(e) => {
                        handleUpdateData(e);
                      }}
                    />
                  </li>
                  <li className="flex items-center gap-[1rem]">
                    <FontAwesomeIcon
                      icon={faBirthdayCake}
                      className="text-blue-500 w-[2rem]"
                    />
                    <label htmlFor="birthday">
                      <strong className="text-gray-800">Ngày sinh:</strong>
                    </label>
                    <input
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={dataUpdate.birthday}
                      className="h-[3.4rem] w-[20rem] px-[1rem] rounded-[.5rem] border"
                      onChange={(e) => {
                        handleUpdateData(e);
                      }}
                    />
                  </li>
                  <li className="flex items-center gap-[1rem]">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="text-blue-500 w-[2rem]"
                    />
                    <label htmlFor="gender">
                      <strong className="text-gray-800">Giới tính:</strong>
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      value={dataUpdate.gender}
                      className="outline-none"
                      onChange={(e) => {
                        handleUpdateData(e);
                      }}
                    >
                      <option value="" hidden>
                        Chọn giới tính
                      </option>
                      <option value="male">Nam</option>
                      <option value="famale">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </li>
                </div>
              </form>
            </div>
          )}

          <div className="mt-[3rem] flex justify-end gap-[1.5rem]">
            <button
              className="px-[2.5rem] py-[1.2rem] bg-gray-200 text-gray-700 rounded-[0.8rem] shadow-md hover:bg-gray-300 transition-all duration-300"
              onClick={() => setDetailUser(false)}
            >
              Đóng
            </button>
            {!isUpdateProfile ? (
              <button
                className="px-[2.5rem] py-[1.2rem] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[0.8rem] shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                onClick={() => {
                  setIsUpdateProfile(true);
                }}
              >
                Chỉnh Sửa Hồ Sơ
              </button>
            ) : (
              <button
                className="px-[2.5rem] py-[1.2rem] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[0.8rem] shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                onClick={() => {
                  handleSubmitDataProfile();
                }}
              >
                Lưu
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-[3rem] rounded-[1rem] shadow-lg text-[1.8rem] text-gray-600 animate-slideUp">
          Bạn chưa đăng nhập!
        </div>
      )}
      {updateProfileIsSuccess && (
        <div className="fixed inset-0 bg-[#3f3f3f73] flex justify-center items-center">
          <div className="min-w-[10rem] h-auto rounded-[.5rem] flex flex-col gap-[1rem] justify-center items-center bg-[#fff] px-[5rem] py-[3rem] text-[2rem] shadow-2xl">
            <div className="flex justify-center items-center w-[5rem] h-[5rem] border border-gray-400 focus:ring-2 focus:ring-amber-300 rounded-[50%]">
              <FontAwesomeIcon icon={faCheck} className="text-[#05b405]" />
            </div>
            Cập nhật thành công thành công!
            <div
              className="w-[8rem] h-[4rem] flex justify-center items-center bg-[#3a84d3] rounded-[1rem] text-[#fff] border-[.3rem] text-[1.5rem] cursor-pointer border-[#98dbff]"
              onClick={() => setUpdateProfileIsuccess(false)}
            >
              Ok
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileUser;
