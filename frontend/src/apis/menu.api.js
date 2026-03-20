import axiosInstance from "../configs/axiosInstance";

export const getAllFood = async () => {
  const res = await axiosInstance.get(`/api/v1/foods`);
  return res;
};

export const createFood = async (formData) => {
  const res = await axiosInstance.post(`/api/v1/foods`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const editFood = async (formData) => {
  const res = await axiosInstance.put(`/api/v1/foods`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteFood = async (foodId) => {
  const res = await axiosInstance.delete(`/api/v1/foods/${foodId}`);
  return res.data;
};
