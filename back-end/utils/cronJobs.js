const cron = require("node-cron");
const Attendance = require("../models/attendance");
const Employee = require("../models/employeeModel");

//กำหนดเวลา ที่ 23:59 ทุกวัน (รูปแบบ cron: '59 23 * * *')
cron.schedule("06 14 * * *", async () => {
  console.log("Cron job started: ตรวจสอบ attendance ที่ยังไม่ได้ check in");

  //กำหนดวันที่เป็น 00:00 เพื่อให้เปรียบเทียบได้ง่าย
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    //ดึงพนักงานทั้งหมดที่ต้องมีการเช็คอิน (สามารถปรับให้กรองเฉพาะคนที่มี work schedule วันนั้นได้)
    const employees = await Employee.find();

    for (const employee of employees) {
        //ตรวจสอบว่าในวันนี้มี record หรือยัง
      const record = await Attendance.findOne({
        userId: employee._id,
        date: today,
      });

      //ถ้าไม่มี record แสดงว่าพนักงานไม่ได้ check in ให้สร้าง record พร้อม status "absent"
      if (!record) {
        await Attendance.create({
          userId: employee._id,
          date: today,
          checkIn: "-",
          checkOut: "-",
          status: "absent",
        });
        console.log(`Create absent record for employees ${employee._id}`);
      }
    }
    console.log(`Cron job completed successfully.`);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
