import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const userService = {
  getUserById: async (id) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      const err = new Error("Không tìm thấy người dùng!");
      err.status = 404;
      throw err;
    }

    return user;
  },
};

export default userService;
