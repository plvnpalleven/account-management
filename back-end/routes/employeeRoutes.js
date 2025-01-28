const express = require("express");
const router = express.Router();
const Employee = require("../models/employeeModel"); //Import Schema

//Endpoint สำหรับ register พนักงานใหม่
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find(); // ดึงข้อมูลทั้งหมดจาก MongoDB
    res.status(200).json(employees); // ส่งข้อมูลกลับ
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { accountInfo, personalInfo } = req.body;

    //ตรวจ username ที่ซ้ำ
    const existingUsername = await Employee.findOne({
      "accountInfo.username": accountInfo.username,
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    //ตรวจสอบ email ซ้ำ
    const existingEmail = await Employee.findOne({
      "personalInfo.email": personalInfo.email,
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //บันทึกข้อมูล
    const employee = new Employee(req.body); //รับข้อมูลจาก front end
    const savedEmployee = await employee.save(); // บันทึกลง mongoDB

    res
      .status(201)
      .json({ message: "Registration successful", data: savedEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }

  //   res.status(201).json(savedEmployee); //ส่งข้อมูลกลับไป
  // } catch (error) {
  //   res.status(400).json({ message: error.message }); //ส่ง error กลับถ้ามีปัญหา
  // }
});

module.exports = router;
