const Attendance = require("../models/attendance");
const { calculateOTHours, calculateTotalHours } = require("../utils/timeUtils");
const mongoose = require("mongoose");

exports.checkIn = async (req, res) => {
  const userId = req.user._id;
  try {
    //กัน check in ก่อน 7.30
    const now = new Date();
    const allowedHour = 7;
    const allowedMinute = 30;
    if (
      now.getHours() < allowedHour ||
      (now.getHours() === allowedHour && now.getMinutes() < allowedMinute)
    ) {
      return res
        .status(400)
        .json({ message: "Check-in not allowed before 07:30 AM." });
    }

    //ตั้งเวลาเป็น 00:00:00 ของวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //ตรวจสอบว่าเคย Check-in ไปแล้วรึยัง
    const existingRecord = await Attendance.findOne({ userId, date: today });

    // if (existingRecord) {
    //   return res
    //     .status(400)
    //     .json({ message: "You have already checked in today." });
    // }

    if (existingRecord) {
      if (existingRecord.status === "leave") {
        return res
          .status(400)
          .json({ message: "You have already taken leave for today. Check-in is not allowed." });
      }
      if (existingRecord.status === "holiday") {
        return res
          .status(400)
          .json({ message: "Today is a holiday. No check-in is required." });
      }
      return res
        .status(400)
        .json({ message: "You have already checked in today." });
    }

    const checkInTime = new Date();
    // const status = checkInTime <= "09:20" ? "on time" : "late";
    const status =
      checkInTime.getHours() < 9 ||
      (checkInTime.getHours() === 9 && checkInTime.getMinutes() <= 20)
        ? "on time"
        : "late";

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
    const checkOutTime = new Date();
    // อัปเดต Check-out Time
    attendanceRecord.checkOut = checkOutTime;
    attendanceRecord.totalHours = calculateTotalHours(
      attendanceRecord.checkIn,
      checkOutTime
    );
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
    // none , request ?
    if (attendanceRecord.overtime.status !== "none") {
      return res
        .status(400)
        .json({ message: "You have already requested for OT today." });
    }

    //อัปเดตข้อมูลการขอ OT
    attendanceRecord.overtime.status = "requested";
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

    let attendanceRecord = await Attendance.findOne({ userId, date: today });
    // ถ้าไม่เจอ ให้ไปหา record ที่ OT ยังเป็น Active อยู่

    if (!attendanceRecord) {
      attendanceRecord = await Attendance.findOne({
        userId,
        "overtime.status": "active",
      });
    }

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record for today." });
    }
    // ต้องมีการขอ OT ก่อน
    if (
      attendanceRecord.overtime.status !== "requested" &&
      attendanceRecord.overtime.status !== "approved" &&
      attendanceRecord.overtime.status !== "active"
    ) {
      return res
        .status(400)
        .json({ message: "You have not requested OT today." });
    }
    // ถ้าจะกันไม่ให้ลดเมื่อ OT active:
    if (attendanceRecord.overtime.status === "active" && hours < 0) {
      return res
        .status(400)
        .json({ message: "Cannot reduce hours while OT is active." });
    }
    const newPlanned = attendanceRecord.overtime.plannedHours + hours;
    if (newPlanned < 0) {
      return res
        .status(400)
        .json({ message: "Cannot set planned hours below 0." });
    }
    attendanceRecord.overtime.plannedHours = newPlanned;
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
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOne({ userId, date: today });
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No Attendance record for today." });
    }

    if (attendanceRecord.overtime.status !== "approved") {
      return res
        .status(400)
        .json({ message: "OT not approved, cannot start yet." });
    }

    //มีปัญหาที่บรรทัดนี้
    // if (attendanceRecord.overtime.otStart) {
    //   return res.status(400).json({ message: "OT has already started." });
    // }

    attendanceRecord.overtime.status = "active";
    attendanceRecord.overtime.otStart = new Date();
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
    const attendanceRecord = await Attendance.findOne({
      userId,
      "overtime.status": "active",
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        message: "No active OT record found for this user.",
      });
    }
    //เช็คว่ามีการเริ่ม OT ไปแล้วหรือยัง
    if (!attendanceRecord.overtime.otStart) {
      return res.status(404).json({ message: "You haven't started OT yet." });
    }

    //อัปเดตเวลา OT End และ คำนวณ total OT hours พร้อมเปลี่ยนสถานะเป็น finished
    attendanceRecord.overtime.otEnd = new Date();
    attendanceRecord.overtime.status = "finished";

    const totalHours = calculateOTHours(
      attendanceRecord.overtime.otStart,
      attendanceRecord.overtime.otEnd
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
    }).populate("userId", "personalInfo.firstName personalInfo.lastName");

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

//  *edge case* let say 23:00 -> 01:00
exports.getCurrentAttendance = async (req, res) => {
  const userId = req.user._id;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // หา record วันนี้
    const attendanceToday = await Attendance.findOne({ userId, date: today });

    // หา record ที่ OT ยัง active อยู่ (ไม่จำกัดวันที่)
    const activeOTRecord = await Attendance.findOne({
      userId,
      "overtime.status": "active",
    });

    res.status(200).json({
      attendanceToday,
      activeOTRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
