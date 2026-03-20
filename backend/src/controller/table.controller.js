import tableService from "../services/table.service.js";

const tableController = {
  getAllTable: async (req, res) => {
    try {
      const result = await tableService.getAllTable();
      return res.status(200).json(result);
    } catch (error) {
      console.error("[tableController.getAllTable]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  getTableById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await tableService.getTableById(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[tableController.getTableById]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  createTable: async (req, res) => {
    try {
      const data = req.body;
      const result = await tableService.createTable(data);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[tableController.createTable]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  updateTable: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await tableService.updateTable({ id, ...data });
      return res.status(200).json(result);
    } catch (error) {
      console.error("[tableController.updateTable]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  toggleMaintenance: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await tableService.toggleMaintenance(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[tableController.toggleMaintenance]", error.message);
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },
};

export default tableController;
