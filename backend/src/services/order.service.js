import { PrismaClient } from "@prisma/client";
import paymentService from "./payment.service.js";
import AppError from "../common/httpStatusConfig.js";

const prisma = new PrismaClient();

const orderService = {
  handleOrderDish: async (data) => {
    try {
      const {
        customerId,
        fullName,
        phoneNumber,
        paymentMethod,
        totalAmount,
        orderItems,
        note,
      } = data;

      if (!orderItems || orderItems.length === 0) {
        throw new AppError("Vui lòng chọn ít nhất một món!", 400);
      }
      if (!customerId && !fullName) {
        throw new AppError(
          "Vui lòng nhập tên khách hàng hoặc chọn một khách hàng!",
          400,
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        let customer = null;
        if (customerId) {
          customer = await tx.customer.findUnique({
            where: { id: customerId },
          });

          if (!customer) {
            throw new AppError("Không tìm thấy khách hàng này!", 404);
          }
        }
        const foodIds = orderItems.map((i) => i.foodId);
        const foods = await tx.food.findMany({
          where: { id: { in: foodIds } },
        });
        const foodMap = new Map(foods.map((f) => [f.id, f]));

        for (const item of orderItems) {
          const food = foodMap.get(item.foodId);
          if (!food) {
            throw new AppError(`Không tìm thấy món có id ${item.foodId}`, 404);
          }
          if (!food.isAvailable) {
            throw new AppError(`Món "${food.name}" hiện không phục vụ`, 409);
          }
          if (food.quantity < item.quantity) {
            throw new AppError(`Số lượng món "${food.name}" không đủ`, 409);
          }
        }

        const totalAmountServer = orderItems.reduce((sum, item) => {
          const food = foodMap.get(item.foodId);
          return sum + Number(food.price) * item.quantity;
        }, 0);

        if (Math.abs(Number(totalAmount) - totalAmountServer) > 0.001) {
          throw new AppError("Tổng tiền không khớp!", 400);
        }

        if (!customerId) {
          customer = await tx.customer.create({
            data: {
              fullName,
              phoneNumber,
            },
          });
        }

        const newOrder = await tx.order.create({
          data: {
            totalAmount: totalAmountServer,
            status: "PENDING",
            note,
            customerId: customer.id,
          },
        });

        if (paymentMethod) {
          await tx.payment.create({
            data: {
              amount: totalAmountServer,
              method: paymentMethod,
              status: "pending",
              orderId: newOrder.id,
            },
          });
        }

        await tx.orderItem.createMany({
          data: orderItems.map((item) => ({
            orderId: newOrder.id,
            foodId: item.foodId,
            quantity: item.quantity,
            foodName: foodMap.get(item.foodId).name,
            price: foodMap.get(item.foodId).price,
          })),
        });

        await Promise.all(
          orderItems.map((item) =>
            tx.food.update({
              where: { id: item.foodId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            }),
          ),
        );

        let paymentUrl = null;
        if (paymentMethod === "momo") {
          const momoOrderId = `${newOrder.id}_${Date.now()}`;
          paymentUrl = await paymentService.handleCreatePaymentMomo(
            totalAmountServer,
            momoOrderId,
          );
        }

        return { newOrder, paymentUrl };
      });

      return {
        message: "Tạo đơn hàng thành công!",
        data: result,
      };
    } catch (error) {
      console.error("[orderService.handleOrderDish]", error.message);
      throw error;
    }
  },

  handleOrderDish: async (data) => {
    try {
      const {
        customerId,
        fullName,
        tableId,
        phoneNumber,
        paymentMethod,
        numberGuest,
        totalAmount,
        orderDate,
        orderItems,
        note,
      } = data;

      const table = await prisma.table.findUnique({
        where: {
          id: tableId,
        },
      });

      if (!table) {
        throw new AppError("Không tìm thấy bàn này!", 404);
      }

      const dateConflict = await prisma.orderTable.findFirst({
        where: {
          orderDate: orderDate,
          timeFrameId: timeFrameId,
          tableId: tableId,
        },
      });

      if (dateConflict) {
        throw new AppError("Đã có người đặt trước vào thời điểm này!", 400);
      }
      if (Number(numberGuest) > table.capacity) {
        throw new AppError("Số lượng khách vượt quá sức chứa của bàn!", 400);
      }

      if (!customerId && !fullName) {
        throw new AppError(
          "Vui lòng nhập tên khách hàng hoặc chọn một khách hàng!",
          400,
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        let customer = null;
        if (customerId) {
          customer = await tx.customer.findUnique({
            where: { id: customerId },
          });
        }
        let totalAmountServer = 0;
        if (orderItems && orderItems.length > 0) {
          const foodIds = orderItems.map((i) => i.foodId);
          const foods = await tx.food.findMany({
            where: { id: { in: foodIds } },
          });
          const foodMap = new Map(foods.map((f) => [f.id, f]));

          for (const item of orderItems) {
            const food = foodMap.get(item.foodId);
            if (!food) {
              throw new AppError(
                `Không tìm thấy món có id ${item.foodId}`,
                404,
              );
            }
            if (!food.isAvailable) {
              throw new AppError(`Món "${food.name}" hiện không phục vụ`, 409);
            }
            if (food.quantity < item.quantity) {
              throw new AppError(`Số lượng món "${food.name}" không đủ`, 409);
            }
          }

          totalAmountServer = orderItems.reduce((sum, item) => {
            const food = foodMap.get(item.foodId);
            return sum + Number(food.price) * item.quantity;
          }, 0);

          if (Number(totalAmount) !== totalAmountServer) {
            throw new AppError("Tổng tiền không khớp!", 400);
          }
        }
        const dataOrder = customer
          ? {
              customerId: customer.id,
            }
          : {
              fullName: trim(fullName),
              phoneNumber: trim(phoneNumber),
            };

        const newOrderTable = await tx.orderTable.create({
          tableId,
          orderDate,
          status: "PENDING",
          numberGuest,
          timeFrameId,
          note,
          ...dataOrder,
        });

        let newOrder = null;
        if (orderItems && orderItems.length > 0) {
          newOrder = await tx.order.create({
            data: {
              totalAmount: totalAmountServer,
              status: "PENDING",
              orderTableId: newOrderTable.id,
              note,
              ...dataOrder,
            },
          });

          await tx.orderItem.createMany({
            data: orderItems.map((item) => ({
              orderId: newOrder.id,
              foodId: item.foodId,
              quantity: item.quantity,
              foodName: foodMap.get(item.foodId).name,
              price: foodMap.get(item.foodId).price,
            })),
          });
          if (paymentMethod) {
            await tx.payment.create({
              data: {
                amount: totalAmountServer,
                method: paymentMethod,
                status: "pending",
                orderId: newOrder.id,
              },
            });
          }
        }

        for (const item of orderItems) {
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
        if (paymentMethod === "momo") {
          const momoOrderId = `${newOrder.id}_${Date.now()}`;
          paymentUrl = await paymentService.handleCreatePaymentMomo(
            totalAmount,
            momoOrderId,
          );
        }

        return { newOrder, paymentUrl };
      });

      return {
        message: "Tạo đơn đặt bàn thành công!",
        data: result,
      };
    } catch (error) {
      console.error("[orderService.handleOrderTable]", error.message);
      throw error;
    }
  },
};

export default orderService;
