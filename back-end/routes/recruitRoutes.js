const express = require("express");
const{
    getEmployees,
    updateEmployeeStatus,
} = require("../controllers/recruitController");

const router = express.Router();

//ดึงข้อมูลผู้สมัครทั้งหมด
router.get("/",getEmployees);

//อัปเดตสถานะของผู้สมัคร
router.patch("/:id/status",updateEmployeeStatus);

module.exports = router;    