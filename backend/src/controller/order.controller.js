import orderService from "../services/order.service.js";

const orderController = {
  handleOrder: async (req, res) => {
    try {
      const result = await orderService.handleOrder(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.handleOrder]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleOrderTable: async (req, res) => {
    try {
      const result = await orderService.handleOrderTable(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.handleOrderTable]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleCancelOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;
      const result = await orderService.handleCancelOrder(orderId, reason);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.handleCancelOrder]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleCancelOrderTable: async (req, res) => {
    try {
      const { orderTableId } = req.params;
      const { reason } = req.body;
      const result = await orderService.handleCancelOrderTable(
        orderTableId,
        reason,
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.handleCancelOrderTable]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleUpdateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const result = await orderService.handleUpdateOrderStatus(
        orderId,
        status,
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.handleUpdateOrderStatus]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleUpdateOrderTableStatus: async (req, res) => {
    try {
      const { orderTableId } = req.params;
      const { status } = req.body;
      const result = await orderService.handleUpdateOrderTableStatus(
        orderTableId,
        status,
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "[orderController.handleUpdateOrderTableStatus]",
        error.message,
      );
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleCheckOrderTableDist: async (req, res) => {
    try {
      const result = await orderService.handleCheckOrderTableDist(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "[orderController.handleCheckOrderTableDist]",
        error.message,
      );
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  handleOrderTableDate: async (req, res) => {
    try {
      const { orderDate } = req.params;
      const result = await orderService.handleOrderTableDate(orderDate);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.handleOrderTableDate]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  getAllOrderForAdmin: async (req, res) => {
    try {
      const result = await orderService.getAllOrderForAdmin();
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.getAllOrderForAdmin]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  getAllOrderTableForAdmin: async (req, res) => {
    try {
      const result = await orderService.getAllOrderTableForAdmin();
      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "[orderController.getAllOrderTableForAdmin]",
        error.message,
      );
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  getUserOrderTableHistory: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await orderService.getUserOrderTableHistory(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "[orderController.getUserOrderTableHistory]",
        error.message,
      );
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },
  getOrderTableById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await orderService.getOrderTableById(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[orderController.getOrderTableById]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },
};

export default orderController;
