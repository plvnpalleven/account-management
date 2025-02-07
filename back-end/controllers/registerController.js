const Employee = require("../models/employeeModel");

const checkUsernameExists = async (req, res) => {
  const { username } = req.body;
  try {
    const existingUser = await Employee.findOne({
      "accountInfo.username": username,
    });
    if (existingUser) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Error checking username" });
  }
};

const checkEmailExists = async (req, res) => {
  const { email } = req.body; // รับ email จาก body
  try {
    const existingUser = await Employee.findOne({
      "personalInfo.email": email,
    });
    // ถ้ามี existingUser แปลว่ามี email ใน DB แล้ว
    if (existingUser) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Error checking email" });
  }
};

const registerEmployee = async (req, res) => {
  const { accountInfo, personalInfo } = req.body;
  try {
    const existingUser = await Employee.findOne({
      $or: [
        { "accountInfo.username": accountInfo.username },
        { "personalInfo.email": personalInfo.email },
      ],
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.accountInfo.username === accountInfo.username
            ? "Username already exists"
            : "Email already exists",
      });
    }
    //บันทึกข้อมูลลง MongoDB
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();

    res
      .status(201)
      .json({ message: "Registration successful", data: savedEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

module.exports = { checkUsernameExists, registerEmployee, checkEmailExists };
