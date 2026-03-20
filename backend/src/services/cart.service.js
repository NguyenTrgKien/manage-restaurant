import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cartService = {
  getCart: async (userId) => {
    try {
      const cart = await prisma.cart.findUnique({
        where: { user: { id: userId } },
      });

      if (!cart) {
        return {
          errCode: 1,
          message: "Không tìm thấy giỏ hàng!",
        };
      }

      const cartItem = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });

      return {
        errCode: 0,
        message: "Lấy giỏ hàng thành công!",
        cartItem,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  handleAddProductCart: async (data) => {
    try {
      const { userId, foodId, quantityOrder } = data;
      if (!userId || !foodId || !quantityOrder) {
        return {
          errCode: 1,
          message: "Missing require parameter!",
        };
      }

      let cart = await prisma.cart.findUnique({
        where: { user: { id: userId } },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          userId,
        });
      }

      const check = await prisma.cartItem.findUnique({
        where: { cartId: cart.id, foodId: foodId },
      });

      if (check) {
        return {
          errCode: 2,
          message: "Sản phẩm đã có trong giỏ hàng!",
        };
      }
      const dataProduct = await prisma.cartItem.create({
        cartId: cart.id,
        foodId,
        quantityOrder,
      });
      return {
        errCode: 0,
        message: "Thêm sản phẩm thành công!",
        dataProduct,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  handleUpdateQuantityOrderCart: async (data) => {
    try {
      const { quantityOrder, foodId, userId } = data;
      if (!quantityOrder || !foodId || !userId) {
        return {
          errCode: 1,
          message: "Missing require parameter!",
        };
      }

      let cart = await prisma.cart.findUnique({
        where: { user: { id: userId } },
      });

      if (!cart) {
        return {
          errCode: 2,
          message: "Không tìm thấy giỏ hàng!",
        };
      }

      const cartItem = await prisma.cartItem.findUnique({
        where: { foodId: foodId, cartId: cart.id },
      });

      if (!cartItem) {
        return {
          errCode: 3,
          message: "Sản phẩm không có trong giỏ hàng!",
        };
      }

      await prisma.cartItem.update(
        {
          quantityOrder: quantityOrder,
        },
        {
          where: { foodId: foodId, cartId: cart.id },
        },
      );

      return {
        errCode: 0,
        message: "Cập nhật thành công !",
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  handleDeleteProductCart: async (userId, foodId) => {
    try {
      if (!foodId || !userId) {
        return {
          errCode: 1,
          message: "Missing require parameter!",
        };
      }

      let cart = await prisma.cart.findUnique({
        where: { user: { id: userId } },

      });

      if (!cart) {
        return {
          errCode: 2,
          message: "Không tìm thấy giỏ hàng!",
        };
      }

      const cartItem = await prisma.cartItem.findUnique({
        where: { cartId: cart.id, foodId: foodId },
      });

      await cartItem.destroy({
        where: { foodId: foodId },
      });

      return {
        errCode: 0,
        message: "Xóa thành công!",
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  handleDeleteAllCart: async (userId) => {
    try {
      if (!userId) {
        return {
          errCode: 1,
          message: "Missing require parameter!",
        };
      }
      let cart = await prisma.cart.findUnique({
        where: { user: { id: userId } },
      });

      if (!cart) {
        return {
          errCode: 2,
          message: "Không tìm thấy giỏ hàng!",
        };
      }

      await prisma.cart.destroy({
        where: { user: { id: userId } },
      });

      return {
        errCode: 0,
        message: "Xóa toàn bộ giỏ hàng thành công!",
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  handleUpdateAllCart: async (data) => {
    try {
      const { userId, cart } = data;
      if (!cart || cart?.length === 0 || !userId) {
        return {
          errCode: 1,
          message: "Missing require parameter!",
        };
      }

      let cartUser = await prisma.cart.findUnique({
        where: { user: { id: userId } },
      });

      if (!cartUser) {
        return {
          errCode: 2,
          message: "Không tìm thấy giỏ hàng!",
        };
      }

      const cartItem = await prisma.cartItem.findMany({
        where: { cartId: cartUser.id },
      });
      if (!cartItem) {
        return {
          errCode: 3,
          message: "Không tìm thấy sản phẩm!",
        };
      }
      for (let item of cartItem) {
        const updateItem = cart.find((it) => it.foodId == item.foodId);
        if (updateItem) {
          await prisma.cartItem.update(
            { quantityOrder: updateItem.quantityOrder },
            { where: { id: item.id } },
          );
        }
      }

      return {
        errCode: 0,
        message: "Cập nhật thành công!",
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default cartService;
