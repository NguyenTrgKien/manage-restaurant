import authService from "../services/auth.service.js";
import { PrismaClient } from "@prisma/client";
import userService from "../services/user.service.js";

const prisma = new PrismaClient();

const authController = {
  getAllUser: async (req, res) => {
    try {
      const data = await authService.getAllUser();
      if (data.errCode == 0) {
        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(200).json({
        errCode: 1,
        message: "Server Error!",
      });
    }
  },
  handleLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (result.errCode === 0) {
        const access_token = result.access_token;

        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
      }

      return res
        .status(200)
        .json({ message: "Đăng nhập thành công!", user: result.user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleAuthLoginGoogle: async (req, res) => {
    try {
      const message = await authService.handleAuthLoginGoogle(req.body);
      if (message.errCode === 0) {
        req.session.user = message.user;
      }
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getMe: async (req, res) => {
    const token = req.user;
    const user = await userService.getUserById(token.id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng này!",
      });
    }
    const { password, ...result } = user;
    return res.status(200).json({
      user: result,
    });
  },
  handleRegisterUser: async (req, res) => {
    try {
      const message = await authService.handleRegisterUser(req.body);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Lỗi Server, vui lòng thử lại sau!",
      });
    }
  },
  handleLogOut: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi khi đăng xuất!",
        });
      }
      res.clearCookie("connect.sid"); // Xóa cookie session
      return res.status(200).json({
        errCode: 0,
        message: "Đăng xuất thành công!",
      });
    });
  },
};

export default authController;
