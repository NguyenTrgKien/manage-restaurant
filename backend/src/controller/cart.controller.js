import cartService from "../services/cart.service.js";

const cartController = {
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await cartService.getCart(userId);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleAddProductCart: async (req, res) => {
    try {
      const message = await cartService.handleAddProductCart(req.body);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Sever Error!",
      });
    }
  },
  handleUpdateQuantityOrderCart: async (req, res) => {
    try {
      const data = req.body;
      console.log(data);
      const message = await cartService.handleUpdateQuantityOrderCart(data);
      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleDeleteProductCart: async (req, res) => {
    try {
      const { userId, foodId } = req.query;
      console.log(userId, foodId);
      const message = await cartService.handleDeleteProductCart(userId, foodId);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleUpdateAllCart: async (req, res) => {
    try {
      const message = await cartService.handleUpdateAllCart(req.body);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleDeleteAllCart: async (req, res) => {
    try {
      const { userId } = req.query;
      const message = await cartService.handleDeleteAllCart(userId);
      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
};

export default cartController;
