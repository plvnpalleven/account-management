const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const Employee = require("../models/employeeModel");

// เชื่อมต่อ MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/AccountManagementDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  runAbsentCheckForToday(); // เรียกฟังก์ชันทดสอบทันทีหลังเชื่อมต่อสำเร็จ
})
.catch(err => console.error("MongoDB connection error:", err));

async function runAbsentCheckForToday() {
  console.log("Test: Running absent check for today");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const employees = await Employee.find();
    console.log("Found employees:", employees.length);
    for (const employee of employees) {
      const record = await Attendance.findOne({
        userId: employee._id,
        date: today,
      });
      if (!record) {
        await Attendance.create({
          userId: employee._id,
          date: today,
          checkIn: "-",
          checkOut: "-",
          status: "absent",
        });
        console.log(`Created absent record for employee ${employee._id}`);
      } else {
        console.log(`Record already exists for employee ${employee._id}`);
      }
    }
    console.log("Test completed successfully.");
    // ปิดการเชื่อมต่อ DB เมื่อเสร็จ
    mongoose.disconnect();
  } catch (error) {
    console.error("Error during test:", error);
    mongoose.disconnect();
  }
}
