import revenueService from "../services/revenue.service.js";

const revenueController = {
  getWeekRevenue: async (req, res) => {
    try {
      const data = await revenueService.getWeekRevenue();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server error!",
        error,
      });
    }
  },
  getWeeklyRevenue: async (req, res) => {
    try {
      const { year, month, week } = req.body;
      const message = await revenueService.getWeeklyRevenue(year, month, week);
      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server error!",
      });
    }
  },
  getYearRevenue: async (req, res) => {
    try {
      const message = await revenueService.getYearRevenue();
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server error!",
      });
    }
  },
};
export default revenueController;
