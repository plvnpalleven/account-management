const cron = require("node-cron");
const Attendance = require("../models/attendance");
const Employee = require("../models/employeeModel");
const {calculateOTHours} = require("../utils/timeUtils");
//กำหนดเวลา ที่ 23:59 ทุกวัน (รูปแบบ cron: '59 23 * * *')
cron.schedule("59 23 * * *", async () => {
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
          checkIn: null,
          checkOut: null,
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

cron.schedule("*/30 * * * *",async ()=>{
  try{
    console.log("Cron Job  (Auto End OT) started...");

    const now = new Date();
    const activeOTs = await Attendance.find({
      "overtime.status":"active",
    });

    for (const record of activeOTs) {
      if (!record.overtime.otStart) continue;

      const startTime = record.overtime.otStart;
      const plannedHours = record.overtime.plannedHours;
      const plannedMs = plannedHours * 60 * 60 * 1000;
      const endTimeShouldBe = new Date(startTime.getTime()+plannedMs);

      //ถ้า ตอนนี้ เกินเวลา endTimeShouldBe แล้ว จะปิด OT ให้อัตโนมัติ
      if(now >= endTimeShouldBe){
        record.overtime.otEnd = endTimeShouldBe;
        record.overtime.status = "finished";
        record.overtime.totalOTHours = calculateOTHours(
          startTime,
          endTimeShouldBe
        );
        await record.save();

        console.log(
          `Auto ended OT for record ${record._id} at ${endTimeShouldBe}`
        );
      }
    }
    console.log("Cron Job (Auto End OT) finished.");
  }catch(error){
    console.error("Error in Cron Job (Auto End OT):",error);
  }
});