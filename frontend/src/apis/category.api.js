import axiosInstance from "../configs/axiosInstance";

export const getCategory = () =>
  axiosInstance.get(`/api/v1/get-category`).then((r) => r.data);

export const createCategory = async (data) => {
  return await axiosInstance
    .post(`/api/v1/create-category`, data)
    .then((r) => r.data);
};

export const editCategory = (data) =>
  axiosInstance.put(`/api/v1/edit-category`, data).then((r) => r.data);

export const deleteCategory = (id) =>
  axiosInstance.delete(`/api/v1/delete-category/${id}`).then((r) => r.data);
