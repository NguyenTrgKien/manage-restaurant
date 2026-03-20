import evaluateService from "../services/evaluate.service.js";

const evaluateController = {
  handleEvaluateProduct: async (req, res) => {
    try {
      console.log(req.body);
      const message = await evaluateService.handleEvaluateProduct(req.body);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        errCode: -1,
        message: "Error Server!",
      });
    }
  },
  getEvaluateProduct: async (req, res) => {
    try {
      const { userId } = req.params;
      const message = await evaluateService.getEvaluateProduct(userId);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        errCode: -1,
        message: "Error Server!",
      });
    }
  },
  getEvaluateDetailProduct: async (req, res) => {
    try {
      const { foodId } = req.params;
      const message = await evaluateService.getEvaluateDetailProduct(foodId);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        errCode: -1,
        message: "Error Server!",
      });
    }
  },
};

export default evaluateController;
