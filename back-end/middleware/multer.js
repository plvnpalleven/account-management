const multer = require("multer");

// กำหนด Storage แบบ MemoryStorage เพื่อส่งไฟล์ไปยัง Cloudinary โดยตรง
const storage = multer.diskStorage({});

const upload = multer({ storage });

module.exports = upload;
