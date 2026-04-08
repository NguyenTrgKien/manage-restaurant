import { PrismaClient } from "@prisma/client";
import AppError from "../common/httpStatusConfig.js";

const prisma = new PrismaClient();

const supplierService = {
  getAllSuppliers: async () => {
    const suppliers = await prisma.suppliers.findMany();
    return suppliers;
  },
  getSupplierById: async (id) => {
    const supplier = await prisma.suppliers.findUnique({
      where: { id },
    });
    return supplier;
  },
  createSupplier: async (data) => {
    const supplier = await prisma.suppliers.findUnique({
      where: { email: data.email },
    });

    if (supplier) {
      throw new AppError("Email đã tồn tại!", 400);
    }

    const newSupplier = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };

    const createdSupplier = await prisma.suppliers.create({
      data: newSupplier,
    });

    return createdSupplier;
  },
  updateSupplier: async (id, data) => {
    const updatedSupplier = await prisma.suppliers.update({
      where: { id },
      data: data,
    });
    return updatedSupplier;
  },
  toggleSupplier: async (id) => {
    const supplier = await prisma.suppliers.findUnique({
      where: { id },
    });
    if (!supplier) {
      throw new AppError("Không tìm thấy nhà cung cấp!", 404);
    }

    await prisma.suppliers.update({
      where: { id },
      data: {
        status: supplier.status === "active" ? "inactive" : "active",
      },
    });

    return {
      message: `${supplier === "active" ? "Đã ngừng" : "Đã mở"} nhà cung cấp!`,
    };
  },
};
export default supplierService;
