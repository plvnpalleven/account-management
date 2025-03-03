const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinaryConfig");

router.delete("/", async (req, res) => {
  try {
    const { publicId, resource_type } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: "No publicId provided" });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });

    if (result.result === "not found") {
      return res.status(404).json({ message: "File not found on cloudinary" });
    }
    res.json({ message: "File deleted successfully", result });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      message: "Failed to delete file",
      error: error.message,
    });
  }
});

module.exports = router;
