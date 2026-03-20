import timeframeService from "../services/timeframe.service.js";

const timeframeController = {
  create: async (req, res) => {
    try {
      const data = req.body;
      const result = await timeframeService.create(data);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[timeframeController.create]", error.message);
      return res.status(500).json({ errCode: 1, message: "Lỗi server!" });
    }
  },
  getAllTimeframe: async (req, res) => {
    try {
      const result = await timeframeService.getAllTimeframe();
      return res.status(200).json(result);
    } catch (error) {
      console.error("[timeframeController.getAllTimeframe]", error.message);
      return res.status(500).json({ errCode: 1, message: "Lỗi server!" });
    }
  },
  updateTimeframe: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await timeframeService.updateTimeframe(id, data);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[timeframeController.updateTimeframe]", error.message);
      return res.status(500).json({ errCode: 1, message: "Lỗi server!" });
    }
  },
  toggleTimeframe: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await timeframeService.toggleTimeframe(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[timeframeController.toggleTimeframe]", error.message);
      return res.status(500).json({ errCode: 1, message: "Lỗi server!" });
    }
  },
};

export default timeframeController;
