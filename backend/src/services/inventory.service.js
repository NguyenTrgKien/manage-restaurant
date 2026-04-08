import { PrismaClient } from "@prisma/client";
import AppError from "../common/httpStatusConfig.js";
import { nanoid } from "nanoid";
const prisma = new PrismaClient();

const inventoryService = {
  importStock: async (data, user) => {
    const { supplierId, note, items } = data;

    return await prisma.$transaction(async (tx) => {
      const receiptCode = `RC-${nanoid(8)}`;

      const supplier = await tx.suppliers.findUnique({
        where: { id: Number(supplierId) },
      });

      if (!supplier) {
        throw new AppError(
          `Nhà cung cấp với id=${supplierId} không tồn tại!`,
          404,
        );
      }

      if (supplier.status !== "active") {
        throw new AppError(
          `Nhà cung cấp với id=${supplierId} không hoạt động!`,
          400,
        );
      }

      let totalAmount = 0;
      const newReceipt = await tx.inventoryReceipts.create({
        data: {
          supplierId,
          receiptCode,
          receiptDate: new Date(),
          status: "draft",
          totalAmount,
          note,
          createdBy: user.id,
        },
      });

      for (const item of items) {
        const { quantity, ingredientId, unitPrice } = item;

        const ingredient = await prisma.ingredient.findUnique({
          where: { id: ingredientId },
        });

        if (!ingredient) {
          throw new AppError(
            `Nguyên liệu với id=${ingredientId} không tồn tại!`,
          );
        }

        const totalPrice = Number(quantity) * Number(unitPrice);
        totalAmount = totalAmount + totalPrice;
        if (quantity <= 0) {
          throw new AppError("Số lượng phải lớn hơn 0");
        }
        const manufactureDate = new Date(item.manufactureDate);
        const expiryAt = new Date(item.expiryAt);
        const now = new Date();
        if (expiryAt <= manufactureDate) {
          throw new AppError("Ngày hết hạn phải sau ngày sản xuất!");
        }
        if (expiryAt <= now) {
          throw new AppError("Nguyên liệu đã hết hạn!");
        }

        const batchNumber = `BN-${nanoid(8)}`;

        await tx.inventoryReceiptItem.create({
          data: {
            receiptId: newReceipt.id,
            ingredientId,
            batchNumber,
            quantity,
            unitPrice,
            manufactureDate,
            expiryAt,
          },
        });
      }

      const updateReceipt = await tx.inventoryReceipts.update({
        where: {
          id: newReceipt.id,
        },
        data: {
          totalAmount,
        },
      });

      return updateReceipt;
    });
  },

  updateStock: async (id, data) => {
    const { supplierId, note, items } = data;

    return await prisma.$transaction(async (tx) => {
      const existingReceipt = await tx.inventoryReceipts.findUnique({
        where: { id: Number(id) },
      });

      if (!existingReceipt) {
        throw new AppError(`Phiếu nhập kho với id=${id} không tồn tại!`, 404);
      }

      if (existingReceipt.status !== "draft") {
        throw new AppError(
          "Chỉ có thể chỉnh sửa phiếu ở trạng thái nháp (draft)!",
          400,
        );
      }

      if (supplierId) {
        const supplier = await tx.suppliers.findUnique({
          where: { id: Number(supplierId) },
        });

        if (!supplier || supplier.status !== "active") {
          throw new AppError(
            `Nhà cung cấp không tồn tại hoặc không hoạt động!`,
            400,
          );
        }
      }

      await tx.inventoryReceiptItem.deleteMany({
        where: { receiptId: Number(id) },
      });

      let totalAmount = 0;

      if (items && items.length > 0) {
        for (const item of items) {
          const {
            quantity,
            ingredientId,
            unitPrice,
            manufactureDate,
            expiryAt,
          } = item;

          const ingredient = await tx.ingredient.findUnique({
            where: { id: ingredientId },
          });

          if (!ingredient) {
            throw new AppError(`Nguyên liệu id=${ingredientId} không tồn tại!`);
          }

          if (quantity <= 0) throw new AppError("Số lượng phải lớn hơn 0");

          const mDate = new Date(manufactureDate);
          const eDate = new Date(expiryAt);
          const now = new Date();

          if (eDate <= mDate)
            throw new AppError("Ngày hết hạn phải sau ngày sản xuất!");
          if (eDate <= now) throw new AppError("Nguyên liệu đã hết hạn!");

          totalAmount += Number(quantity) * Number(unitPrice);

          const batchNumber = `BN-${nanoid(8)}`;

          await tx.inventoryReceiptItem.create({
            data: {
              receiptId: existingReceipt.id,
              ingredientId,
              batchNumber,
              quantity,
              unitPrice,
              manufactureDate: mDate,
              expiryAt: eDate,
            },
          });
        }
      }

      return await tx.inventoryReceipts.update({
        where: { id: existingReceipt.id },
        data: {
          supplierId: supplierId
            ? Number(supplierId)
            : existingReceipt.supplierId,
          note,
          totalAmount,
        },
      });
    });
  },

  getAllInventory: async (query) => {
    const { page = 1, limit = 10 } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const where = {};

    if (query.name) {
      where.ingredient = {
        name: {
          contains: query.name,
          mode: "insensitive",
        },
      };
    }

    const inventory = await prisma.inventory.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limitNum,
      include: {
        ingredient: true,
      },
    });
    return inventory;
  },

  getAllReceipt: async (query) => {
    const { page = 1, limit = 10 } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const where = {};

    if (query.supplierId) {
      where.supplierId = Number(query.supplierId);
    }

    if (query.receiptDate) {
      const date = new Date(query.receiptDate);

      if (!isNaN(date)) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        where.receiptDate = { gte: start, lte: end };
      }
    }

    if (query.receiptCode) {
      where.receiptCode = query.receiptCode;
    }

    if (query.status) {
      where.status = query.status;
    }

    const receipts = await prisma.inventoryReceipts.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    });

    return receipts;
  },

  getReceiptById: async (id) => {
    const receipt = await prisma.inventoryReceipts.findUnique({
      where: { id: Number(id) },
      include: {
        supplier: true,
        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    if (!receipt) {
      throw new AppError(`Phiếu nhập với id=${id} không tồn tại!`, 404);
    }
    return receipt;
  },

  approveReceipt: async (id, user) => {
    return await prisma.$transaction(async (tx) => {
      const receipt = await tx.inventoryReceipts.findUnique({
        where: { id: Number(id) },
        include: {
          items: true,
        },
      });
      if (!receipt) {
        throw new AppError(`Phiếu nhập với id=${id} không tồn tại!`, 404);
      }
      if (receipt.status !== "draft") {
        throw new AppError(
          "Chỉ có thể duyệt phiếu nhập ở trạng thái nháp!",
          400,
        );
      }

      const transactions = [];

      for (const item of receipt.items) {
        const ingredient = await tx.ingredient.findUnique({
          where: { id: item.ingredientId },
          include: {
            inventory: true,
          },
        });

        const quantity = ingredient.inventory?.quantity || 0;
        const avgPrice = ingredient.inventory?.avgPrice || 0;
        if (!ingredient) {
          throw new AppError("Nguyên liệu không tồn tại!", 400);
        }

        const beforeQuantity = Number(ingredient.inventory.quantity);
        const afterQuantity = beforeQuantity + Number(item.quantity);

        const newAvgPrice =
          (quantity * avgPrice +
            Number(item.quantity) * Number(item.unitPrice)) /
          (quantity + Number(item.quantity));

        if (!ingredient.inventory) {
          await tx.inventory.create({
            data: {
              ingredientId: ingredient.id,
              quantity: afterQuantity,
              avgPrice: newAvgPrice,
              lastUpdatedAt: new Date(),
            },
          });
        } else {
          await tx.inventory.update({
            where: { ingredientId: item.ingredientId },
            data: {
              quantity: afterQuantity,
              avgPrice: newAvgPrice,
            },
          });
        }

        transactions.push({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          type: "stock_in",
          referenceType: "receipt",
          referenceId: receipt.id,
          beforeQuantity,
          afterQuantity,
          costPrice: item.unitPrice,
          createdBy: user.id,
        });
      }
      await tx.inventoryTransactions.createMany({
        data: transactions,
      });

      const updateReceipt = await tx.inventoryReceipts.update({
        where: { id: Number(id) },
        data: {
          status: "completed",
        },
      });

      return updateReceipt;
    });
  },

  rejectReceipt: async (id, reason) => {
    const receipt = await prisma.inventoryReceipts.findUnique({
      where: { id: Number(id) },
    });
    if (!receipt) {
      throw new AppError(`Phiếu nhập với id=${id} không tồn tại!`, 404);
    }
    if (receipt.status !== "draft") {
      throw new AppError(
        "Chỉ có thể từ chối phiếu nhập ở trạng thái nháp!",
        400,
      );
    }

    const updatedReceipt = await prisma.inventoryReceipts.update({
      where: { id: Number(id) },
      data: {
        status: "cancelled",
        cancelReason: reason,
      },
    });

    return updatedReceipt;
  },

  getTransactions: async (query) => {
    const { page = 1, limit = 10 } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const where = {};

    if (query.ingredientName) {
      where.ingredient = {
        name: {
          contains: query.ingredientName,
          mode: "insensitive",
        },
      };
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.createdAt) {
      const date = new Date(query.createdAt);
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    const transactions = await prisma.inventoryTransactions.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ingredient: true,
      },
      skip,
      take: limitNum,
    });

    return transactions;
  },
  getTransactionById: async (id) => {
    const transaction = await prisma.inventoryTransactions.findUnique({
      where: { id: Number(id) },
      include: {
        ingredient: true,
      },
    });

    if (!transaction) {
      throw new AppError(`Giao dịch với id=${id} không tồn tại!`, 404);
    }

    return transaction;
  },
};

export default inventoryService;
