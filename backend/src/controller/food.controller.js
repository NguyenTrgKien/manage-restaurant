import foodService from "../services/food.service.js";
import cloudinary from "../config/cloudinaryConfig.js";

const foodController = {
  handleCreateFood: async (req, res) => {
    try {
      const imageUrl = req.file?.path ?? null;
      const result = await foodService.createFood(req.body, imageUrl);
      return res.status(result.errCode === 0 ? 201 : 400).json(result);
    } catch (error) {
      console.error("[handleCreateFood]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
  },
  handleEditFood: async (req, res) => {
    try {
      const imageUrl = req.file?.path ?? null;

      if (imageUrl && req.body.oldImage) {
        const publicId = extractPublicId(req.body.oldImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      const result = await foodService.editFood(req.body, imageUrl);
      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      console.error("[handleEditFood]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
  },

  getAllFood: async (req, res) => {
    try {
      const result = await foodService.getAllFood();
      return res.status(200).json(result);
    } catch (error) {
      console.error("[getAllFood]", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
  },
  handleDeleteFood: async (req, res) => {
    try {
      const { foodId } = req.params;

      const result = await foodService.deleteFood(foodId);
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
};

const extractPublicId = (url) => {
  if (!url?.includes("cloudinary.com")) return null;
  const parts = url.split("/upload/");
  const withExt = parts[1].replace(/^v\d+\//, "");
  return withExt.replace(/\.[^/.]+$/, "");
};

export default foodController;
