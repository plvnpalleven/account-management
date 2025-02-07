const express = require("express");
const { login, validateToken } = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/validate-token", validateToken);

router.post("/login", login);

router.get("/dashboard", protect, (req, res) => {
  //ใครจะเรียก /api/employees/dashboard ได้ ต้องมี token ที่ถูก
  //สมมติว่าส่งข้อมูลกลับ
  res.json({ status: "OK", message: "Protected dashboard data" });
});

module.exports = router;
