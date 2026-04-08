import orderService from "../services/order.service.js";

const orderController = {
  handleOrderDish: async (req, res) => {
    try {
      const result = await orderService.handleOrderDish(req.body);
      return res.status(201).json({
        message: "Tạo đơn hàng thành công!",
        data: result.data,
      });
    } catch (error) {
      console.error("[orderController.handleOrderDish]", error.message);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message || "Internal Server Error!",
      });
    }
  },

  handleOrderTable: async (req, res) => {
    try {
      const result = await orderService.handleOrderTable(req.body);
      return res.status(201).json({
        message: "Tạo đơn đặt bàn thành công!",
        data: result.data,
      });
    } catch (error) {
      console.error("[orderController.handleOrderTable]", error.message);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message || "Internal Server Error!",
      });
    }
  },
};

export default orderController;
