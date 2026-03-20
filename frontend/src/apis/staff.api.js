import axiosInstance from "../configs/axiosInstance";

export const createStaff = async (data) => {
  return await axiosInstance.post("/api/v1/staffs", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllStaff = async () => {
  return await axiosInstance.get(`/api/v1/staffs`);
};

export const getStaffById = async (id) => {
  return await axiosInstance.get(`/api/v1/staffs/${id}`);
};

export const changeStatusStaff = async ({ id, status }) => {
  return await axiosInstance.patch(`/api/v1/staffs/${id}/status`, { status });
};

export const updateStaff = async ({ id, formData }) => {
  return await axiosInstance.patch(`/api/v1/staffs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
