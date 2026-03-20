import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateOrderStatus = async (orderId, status) => {
  try {
    const realOrderId = orderId.split("_")[0];

    const order = await prisma.order.findUnique({
      where: {
        id: Number(realOrderId),
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!order) {
      console.log(`Không tìm thấy đơn hàng: ${orderId}`);
      return false;
    }

    await prisma.order.update({
      where: {
        id: Number(realOrderId),
      },
      data: {
        status: status,
      },
    });

    console.log(`Đơn hàng ${orderId} đã cập nhật trạng thái: ${status}`);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default updateOrderStatus;
