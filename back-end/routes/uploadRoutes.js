const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinaryConfig");

// Endpoint สำหรับอัปโหลดไฟล์
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // อัปโหลดไฟล์ไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "employees/documents", // ระบุโฟลเดอร์ใน Cloudinary
    });

    res.status(200).json({
      message: "File uploaded successfully",
      fileURL: result.secure_url, // URL ของไฟล์ใน Cloudinary
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});

module.exports = router;
