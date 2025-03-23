const mongoose = require("mongoose");
const moment = require("moment");
const Attendance = require("../models/attendance"); // สมมุติว่าไฟล์ Attendance.js อยู่ในที่เดียวกัน

async function generateMonthlyAttendance(employeeId, year, month) {
  // เชื่อมต่อกับ MongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/AccountManagementDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // หาจำนวนวันในเดือนที่กำหนด
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    // สร้าง moment object สำหรับวันนั้น
    const currentDate = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

    // (ตัวอย่าง) ข้ามวันเสาร์-อาทิตย์ หากต้องการ
    if (currentDate.day() === 0 || currentDate.day() === 6) {
      continue;
    }

    // จำลองเวลา checkIn: ตั้งแต่ 8:45 ถึง 9:30
    const randomMinutesForCheckIn = Math.floor(Math.random() * 46); // 0-45 นาที
    const checkIn = currentDate.clone().hour(8).minute(45).add(randomMinutesForCheckIn, "minutes");

    // จำลองเวลา checkOut: ตั้งแต่ 17:00 ถึง 17:30
    const randomMinutesForCheckOut = Math.floor(Math.random() * 31); // 0-30 นาที
    const checkOut = currentDate.clone().hour(17).minute(0).add(randomMinutesForCheckOut, "minutes");

    // กำหนดเงื่อนไขเวลาเข้างาน (ถ้า checkIn หลัง 9:20 ให้เป็น late)
    const lateThreshold = currentDate.clone().hour(9).minute(20);
    const status = checkIn.isAfter(lateThreshold) ? "late" : "on time";

    // คำนวณชั่วโมงทำงาน
    const totalHours = moment.duration(checkOut.diff(checkIn)).asHours();

    // สุ่มข้อมูล OT ด้วยโอกาส 30%
    let overtime;
    if (Math.random() < 0.3) {
      // กำหนดค่า OT แบบสุ่ม
      const otStatusOptions = ["requested", "approved", "declined", "active", "finished"];
      const otStatus = otStatusOptions[Math.floor(Math.random() * otStatusOptions.length)];
      // OT เริ่มต้นหลัง checkOut 5-15 นาที
      const otStart = checkOut.clone().add(Math.floor(Math.random() * 11) + 5, "minutes");
      // สุ่มจำนวนชั่วโมง OT ที่วางแผนไว้ 0.5 ถึง 2 ชั่วโมง
      const plannedHours = Number((Math.random() * 1.5 + 0.5).toFixed(2));
      const otEnd = otStart.clone().add(plannedHours * 60, "minutes");
      const requestedHours = plannedHours;
      const totalOTHours = plannedHours;
      overtime = {
        status: otStatus,
        requestedHours,
        plannedHours,
        otStart: otStart.toDate(),
        otEnd: otEnd.toDate(),
        totalOTHours,
      };
    } else {
      overtime = {
        status: "none",
        requestedHours: 0,
        plannedHours: 0,
        otStart: null,
        otEnd: null,
        totalOTHours: 0,
      };
    }

    // สร้าง document สำหรับ Attendance ตาม schema
    const attendanceRecord = new Attendance({
      userId: employeeId,
      date: currentDate.toDate(),
      checkIn: checkIn.toDate(),
      checkOut: checkOut.toDate(),
      totalHours: Number(totalHours.toFixed(2)),
      status: status,
      overtime: overtime,
    });

    try {
      await attendanceRecord.save();
      console.log(`บันทึกข้อมูลสำหรับวันที่ ${currentDate.format("YYYY-MM-DD")}`);
    } catch (error) {
      console.error(`Error saving record for ${currentDate.format("YYYY-MM-DD")}:`, error);
    }
  }

  mongoose.connection.close();
}

// เรียกใช้งานฟังก์ชันด้วย employeeId, ปี และเดือนที่ต้องการ
generateMonthlyAttendance("67a9a0468d42fa544d3ab54c", 2025, "03");
