import categoryService from "../services/category.service.js";

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const result = await categoryService.getAllCategory();
      return res.status(200).json(result);
    } catch (error) {
      console.error("[getAllCategory]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const result = await categoryService.createCategory({ name });
      return res.status(result.errCode === 0 ? 201 : 400).json(result);
    } catch (error) {
      console.error("[createCategory]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const result = await categoryService.updateCategory({ id, name });
      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      console.error("[updateCategory]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await categoryService.deleteCategory(id);
      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      console.error("[deleteCategory]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },
};

export default categoryController;
