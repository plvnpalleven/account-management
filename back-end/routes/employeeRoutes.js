const express = require("express");
const router = express.Router();
const Employee = require("../models/employeeModel"); //Import Schema

//Endpoint สำหรับ register พนักงานใหม่
router.post("/register", async (req, res) => {
  try {
    const employee = new Employee(req.body); //รับข้อมูลจาก front end
    const savedEmployee = await employee.save(); // บันทึกลง mongoDB
    res.status(201).json(savedEmployee); //ส่งข้อมูลกลับไป
  } catch (error) {
    res.status(400).json({ message: error.message }); //ส่ง error กลับถ้ามีปัญหา
  }
});

module.exports = router;
