import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const userService = {
  getUserById: async (userId) => {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
  getProfileUser: async (userId) => {
    try {
      if (!userId) {
        return {
          errCode: 1,
          message: "Missing parameter!",
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          fullName: true,
          email: true,
          image: true,
          role: true,
          staff: true,
          customer: true,
        },
      });

      if (!user) {
        return {
          errCode: 2,
          message: "User not found!",
        };
      }

      const profileData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        image: user.image || "Chưa cập nhật",
        role: user.role || "Chưa cập nhật",
        phoneNumber: "Chưa cập nhật",
        address: "Chưa cập nhật",
        gender: "Chưa cập nhật",
        birthday: "Chưa cập nhật",
      };

      if (user.role === "user" && user.customer) {
        profileData.phoneNumber = user.customer.phoneNumber || "Chưa cập nhật";
        profileData.address = user.customer.address || "Chưa cập nhật";
        profileData.birthday = user.customer.birthday || "Chưa cập nhật";
        profileData.gender = user.customer.gender || "Chưa cập nhật";
      }

      if (user.role === "staff" && user.staff) {
        profileData.phoneNumber = user.staff.phoneNumber || "Chưa cập nhật";
        profileData.address = user.staff.address || "Chưa cập nhật";
        profileData.birthday = user.staff.birthday || "Chưa cập nhật";
        profileData.gender = user.staff.gender || "Chưa cập nhật";

        profileData.staffInfo = {
          startDate: user.staff.startDate,
          positionId: user.staff.positionId,
          salary: user.staff.salary,
        };
      }

      return {
        errCode: 0,
        message: "Get profile success!",
        data: profileData,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  handleUpdateProfileUser: async (data, fileName) => {
    try {
      const { fullName, address, phoneNumber, birthday, gender, userId } = data;

      if (!userId) {
        return {
          errCode: 1,
          message: "Missing parameter!",
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return {
          errCode: 2,
          message: "User not found!",
        };
      }

      await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          fullName,
          image: fileName || user.image,
        },
      });

      if (user.role === "user") {
        await prisma.customer.update({
          where: { userId: Number(userId) },
          data: {
            address,
            phoneNumber,
            birthday: birthday ? new Date(birthday) : null,
            gender,
          },
        });
      }

      if (user.role === "staff") {
        await prisma.staff.update({
          where: { userId: Number(userId) },
          data: {
            address,
            phoneNumber,
            birthday: birthday ? new Date(birthday) : null,
            gender,
          },
        });
      }

      return {
        errCode: 0,
        message: "Update profile success!",
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  createAdmin: async (data, filename) => {
    try {
      const { email, password, role, fullName } = data;

      if (!email || !password || !role || !fullName || !filename) {
        return {
          errCode: 1,
          message: "Missing parameter!",
        };
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        return {
          errCode: 2,
          message: "Email already exists!",
        };
      }

      const hashPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          role,
          fullName,
          image: filename,
        },
      });

      return {
        errCode: 0,
        message: "Create admin success!",
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getAllUserOrderHistory: async (userId) => {
    try {
      const order = await prisma.order.findMany({
        where: { userId: Number(userId) },
        include: {
          orderItems: {
            include: {
              food: true,
            },
          },
          orderTable: {
            include: {
              table: true,
            },
          },
        },
      });

      return {
        errCode: 0,
        data: order,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  handleAuthpayment: async (data) => {
    try {
      const { orderId, status, orderTableId } = data;

      if (!orderId || !status || !orderTableId) {
        return {
          errCode: 1,
          message: "Missing parameter!",
        };
      }

      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
      });

      if (!order) {
        return {
          errCode: 2,
          message: "Order not found!",
        };
      }

      if (status === "COMPLETED" || status === "PAID") {
        await prisma.orderTable.update({
          where: { id: Number(orderTableId) },
          data: { status: "COMPLETED" },
        });
      }

      if (status === "CHECKED_IN") {
        await prisma.orderTable.update({
          where: { id: Number(orderTableId) },
          data: { status: "CHECKED_IN" },
        });
      }

      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status },
      });

      return {
        errCode: 0,
        message: "Update order status success!",
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getAllOrderDishForAdmin: async () => {
    try {
      const orderItems = await prisma.orderItem.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              paymentMethod: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
              orderTable: {
                select: {
                  id: true,
                  orderDate: true,
                  status: true,
                },
              },
            },
          },
          food: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      });

      return {
        errCode: 0,
        message: "Lấy danh sách đơn món ăn thành công",
        data: orderItems,
      };
    } catch (error) {
      console.error("[getAllOrderDishForAdmin]", error.message);
      return {
        errCode: 1,
        message: "Lỗi khi lấy danh sách đơn món ăn",
      };
    }
  },
};

export default userService;
