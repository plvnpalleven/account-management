const express = require('express');
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const {protect} = require("../middleware/authMiddleware");

router.post('/check-in',protect,attendanceController.checkIn);
router.post('/check-out',protect,attendanceController.checkOut);
router.post('/request-ot',protect,attendanceController.requestOT);
router.post('/start-ot',protect,attendanceController.startOT);
router.post('/end-ot',protect,attendanceController.endOT);
router.patch('/update-ot',protect,attendanceController.updateOTHours);
router.get('/today',protect,attendanceController.getTodayAttendance);

module.exports = router;