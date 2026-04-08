import axiosInstance from "../configs/axiosInstance";

export const getAllFood = async ({ limit, page, price, name, isActive }) => {
  const res = await axiosInstance.get(`/api/v1/foods`, {
    params: {
      query: {
        limit,
        page,
        price,
        name,
        isActive,
      },
    },
  });
  return res;
};

export const createFood = async (formData) => {
  const res = await axiosInstance.post(`/api/v1/foods`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const editFood = async (id, formData) => {
  const res = await axiosInstance.patch(`/api/v1/foods/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteFood = async (foodId) => {
  const res = await axiosInstance.delete(`/api/v1/foods/${foodId}`);
  return res;
};
