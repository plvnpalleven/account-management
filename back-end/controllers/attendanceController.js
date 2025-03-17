const Attendance = require("../models/attendance");
const { calculateOTHours } = require("../utils/timeUtils");
const mongoose = require("mongoose");

exports.checkIn = async (req, res) => {
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
    const checkInTime = new Date();
    //ตรวจสอบว่าสายหรือไม่
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

    const attendanceRecord = await Attendance.findOne({ userId, date: today });
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
    if(newPlanned <0){
      return res.status(400).json({message:"Cannot set planned hours below 0."});
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
    let today = new Date();
    today.setHours(0, 0, 0, 0);



    let attendanceRecord = await Attendance.findOne({ userId, date: today });
    if (!attendanceRecord) {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1);//ลบ 1 วัน
      yesterday.seyHours(0,0,0,0);

      attendanceRecord = await Attendance.findOne({
        userId,
        date:yesterday,
      });
    }
    //ถ้ายังไม่เจออีกที ค่อยให้เป็น error
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today or yesterday." });
    }

    // ข้างล่างค่อยตรวจสอบว่า OT ยัง active ไหม หรือเคย start แล้วหรือยัง
    if (!attendanceRecord.overtime.otStart) {
      return res.status(400).json({ message: "You haven't started OT yet." });
    }
    if (attendanceRecord.overtime.status !== "active") {
      return res.status(400).json({ message: "OT has already ended." });
    }

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
    }).populate("userId","personalInfo.firstName personalInfo.lastName")
    
    ;

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
