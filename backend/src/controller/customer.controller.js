import customerService from "../services/customer.service.js";

export const customerController = {
  getAllCustomer: async (req, res) => {
    try {
      const { limit = 10, page = 1, phone } = req.query;
      const limitNum = Number(limit);
      const pageNum = Number(page);

      if (isNaN(limitNum) || isNaN(pageNum)) {
        return res.status(400).json({
          message: "Limit hoặc page không hợp lệ!",
        });
      }

      const customers = await customerService.getAllCustomer(
        limitNum,
        pageNum,
        phone,
      );
      return res.status(200).json({
        message: "Lấy danh sách khách hàng thành công!",
        data: customers,
      });
    } catch (error) {
      console.error("[customerController.getAllCustomer]", error.message);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  },
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const userIdNum = Number(id);
      if (isNaN(userIdNum)) {
        return res.status(400).json({
          message: "Id khách hàng không hợp lệ!",
        });
      }
      const response = await customerService.getCustomerById(userIdNum);
      return res.status(200).json({
        message: "Lấy thông tin khách hàng thành công!",
        data: response,
      });
    } catch (error) {
      console.error("[customerController.getCustomerById]", error.message);
      return res.status(error.status || 500).json({
        message: error.message || "Lỗi server",
      });
    }
  },

  getCustomerOrders: async (req, res) => {
    try {
      const { id } = req.params;
      const userIdNum = Number(id);
      if (isNaN(userIdNum)) {
        return res.status(400).json({
          message: "Id khách hàng không hợp lệ!",
        });
      }
      const response = await customerService.getCustomerOrders(userIdNum);
      return res.status(200).json({
        message: "Lấy thông danh sách đơn hàng của khách hàng thành công!",
        data: response,
      });
    } catch (error) {
      console.error("[customerController.getCustomerOrders]", error.message);
      return res.status(error.status || 500).json({
        message: error.message || "Lỗi server",
      });
    }
  },
  getCustomerByPhone: async (req, res) => {
    try {
      const { phoneNumber } = req.query;

      if (phoneNumber.trim().length > 10 || phoneNumber.trim().length < 10) {
        return res.status(400).json({
          message: "Số điện thoại không hợp lệ!",
        });
      }

      const response = await customerService.getCustomerByPhone(phoneNumber);
      return res.status(200).json({
        message: "Lấy khách hàng thành công!",
        data: response,
      });
    } catch (error) {
      console.error("[customerController.getCustomerByPhone]", error.message);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server",
      });
    }
  },
};

export default customerController;
