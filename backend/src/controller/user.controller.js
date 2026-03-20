import userService from "../services/user.service.js";

export const userController = {
  getProfileUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const message = await userService.getProfileUser(userId);
      return res.status(200).json(message);
    } catch (error) {
      return res.status(200).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleUpdateProfileUser: async (req, res) => {
    try {
      const filename = req.file ? `uploads/${req.file.filename}` : null;
      const message = await userService.handleUpdateProfileUser(
        req.body,
        filename,
      );
      return res.status(200).json(message);
    } catch (error) {
      return res.status(200).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleCreateAdmin: async (req, res) => {
    try {
      console.log(req.body);
      const file = req.file ? `uploads/${req.file.filename}` : null;
      const message = await userService.createAdmin(req.body, file);
      return res.status(200).json(message);
    } catch (error) {
      return res.status(200).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getAllUserOrderHistory: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId);
      const dataHistory = await userService.getAllUserOrderHistory(userId);
      return res.status(200).json(dataHistory);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },

  getDetailOrderTableForUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const dataHistory = await userService.getDetailOrderTableForUser(userId);
      return res.status(200).json(dataHistory);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getAllOrderDishForAdmin: async (req, res) => {
    try {
      const data = await userService.getAllOrderDishForAdmin();
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getAllOrderTableDishForAdmin: async (req, res) => {
    try {
      const data = await userService.getAllOrderTableDishForAdmin();
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleAuthpayment: async (req, res) => {
    try {
      const data = await userService.handleAuthpayment(req.body);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getDetailOrder: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const data = await userService.getDetailOrder(orderId);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getDetailOrderTable: async (req, res) => {
    try {
      const { orderTableId } = req.params;
      console.log(orderTableId);
      const data = await userService.getDetailOrderTable(orderTableId);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
};

export default userController;
