import ingredientCateService from "../services/ingredientCate.service.js";

const ingredientCateController = {
  create: async (req, res) => {
    try {
      const data = req.body;
      const result = await ingredientCateService.create(data);
      return res.status(201).json({
        message: "Thêm nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`ingredientCate_controller[create]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const query = req.params;
      const result = await ingredientCateService.getAll(query);
      return res.status(200).json({
        message: "Lấy danh sách nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`ingredientCate_controller[getAll]`, error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Lỗi server!",
      });
    }
  },
};

export default ingredientCateController;
