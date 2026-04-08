import ingredientService from "../services/ingredient.service.js";

const ingredientController = {
  create: async (req, res) => {
    try {
      const data = req.body;
      const result = await ingredientService.create(data);
      return res.status(201).json({
        message: "Thêm nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`ingredient_controller[create]`, error);
      return res.status(error.statusCode || 500).json({
        messsage: error.messsage || "Lỗi server!",
      });
    }
  },
  updateIngredient: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await ingredientService.updateIngredient(id, data);
      return res.status(200).json({
        message: "Cập nhật nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`ingredient_controller[updateIngredient]`, error);
      return res.status(error.statusCode || 500).json({
        messsage: error.messsage || "Lỗi server!",
      });
    }
  },
  getAllIngredient: async (req, res) => {
    try {
      const query = req.query;
      const result = await ingredientService.getAllIngredient(query);
      return res.status(200).json({
        message: "Lấy danh sách nguyên liệu thành công!",
        data: result,
      });
    } catch (error) {
      console.log(`ingredient_controller[getAllIngredient]`, error);
      return res.status(error.statusCode || 500).json({
        messsage: error.messsage || "Lỗi server!",
      });
    }
  },
};

export default ingredientController;
