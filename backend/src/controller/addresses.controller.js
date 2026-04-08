import fs from "fs";

const addressController = {
  getAllAddress: async (req, res) => {
    try {
      const data = fs.readFileSync("src/data/address.json", "utf-8");
      const addresses = JSON.parse(data);
      return res.status(200).json({
        message: "All addresses retrieved successfully",
        data: addresses,
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving address", error });
    }
  },
};
export default addressController;
