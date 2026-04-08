import { PrismaClient } from "@prisma/client";
import AppError from "../common/httpStatusConfig.js";

const prisma = new PrismaClient();

const customerService = {
  getAllCustomer: async (limit, page, phone) => {
    const skip = (page - 1) * limit;
    const customers = await prisma.customer.findMany({
      where: {
        phoneNumber: {
          contains: phone,
          mode: "insensitive",
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    return customers;
  },
  getCustomerById: async (customerId) => {
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      include: {
        user: true,
      },
    });

    if (!customer) {
      const err = new Error("Không tìm thấy khách hàng!");
      err.status = 404;
      throw err;
    }

    return customer;
  },
  getCustomerOrders: async (customerId) => {
    const orders = await prisma.order.findMany({
      where: {
        customerId: customerId,
      },
      include: {
        orderItems,
        customer: {
          user: true,
        },
      },
    });

    return orders;
  },

  getCustomerByPhone: async (phoneNumber) => {
    const customer = await prisma.customer.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!customer) {
      throw new AppError("Khách hàng không tồn tại!", 404);
    }

    return customer;
  },
};

export default customerService;
