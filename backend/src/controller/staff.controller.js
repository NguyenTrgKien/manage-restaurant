import staffService from "../services/staff.service.js";

const staffController = {
  handleCreateStaff: async (req, res) => {
    try {
      const image_url = req.file?.path ?? null;
      const publicId = req.file?.filename ?? null;

      const message = await staffService.createStaff(
        req.body,
        image_url,
        publicId,
      );

      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getAllStaff: async (req, res) => {
    try {
      const data = await staffService.getAllStaff();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  getStaffById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await staffService.getStaffById(id);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleUpdateStaff: async (req, res) => {
    try {
      const image_url = req.file?.path;
      const publicId = req.file?.filename;
      const { id } = req.params;
      const data = await staffService.handleUpdateStaff(
        Number(id),
        req.body,
        image_url,
        publicId,
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
  handleChangeStatusStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({
          errCode: 1,
          message: "Thiếu userId hoặc status!",
        });
      }

      const data = await staffService.handleChangeStatusStaff(id, status);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errCode: -1,
        message: "Server Error!",
      });
    }
  },
};

export default staffController;
