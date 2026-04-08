import axiosInstance from "../configs/axiosInstance";

export const createIngredient = async (data) => {
  const res = await axiosInstance.post(`/api/v1/ingredients`, data);
  return res;
};

export const editIngredient = async (id, data) => {
  const res = await axiosInstance.patch(`/api/v1/ingredients/${id}`, data);
  return res;
};

export const getAllIngredient = async ({ page, limit, name, categoryId }) => {
  const queryParams = {
    page,
    limit,
    ...(categoryId ? { categoryId } : {}),
    ...(name ? { name } : {}),
  };
  const res = await axiosInstance.get(`/api/v1/ingredients`, {
    params: queryParams,
  });
  return res.data;
};

export const getAllIngredientCategory = async () => {
  const res = await axiosInstance.get(`/api/v1/ingredient-categories`);
  return res.data;
};

export const createIngreCate = async (name) => {
  const res = await axiosInstance.post(`/api/v1/ingredient-categories`, {
    name,
  });
  return res;
};
