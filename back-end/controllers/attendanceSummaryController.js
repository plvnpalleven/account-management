// AttendanceController.js
const Attendance = require("../models/attendance");

exports.getMonthlySummary = async (req, res) => {
  try {
    // สมมติว่ารับ userId, month, year จาก query
    // (อาจรับจาก JWT ก็ได้ ขึ้นอยู่กับระบบ Auth ของคุณ)
    const userId = req.query.userId;
    const month = parseInt(req.query.month); // เช่น 3
    const year = parseInt(req.query.year);   // เช่น 2025

    // สร้างช่วงวันที่ของเดือนนั้น
    // หมายเหตุ: JavaScript Date() นับเดือนตั้งแต่ 0-11
    // ถ้า month = 3 แปลว่าเมษายน => ต้อง -1
    // แต่บางท่านอาจเลือกใช้อีกวิธี
    const startDate = new Date(year, month - 1, 1);  
    // สิ้นเดือน: ใส่ day=0 จะย้อนมาเป็นวันสุดท้ายของเดือนก่อนหน้า
    // หรือจะทำแบบง่ายคือ new Date(year, month, 0)
    const endDate = new Date(year, month, 0, 23, 59, 59); 

    // ดึงเอกสารที่อยู่ในช่วง [startDate, endDate]
    // ของ userId ที่ระบุ
    const attendanceRecords = await Attendance.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean(); // .lean() จะให้เป็น plain object, เข้าถึงง่าย

    // เตรียมตัวแปรสำหรับสรุป
    let totalWorkHours = 0;    // รวมชั่วโมงทำงาน
    let totalOTHours = 0;      // รวม OT
    let lateCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let totalDaysAttended = 0; // นับว่า “มา” กี่วัน

    // วนลูป Attendance เพื่อนับ/รวมค่า
    attendanceRecords.forEach((record) => {
      totalWorkHours += record.totalHours;

      // เช็คสถานะ
      switch (record.status) {
        case "late":
          lateCount++;
          break;
        case "absent":
          absentCount++;
          break;
        case "leave":
          leaveCount++;
          break;
        default:
          break;
      }

      // ถ้ามี checkIn ถือว่าวันนี้มีการมาทำงาน (อาจกำหนด logic ตามธุรกิจ)
      if (record.checkIn) {
        totalDaysAttended++;
      }

      // รวม OT
      // ถ้า record.overtime.totalOTHours มีค่าก็รวมเข้าไป
      if (record.overtime && record.overtime.totalOTHours) {
        totalOTHours += record.overtime.totalOTHours;
      }
    });

    // ส่งกลับไปฝั่ง Frontend
    res.json({
      attendanceRecords,
      summary: {
        totalDaysAttended,
        totalWorkHours,
        totalOTHours,
        lateCount,
        absentCount,
        leaveCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
