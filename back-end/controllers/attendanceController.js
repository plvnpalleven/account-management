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
  const { userId, checkOutTime } = req.body;

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
  const { userId, requestedHours } = req.body;

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

    await attendanceRecord.save();

    res.status(200).json({
      message: " OT request submitted successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.startOT = async (req, res) => {
  const { userId, startTime } = req.body;

  try {
    //ตั้งเวลาเป็นเที่ยงคืนวันนี้(จะได้ตรงกับdb ไม่งั้นหาไม่เจอ)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //หา Attendance ของวันนี้
    const attendanceRecord = await Attendance.findOne({ userId, date: today });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No Attendance record for today." });
    }

    // เช็คว่าได้ขอ OT และผ่านการอนุมัติ (สมมุติว่า approved = true หรือไม่?)
    // แต่กรณีนี้เรายังไม่ได้ทำ API อนุมัติ OT จริงจัง เลยข้ามไปก่อน ไว้ทำส่วน admin เสร็จแล้วจะกลับมาใหม่
    // ถ้ามีระบบจริงควรเช็ค: if(!attendance Record.overtime.isApproved)...

    // ตรวจสอบว่ามีการระบุ otStart ไปแล้วหรือไม่ (กันซ้ำ)
    if (attendanceRecord.overtime.otStart) {
      return res.status(400).json({ message: "OT has already started." });
    }

    //อัปเดต otStart
    attendanceRecord.overtime.otStart = startTime; //เช่น 18:00
    await attendanceRecord.save();

    return res.status(200).json({
      message: "OT started successfully.",
      attendanceRecord,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.endOT = async (req, res) => {
  const { userId, endTime } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //หา attendance ของวันนี้
    const attendanceRecord = await Attendance.findOne({ userId, date: today });
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record for today." });
    }

    //เช็คว่าเคย start OT ไปแล้วไหม
    if (!attendanceRecord.overtime.otStart) {
      return res.status(400).json({ message: "You haven't started OT yet." });
    }

    //ถ้า otEnd เคยถูกเช็คแล้ว แปลว่าจบ OT ไปแล้ว
    if (attendanceRecord.overtime.otEnd) {
      return res.status(400).json({ message: "OT has already ended." });
    }

    // update otEnd
    attendanceRecord.overtime.otEnd = endTime;

    //คำนวณ totalOTHours

    const totalHours = calculateOTHours(
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

exports.updateOTHours = async (req, res) => {
  const { userId, additionalHours } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOne({ userId, date: today });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today." });
    }

    if (!attendanceRecord.overtime.isRequested) {
      return res.status(404).json({ message: "You haven't request OT today." });
    }

    //อัปเดตชั่วโมง OT ที่ขอเพิ่มเติม
    attendanceRecord.overtime.requestedHours += additionalHours;

    await attendanceRecord.save();

    res.status(200).json({
      message: "OT hours updated successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0); //ตั้งเวลาเป็น 00:00:00 ของวันนี้ ไม่งั้นจะหาไม่เจอ

    const attendanceRecord = await Attendance.findOne({
      userId: new mongoose.Types.ObjectId(userId),
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
