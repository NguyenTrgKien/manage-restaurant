import foodService from "../services/food.service.js";
import cloudinary from "../config/cloudinaryConfig.js";

const foodController = {
  handleCreateFood: async (req, res) => {
    try {
      const imageUrl = req.file?.path ?? null;
      const result = await foodService.createFood(req.body, imageUrl);
      return res.status(200).json({
        message: "Tạo món ăn thành công!",
        data: result,
      });
    } catch (error) {
      console.error("[handleCreateFood]", error);
      return res.status(500).json({ message: error.message || "Lỗi server!" });
    }
  },
  handleEditFood: async (req, res) => {
    try {
      const { id } = req.params;
      const idNum = Number(id);
      const imageUrl = req.file?.path ?? null;

      if (imageUrl && req.body.oldImage) {
        const publicId = extractPublicId(req.body.oldImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      const result = await foodService.editFood(idNum, req.body, imageUrl);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[handleEditFood]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
  },

  getAllFood: async (req, res) => {
    try {
      const { query } = req.query;

      if (query?.price && !["asc", "desc"].includes(query?.price)) {
        return res.status(400).json({
          message: "price không hợp lệ!",
        });
      }
      const result = await foodService.getAllFood(query);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[getAllFood]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
  },
  handleDeleteFood: async (req, res) => {
    try {
      const { id } = req.params;
      const idNumber = Number(id);

      const result = await foodService.deleteFood(idNumber);
      if (result.errCode === 0 && result.deletedImage) {
        const publicId = extractPublicId(result.deletedImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      console.error("[handleDeleteFood]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
  },

  toggleFood: async (req, res) => {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      const result = await foodService.toggleFood(idNumber);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Đã có lỗi xảy ra! Vui lòng thử lại sau.",
      });
    }
  },
};

const extractPublicId = (url) => {
  if (!url?.includes("cloudinary.com")) return null;
  const parts = url.split("/upload/");
  const withExt = parts[1].replace(/^v\d+\//, "");
  return withExt.replace(/\.[^/.]+$/, "");
};

export default foodController;
