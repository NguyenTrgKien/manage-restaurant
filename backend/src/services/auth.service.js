import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
dotenv.config();
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const client = new OAuth2Client(process.env.GG_CLIENT_ID);

const authService = {
  getAllUser: async () => {
    try {
      const data = await prisma.user.findMany();
      if (data) {
        return {
          errCode: 0,
          message: data,
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  generateToken: (user) => {
    const payload = {
      id: user.id,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  },
  login: async (email, password) => {
    if (!email || !password) {
      return {
        errCode: 1,
        message: "Vui lòng nhập đầy đủ thông tin!",
      };
    }
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return {
        errCode: 2,
        message: "Email không tồn tại! Vui lòng đăng kí tài khoản.",
      };
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return {
        errCode: 3,
        message: "Mật khẩu không đúng!",
      };
    }

    const token = authService.generateToken(user);

    return {
      errCode: 0,
      message: "Login success!",
      user: {
        id: user.id,
        fullName: user.fullName,
        image: user.image,
        role: user.role,
      },
      access_token: token,
    };
  },
  handleAuthLoginGoogle: async (data) => {
    try {
      const { token } = data;
      console.log(token);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GG_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log(payload);
      const { email, name, picture: image, sub: userId } = payload;
      console.log(name);
      let user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        await prisma.user.create({
          email,
          fullName: name,
          image: image,
          role: "user",
        });
      } else {
        await prisma.user.update(
          {
            image: image,
            fullName: name,
          },
          {
            where: { email: email },
          },
        );
      }

      user = await prisma.user.findUnique({
        where: { email: email },
      });

      return {
        errCode: 0,
        message: "Đăng nhập thành công!",
        user: {
          email: user.email,
          image: user.image,
          name: name,
          id: user.id,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  handleRegisterUser: async (data) => {
    try {
      const { fullName, passwordRegister, emailRegister, phoneNumber, role } =
        data;
      if (
        !fullName ||
        !passwordRegister ||
        !emailRegister ||
        !phoneNumber ||
        !role
      ) {
        return {
          errCode: 1,
          message: "Missing require parameter!",
        };
      }
      const user = await prisma.user.findUnique({
        where: { email: emailRegister },
      });
      if (user) {
        return {
          errCode: 2,
          message: "Email đã được sử dụng!",
        };
      }
      const hashPasword = await bcrypt.hash(passwordRegister, 10);
      const createUser = await prisma.user.create({
        fullName,
        email: emailRegister,
        password: hashPasword,
        role,
      });

      await prisma.customer.create({
        fullName,
        userId: createUser.id,
        phoneNumber,
      });

      return {
        errCode: 0,
        message: "Tạo ngừi dùng thành công!",
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default authService;
