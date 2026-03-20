import moment from "moment";
import { PrismaClient } from "@prisma/client";
import paymentService from "./payment.service.js";

const prisma = new PrismaClient();

const FINAL_ORDER_STATUSES = ["PAID", "CANCELLED", "COMPLETED"];
const FINAL_ORDER_TABLE_STATUSES = ["COMPLETED", "CANCELLED", "NO_SHOW"];

const orderService = {
  handleOrder: async (data) => {
    try {
      const { userId, orderTableId, fullName, paymentMethod, items } = data;

      if (!items || items.length === 0)
        return { errCode: 1, message: "Vui lòng chọn ít nhất một món!" };
      if (!fullName?.trim())
        return { errCode: 1, message: "Vui lòng nhập tên khách hàng!" };

      const result = await prisma.$transaction(async (tx) => {
        const foodIds = items.map((i) => i.foodId);
        const foods = await tx.food.findMany({
          where: { id: { in: foodIds } },
        });
        const foodMap = new Map(foods.map((f) => [f.id, f]));

        for (const item of items) {
          const food = foodMap.get(item.foodId);
          if (!food) throw new Error(`Không tìm thấy món có id ${item.foodId}`);
          if (!food.isAvailable)
            throw new Error(`Món "${food.name}" hiện không phục vụ`);
          if (food.quantity < item.quantity)
            throw new Error(`Số lượng món "${food.name}" không đủ`);
        }

        const totalAmount = items.reduce((sum, item) => {
          const food = foodMap.get(item.foodId);
          return sum + Number(food.price) * item.quantity;
        }, 0);

        if (orderTableId) {
          const orderTable = await tx.orderTable.findUnique({
            where: { id: Number(orderTableId) },
          });
          if (!orderTable) throw new Error("Đơn đặt bàn không tồn tại!");
        }

        const newOrder = await tx.order.create({
          data: {
            userId: userId ? Number(userId) : null,
            orderTableId: orderTableId ? Number(orderTableId) : null,
            totalAmount,
            paymentMethod: paymentMethod ?? "CASH",
            fullName: fullName.trim(),
            status: "PENDING",
          },
        });

        await tx.orderItem.createMany({
          data: items.map((item) => ({
            orderId: newOrder.id,
            foodId: item.foodId,
            quantity: item.quantity,
            foodName: foodMap.get(item.foodId).name,
            price: foodMap.get(item.foodId).price,
          })),
        });

        for (const item of items) {
          await tx.food.update({
            where: { id: item.foodId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        let paymentUrl = null;
        if (paymentMethod === "MOMO") {
          const momoOrderId = `${newOrder.id}_${Date.now()}`;
          paymentUrl = await paymentService.handleCreatePaymentMomo(
            totalAmount,
            momoOrderId,
          );
        }

        return { newOrder, paymentUrl };
      });

      return {
        errCode: 0,
        message: "Tạo đơn hàng thành công!",
        data: result,
      };
    } catch (error) {
      console.error("[orderService.handleOrder]", error.message);
      return { errCode: 1, message: error.message || "Lỗi khi tạo đơn hàng" };
    }
  },

  handleOrderTable: async (data) => {
    try {
      const {
        userId,
        tableId,
        timeFrameId,
        orderDate,
        numberGuests,
        fullName,
        note,
      } = data;

      if (!tableId) return { errCode: 1, message: "Vui lòng chọn bàn!" };
      if (!timeFrameId)
        return { errCode: 1, message: "Vui lòng chọn khung giờ!" };
      if (!orderDate) return { errCode: 1, message: "Vui lòng chọn ngày đến!" };
      if (!fullName?.trim())
        return { errCode: 1, message: "Vui lòng nhập tên khách hàng!" };
      if (!numberGuests || Number(numberGuests) < 1)
        return { errCode: 1, message: "Số khách phải ít nhất là 1!" };

      const table = await prisma.table.findUnique({
        where: { id: Number(tableId) },
      });
      if (!table) return { errCode: 1, message: "Bàn không tồn tại!" };
      if (table.status === "MAINTENANCE")
        return {
          errCode: 1,
          message: "Bàn đang bảo trì, vui lòng chọn bàn khác!",
        };

      const timeFrame = await prisma.timeFrame.findUnique({
        where: { id: Number(timeFrameId) },
      });
      if (!timeFrame)
        return { errCode: 1, message: "Khung giờ không tồn tại!" };
      if (!timeFrame.isActive)
        return { errCode: 1, message: "Khung giờ này hiện không hoạt động!" };

      const parsedDate = moment(orderDate, ["YYYY-MM-DD"], true);
      if (!parsedDate.isValid())
        return { errCode: 1, message: "Định dạng ngày không hợp lệ!" };

      const existing = await prisma.orderTable.findFirst({
        where: {
          tableId: Number(tableId),
          timeFrameId: Number(timeFrameId),
          orderDate: parsedDate.toDate(),
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      });
      if (existing)
        return {
          errCode: 1,
          message: "Bàn này đã có người đặt trong khung giờ đó!",
        };

      const newOrderTable = await prisma.orderTable.create({
        data: {
          userId: userId ? Number(userId) : null,
          tableId: Number(tableId),
          timeFrameId: Number(timeFrameId),
          orderDate: parsedDate.toDate(),
          numberGuests: Number(numberGuests),
          note: note?.trim() ?? null,
          status: "PENDING",
        },
      });

      return {
        errCode: 0,
        message: "Đặt bàn thành công!",
        data: newOrderTable,
      };
    } catch (error) {
      console.error("[orderService.handleOrderTable]", error.message);
      return { errCode: 1, message: error.message || "Lỗi khi đặt bàn" };
    }
  },

  handleCancelOrder: async (orderId, reason) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: { orderItems: true },
      });

      if (!order) return { errCode: 1, message: "Không tìm thấy đơn hàng!" };
      if (order.status === "CANCELLED")
        return { errCode: 1, message: "Đơn hàng đã được hủy trước đó!" };
      if (FINAL_ORDER_STATUSES.includes(order.status))
        return {
          errCode: 1,
          message: "Không thể hủy đơn hàng ở trạng thái này!",
        };

      await prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
          if (item.foodId) {
            await tx.food.update({
              where: { id: item.foodId },
              data: { quantity: { increment: item.quantity } },
            });
          }
        }

        await tx.order.update({
          where: { id: Number(orderId) },
          data: {
            status: "CANCELLED",
            cancelReason: reason?.trim() ?? null,
          },
        });
      });

      return { errCode: 0, message: "Hủy đơn hàng thành công!" };
    } catch (error) {
      console.error("[orderService.handleCancelOrder]", error.message);
      return { errCode: 1, message: "Lỗi khi hủy đơn hàng" };
    }
  },

  handleCancelOrderTable: async (orderTableId, reason) => {
    try {
      const orderTable = await prisma.orderTable.findUnique({
        where: { id: Number(orderTableId) },
      });

      if (!orderTable)
        return { errCode: 1, message: "Không tìm thấy đơn đặt bàn!" };
      if (FINAL_ORDER_TABLE_STATUSES.includes(orderTable.status))
        return { errCode: 1, message: "Không thể hủy đơn ở trạng thái này!" };

      await prisma.orderTable.update({
        where: { id: Number(orderTableId) },
        data: {
          status: "CANCELLED",
          cancelReason: reason?.trim() ?? null,
        },
      });

      return { errCode: 0, message: "Hủy đơn đặt bàn thành công!" };
    } catch (error) {
      console.error("[orderService.handleCancelOrderTable]", error.message);
      return { errCode: 1, message: "Lỗi khi hủy đơn đặt bàn" };
    }
  },

  handleUpdateOrderStatus: async (orderId, status) => {
    try {
      const VALID_STATUSES = [
        "PENDING",
        "CONFIRM",
        "PREPARING",
        "READY",
        "WAITPAYMENT",
        "PAID",
        "CANCELLED",
        "COMPLETED",
        "NO_SHOW",
        "FAILED",
      ];

      if (!VALID_STATUSES.includes(status))
        return { errCode: 1, message: "Trạng thái không hợp lệ!" };

      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
      });
      if (!order) return { errCode: 1, message: "Không tìm thấy đơn hàng!" };
      if (FINAL_ORDER_STATUSES.includes(order.status))
        return { errCode: 1, message: "Đơn hàng đã ở trạng thái kết thúc!" };

      const updated = await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
          status,
          ...(status === "PAID" && { paidAt: new Date() }),
        },
      });

      return {
        errCode: 0,
        message: "Cập nhật trạng thái thành công!",
        data: updated,
      };
    } catch (error) {
      console.error("[orderService.handleUpdateOrderStatus]", error.message);
      return { errCode: 1, message: "Lỗi khi cập nhật trạng thái" };
    }
  },

  handleUpdateOrderTableStatus: async (orderTableId, status) => {
    try {
      const VALID_STATUSES = [
        "PENDING",
        "CONFIRM",
        "CHECKED_IN",
        "COMPLETED",
        "NO_SHOW",
        "CANCELLED",
      ];

      if (!VALID_STATUSES.includes(status))
        return { errCode: 1, message: "Trạng thái không hợp lệ!" };

      const orderTable = await prisma.orderTable.findUnique({
        where: { id: Number(orderTableId) },
      });
      if (!orderTable)
        return { errCode: 1, message: "Không tìm thấy đơn đặt bàn!" };
      if (FINAL_ORDER_TABLE_STATUSES.includes(orderTable.status))
        return { errCode: 1, message: "Đơn đặt bàn đã ở trạng thái kết thúc!" };

      const updated = await prisma.orderTable.update({
        where: { id: Number(orderTableId) },
        data: { status },
      });

      return {
        errCode: 0,
        message: "Cập nhật trạng thái thành công!",
        data: updated,
      };
    } catch (error) {
      console.error(
        "[orderService.handleUpdateOrderTableStatus]",
        error.message,
      );
      return { errCode: 1, message: "Lỗi khi cập nhật trạng thái đặt bàn" };
    }
  },

  handleCheckOrderTableDist: async (data) => {
    try {
      const { orderDate, tableId, timeFrameId } = data;

      if (!orderDate || !tableId || !timeFrameId)
        return { errCode: 1, message: "Thiếu thông tin kiểm tra!" };

      const parsedDate = moment(orderDate, ["YYYY-MM-DD"], true);
      if (!parsedDate.isValid())
        return { errCode: 1, message: "Định dạng ngày không hợp lệ!" };

      const orderTable = await prisma.orderTable.findFirst({
        where: {
          tableId: Number(tableId),
          timeFrameId: Number(timeFrameId),
          orderDate: parsedDate.toDate(),
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      });

      if (!orderTable) return { errCode: 0, message: "Chưa có người đặt" };
      return { errCode: 1, message: "Đã có người đặt" };
    } catch (error) {
      console.error("[orderService.handleCheckOrderTableDist]", error.message);
      return { errCode: 1, message: "Lỗi khi kiểm tra bàn" };
    }
  },

  handleOrderTableDate: async (orderDate) => {
    try {
      const parsedDate = moment(orderDate, ["YYYY-MM-DD", "YYYY/M/D"], true);
      if (!parsedDate.isValid())
        return { errCode: 1, message: "Định dạng ngày không hợp lệ!" };

      const startDate = parsedDate.clone().startOf("day").toDate();
      const endDate = parsedDate.clone().endOf("day").toDate();

      const data = await prisma.orderTable.findMany({
        where: { orderDate: { gte: startDate, lte: endDate } },
        include: {
          table: { select: { id: true, name: true, capacity: true } },
          timeFrame: { select: { id: true, startTime: true, endTime: true } },
          user: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return { errCode: 0, message: "Thành công!", data };
    } catch (error) {
      console.error("[orderService.handleOrderTableDate]", error.message);
      return { errCode: 1, message: "Lỗi khi lấy danh sách đặt bàn" };
    }
  },

  getAllOrderForAdmin: async () => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          orderItems: {
            include: {
              food: {
                select: { id: true, name: true, price: true, image: true },
              },
            },
          },
          orderTable: {
            include: {
              table: { select: { id: true, name: true } },
              timeFrame: {
                select: { id: true, startTime: true, endTime: true },
              },
            },
          },
        },
      });

      return {
        errCode: 0,
        message: "Lấy danh sách đơn hàng thành công!",
        data: orders,
      };
    } catch (error) {
      console.error("[orderService.getAllOrderForAdmin]", error.message);
      return { errCode: 1, message: "Lỗi khi lấy danh sách đơn hàng" };
    }
  },

  getAllOrderTableForAdmin: async () => {
    try {
      const orderTables = await prisma.orderTable.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          table: { select: { id: true, name: true, capacity: true } },
          timeFrame: { select: { id: true, startTime: true, endTime: true } },
          orders: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              paymentMethod: true,
            },
          },
        },
      });

      return {
        errCode: 0,
        message: "Lấy danh sách đặt bàn thành công!",
        data: orderTables,
      };
    } catch (error) {
      console.error("[orderService.getAllOrderTableForAdmin]", error.message);
      return { errCode: 1, message: "Lỗi khi lấy danh sách đặt bàn" };
    }
  },

  getUserOrderTableHistory: async (userId) => {
    try {
      const data = await prisma.orderTable.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: "desc" },
        include: {
          table: { select: { id: true, name: true, capacity: true } },
          timeFrame: { select: { id: true, startTime: true, endTime: true } },
          orders: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              orderItems: {
                include: {
                  food: { select: { id: true, name: true, image: true } },
                },
              },
            },
          },
        },
      });

      return { errCode: 0, message: "Thành công!", data };
    } catch (error) {
      console.error("[orderService.getUserOrderTableHistory]", error.message);
      return { errCode: 1, message: "Lỗi khi lấy lịch sử đặt bàn" };
    }
  },
  getOrderTableById: async (id) => {
    try {
      const orderTable = await prisma.orderTable.findUnique({
        where: { id: Number(id) },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          table: { select: { id: true, name: true, capacity: true } },
          timeFrame: { select: { id: true, startTime: true, endTime: true } },
          orders: {
            orderBy: { createdAt: "asc" },
            include: {
              orderItems: {
                include: {
                  food: { select: { id: true, name: true, image: true } },
                },
              },
            },
          },
        },
      });

      if (!orderTable)
        return { errCode: 1, message: "Không tìm thấy đơn đặt bàn!" };

      return { errCode: 0, message: "Thành công!", data: orderTable };
    } catch (error) {
      console.error("[orderService.getOrderTableById]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },
};

export default orderService;
