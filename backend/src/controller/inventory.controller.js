import inventoryService from "../services/inventory.service.js";

const inventoryController = {
  importStock: async (req, res) => {
    try {
      const data = req.body;
      const user = req.user;
      const result = await inventoryService.importStock(data, user);
      return res.status(201).json({
        message: "Thêm nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[create]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
  updateStock: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await inventoryService.updateStock(id, data);
      return res.status(200).json({
        message: "Cập nhật nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[updateStock]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
  getAllInventory: async (req, res) => {
    try {
      const query = req.query;
      const result = await inventoryService.getAllInventory(query);
      return res.status(200).json({
        message: "Lấy danh sách nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[getAllInventory]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
  getAllReceipt: async (req, res) => {
    try {
      const query = req.query;
      const result = await inventoryService.getAllReceipt(query);
      return res.status(200).json({
        message: "Lấy danh sách nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[getAll]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },

  getReceiptById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await inventoryService.getReceiptById(id);
      return res.status(200).json({
        message: "Lấy thông tin phiếu nhập thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[getById]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },

  approveReceipt: async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const result = await inventoryService.approveReceipt(id, user);

      return res.status(200).json({
        message: "Duyệt phiếu nhập thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[approve]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },

  rejectReceipt: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await inventoryService.rejectReceipt(id, reason);

      return res.status(200).json({
        message: "Từ chối phiếu nhập thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[reject]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const query = req.query;
      const result = await inventoryService.getTransactions(query);
      return res.status(200).json({
        message: "Lấy danh sách giao dịch thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[getTransactions]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await inventoryService.getTransactionById(id);
      return res.status(200).json({
        message: "Lấy thông tin giao dịch thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`inventory_controller[getTransactionById]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
};

export default inventoryController;
