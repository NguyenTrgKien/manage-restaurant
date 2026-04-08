import AppError from "../common/httpStatusConfig.js";
import supplierService from "../services/supplier.service.js";

const supplierController = {
  getAllSuppliers: async (req, res) => {
    try {
      const suppliers = await supplierService.getAllSuppliers();
      return res.status(200).json({
        message: "Lấy danh sách nhà cung cấp thành công!",
        data: suppliers,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Đã có lỗi xảy ra! Vui lòng thử lại sau.",
      });
    }
  },

  getSupplierById: async (req, res) => {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber)) {
        throw new AppError("ID không hợp lệ!", 400);
      }
      const supplier = await supplierService.getSupplierById(idNumber);
      return res.status(200).json({
        message: "Lấy thông tin nhà cung cấp thành công!",
        data: supplier,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Đã có lỗi xảy ra! Vui lòng thử lại sau.",
      });
    }
  },

  createSupplier: async (req, res) => {
    try {
      const data = req.body;

      const supplier = await supplierService.createSupplier(data);
      return res.status(201).json({
        message: "Tạo nhà cung cấp thành công!",
        data: supplier,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  },
  updateSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber)) {
        throw new AppError("ID không hợp lệ!", 400);
      }
      const data = req.body;
      const supplier = await supplierService.updateSupplier(idNumber, data);
      return res.status(200).json({
        message: "Cập nhật nhà cung cấp thành công!",
        data: supplier,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  },
  toggleSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      const result = await supplierService.toggleSupplier(idNumber);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Đã có lỗi xảy ra! Vui lòng thử lại sau.",
      });
    }
  },
};

export default supplierController;
