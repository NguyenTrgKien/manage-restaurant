import userService from "../services/user.service.js";

export const userController = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await userService.getUserById(id);
      if (response.errCode === 0) {
        return response.status(200).json(response);
      }
      const { status, ...result } = response;
      return response.status(response.status).json(result);
    } catch (error) {
      console.error("[userController.getUserById]", error.message);
      return res.status(500).json({ errCode: 1, message: "Lỗi server!" });
    }
  },
};

export default userController;
