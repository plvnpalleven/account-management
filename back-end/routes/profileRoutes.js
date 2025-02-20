const express = require("express");
const {getProfile,updatedProfile} = require("../controllers/profileController");
const {protect} = require("../middleware/authMiddleware");

const router =  express.Router();

//GET /api/profile/me -> ดึงข้อมูล user ปัจจุบัน
router.get("/me",protect,getProfile);

//PATCH /api/profile/me -> แก้ไขข้อมูล user ปัจจุบัน
router.patch("/me",protect,updatedProfile);

module.exports = router;