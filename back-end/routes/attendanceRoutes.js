const express = require('express');
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const attendanceSummaryController = require("../controllers/attendanceSummaryController");
const {protect} = require("../middleware/authMiddleware");

router.post('/check-in',protect,attendanceController.checkIn);
router.post('/check-out',protect,attendanceController.checkOut);
router.post('/request-ot',protect,attendanceController.requestOT);
router.post('/start-ot',protect,attendanceController.startOT);
router.post('/end-ot',protect,attendanceController.endOT);
router.patch('/adjust-planned-hours',protect,attendanceController.adjustPlannedHours);
router.get('/today',protect,attendanceController.getTodayAttendance);
router.get('/current', protect, attendanceController.getCurrentAttendance);
router.get("/summary", attendanceSummaryController.getMonthlySummary);
module.exports = router;