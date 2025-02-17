const express = require("express");
const {
  getEmployees,
  updateEmployeeStatus,
} = require("../controllers/recruitController");

const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

//ดึงข้อมูลผู้สมัครทั้งหมด
router.get("/", protect, isAdmin, getEmployees);

//อัปเดตสถานะของผู้สมัคร
router.patch("/:id/status",protect,isAdmin, updateEmployeeStatus);

module.exports = router;
