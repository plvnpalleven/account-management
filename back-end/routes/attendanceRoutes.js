const express = require('express');
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.post('/check-in',attendanceController.checkIn);
router.post('/check-out',attendanceController.checkOut);
router.post('/request-ot',attendanceController.requestOT);
router.post('/start-ot',attendanceController.startOT);
router.post('/end-ot',attendanceController.endOT);
router.patch('/update-ot',attendanceController.updateOTHours);
router.get('/:userId/today',attendanceController.getTodayAttendance);

module.exports = router;