const Attendance = require("../models/attendance");
const { calculateOTHours } = require("../utils/timeUtils");
const mongoose = require("mongoose");

exports.checkIn = async (req, res) => {
  const { checkInTime } = req.body;
  const userId = req.user._id;
  try {
    //ตั้งเวลาเป็น 00:00:00 ของวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //ตรวจสอบว่าเคย Check-in ไปหรือยังวันนี้
    const existingRecord = await Attendance.findOne({ userId, date: today });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "You have already checked in today." });
    }

    //ตรวจสอบว่าสายหรือไม่
    const status = checkInTime <= "09:20" ? "on time" : "late";

    //สร้าง Attendance ใหม่
    const attendanceRecord = await Attendance.create({
      userId,
      date: today,
      checkIn: checkInTime,
      status,
    });

    res.status(200).json(attendanceRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  const userId = req.user._id;
  const { checkOutTime } = req.body;
  try {
    // หาวันนี้ (ตั้งเวลาเป็นเที่ยงคืน 00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // หา Attendance ของวันนี้ว่ามีหรือยัง
    const attendanceRecord = await Attendance.findOne({ userId, date: today });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "You haven't checked in today yet." });
    }

    // อัปเดต Check-out Time
    attendanceRecord.checkOut = checkOutTime;

    await attendanceRecord.save();

    res.status(200).json(attendanceRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestOT = async (req, res) => {
  const userId = req.user._id;
  const { requestedHours } = req.body;
  try {
    //ตั้งเวลาเป็นเที่ยงคืนของวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //หาข้อมูล Attendance ของวันนี้
    const attendanceRecord = await Attendance.findOne({ userId, date: today });

    if (!attendanceRecord) {
      return res.status(404).json({
        message: "You haven't clocked in today, so you can't do OT yet.",
      });
    }

    //ตรวจสอบว่ามีการขอ OT ไปแล้วหรือยัง
    if (attendanceRecord.overtime.isRequested) {
      return res
        .status(400)
        .json({ message: "You have already requested for OT today." });
    }

    //อัปเดตข้อมูลการขอ OT
    attendanceRecord.overtime.isRequested = true;
    attendanceRecord.overtime.requestedHours = requestedHours;
    attendanceRecord.overtime.plannedHours = requestedHours; // ตั้งค่าเท่ากันครั้งแรก

    await attendanceRecord.save();

    res.status(200).json({
      message: " OT request submitted successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adjustPlannedHours = async (req, res) => {
  try {
    const userId = req.user._id;
    const { hours } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOne({ userId, date: today });
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record for today." });
    }

    // ต้องมีการขอ OT ก่อน
    if (!attendanceRecord.overtime.isRequested) {
      return res
        .status(400)
        .json({ message: "You have not requested OT today." });
    }

    // ถ้าจะกันไม่ให้ลดเมื่อ OT active:
    if (attendanceRecord.overtime.isOTActive && hours < 0) {
      return res
        .status(400)
        .json({ message: "Cannot reduce hours while OT is active." });
    }

    attendanceRecord.overtime.plannedHours += hours;

    await attendanceRecord.save();

    return res.status(200).json({
      message: "Planned hours updated successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.startOT = async (req, res) => {
  try {
    const { startTime } = req.body;
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOne({ userId, date: today });
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No Attendance record for today." });
    }

    if (!attendanceRecord.overtime.isApproved) {
      return res
        .status(400)
        .json({ message: "OT not approved, cannot start yet." });
    }

    if (attendanceRecord.overtime.otStart) {
      return res.status(400).json({ message: "OT has already started." });
    }

    attendanceRecord.overtime.isOTActive = true;
    attendanceRecord.overtime.otStart = startTime;
    await attendanceRecord.save();

    return res.status(200).json({
      message: "OT started successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.endOT = async (req, res) => {
  try {
    const userId = req.user._id;
    const { endTime } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOne({ userId, date: today });
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record for today." });
    }
    if (!attendanceRecord.overtime.otStart) {
      return res.status(400).json({ message: "You haven't started OT yet." });
    }
    if (attendanceRecord.overtime.otEnd) {
      return res.status(400).json({ message: "OT has already ended." });
    }

    attendanceRecord.overtime.otEnd = endTime;
    attendanceRecord.overtime.isOTActive = false;

    const totalHours = calculateOTHour(
      attendanceRecord.overtime.otStart,
      endTime
    );
    attendanceRecord.overtime.totalOTHours = totalHours;

    await attendanceRecord.save();

    return res.status(200).json({
      message: "OT ended successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); //ตั้งเวลาเป็น 00:00:00 ของวันนี้ ไม่งั้นจะหาไม่เจอ

    const attendanceRecord = await Attendance.findOne({
      userId,
      date: today,
    });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today." });
    }

    res.status(200).json(attendanceRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
