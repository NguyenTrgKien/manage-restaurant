import axiosInstance from "../configs/axiosInstance";

export const getAllCustomer = async ({ limit = 10, page = 1, phone }) => {
  const queryParams = { limit, page };
  if (phone) {
    queryParams.phone = phone;
  }

  return await axiosInstance.get("/api/v1/customers", {
    params: queryParams,
  });
};

export const getCustomerById = async (customerId) => {
  return await axiosInstance.get(`/api/v1/customers/${customerId}`);
};

export const getCustomerOrders = async (customerId) => {
  return await axiosInstance.get(`/api/v1/customers/${customerId}/orders`);
};

export const getCustomerByPhone = async (phoneNumber) => {
  return await axiosInstance.get(`/api/v1/customers/phone`, {
    params: { phoneNumber },
  });
};
