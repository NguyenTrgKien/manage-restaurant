import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinaryConfig.js";

const prisma = new PrismaClient();

const staffService = {
  createStaff: async (data, image_url, publicId) => {
    try {
      const {
        email,
        password,
        position,
        fullName,
        status,
        phoneNumber,
        salary,
        gender,
        startDate,
      } = data;

      const hashPassword = await bcrypt.hash(password, 10);

      const checkEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (checkEmail) {
        throw new Error("Email đã tồn tại!");
      }

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            fullName,
            email,
            password: hashPassword,
            role: "staff",
            image: image_url,
            publicId,
          },
        });

        const staff = await tx.staff.create({
          data: {
            position,
            status,
            salary: Number(salary),
            gender,
            startDate: new Date(startDate),
            phoneNumber,
            userId: user.id,
          },
        });

        return { user, staff };
      });

      return {
        errCode: 0,
        message: "Create staff success!",
        data: result,
      };
    } catch (error) {
      console.log(error);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      throw error;
    }
  },

  getAllStaff: async () => {
    try {
      const users = await prisma.user.findMany({
        where: { role: "staff" },
        include: { staff: true },
      });

      const data = users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        image: u.image,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        ...u.staff,
      }));
      return {
        errCode: 0,
        message: "Get staff success!",
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  getStaffById: async (id) => {
    try {
      const staff = await prisma.staff.findUnique({
        where: { id: Number(id) },
        include: {
          user: true,
        },
      });

      if (!staff) {
        return {
          errCode: 1,
          message: "Không tìm thấy nhân viên!",
        };
      }

      const data = {
        ...staff.user,
        ...staff,
      };

      delete data.user;

      return {
        errCode: 0,
        message: "Get detail staff success!",
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  handleUpdateStaff: async (id, data, image_url, publicId) => {
    try {
      const {
        email,
        password,
        position,
        fullName,
        status,
        phoneNumber,
        salary,
        gender,
        startDate,
      } = data;

      const staff = await prisma.staff.findUnique({
        where: { id: Number(id) },
        include: { user: true },
      });

      if (!staff || !staff.user) {
        return { errCode: 1, message: "Không tìm thấy staff!" };
      }

      let hashPassword = staff.user.password;
      if (password) {
        hashPassword = await bcrypt.hash(password, 10);
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: staff.user.id },
          data: {
            ...(fullName && { fullName }),
            ...(email && { email }),
            ...(password && { password: hashPassword }),
            ...(image_url && { image: image_url, publicId }),
          },
        });

        await tx.staff.update({
          where: { id: Number(id) },
          data: {
            ...(position && { position }),
            ...(status && { status }),
            ...(salary !== undefined && { salary: Number(salary) }),
            ...(gender && { gender }),
            ...(startDate && { startDate: new Date(startDate) }),
            ...(phoneNumber && { phoneNumber }),
          },
        });
      });

      return {
        errCode: 0,
        message: "Cập nhật staff thành công!",
      };
    } catch (error) {
      console.error(error);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      if (error.code === "P2002") {
        return {
          errCode: 2,
          message: "Email đã tồn tại!",
        };
      }

      throw error;
    }
  },

  handleChangeStatusStaff: async (id, newStatus) => {
    try {
      const STATUS = ["WORKING", "ON_LEAVE", "RESIGNED"];
      if (!STATUS.includes(newStatus)) {
        return { errCode: 2, message: "Trạng thái không hợp lệ!" };
      }

      const staff = await prisma.staff.findUnique({
        where: { id: Number(id) },
      });

      if (!staff) {
        return { errCode: 1, message: "Không tìm thấy nhân viên!" };
      }

      await prisma.staff.update({
        where: { id: Number(id) },
        data: { status: newStatus },
      });

      return {
        errCode: 0,
        message: `Cập nhật trạng thái thành công: ${newStatus}`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default staffService;
