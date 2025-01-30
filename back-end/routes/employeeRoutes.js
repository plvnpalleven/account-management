const express = require("express");
const router = express.Router();
const Employee = require("../models/employeeModel"); //Import Schema

//Endpoint สำหรับ register พนักงานใหม่
router.post("/check-username",async(req,res)=>{
  const {username} = req.body;
  try{
    const existingUser = await Employee.findOne({"AccountInfo.username":username});
    res.json({exists: !!existingUser}); //ถ้ามี user คืน exists:true
  }catch(error){
    res.status(500).json({message:"Error checking username"});
  }
});

router.post("/check-email",async(req,res)=>{
  const {email} = req.body;
  try{
    const existingEmail = await Employee.findOne({"personalInfo.email":email});
    res.json({exists: !!existingEmail});
  }catch(error){
    res.status(500).json({message:"Error checking email"});
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