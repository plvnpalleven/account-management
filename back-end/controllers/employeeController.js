const Employee = require("../models/employeeModel");

exports.getEmployeeInfo = async (req, res) => {
    try {
      const userId = req.query.userId; // หรือใช้ req.user._id ถ้าผ่าน middleware authentication แล้ว
      const user = await Employee.findById(userId).select("personalInfo.firstName personalInfo.lastName");
      if (!user) {
        return res.status(404).json({ message: "Employee not found." });
      }
      res.status(200).json(user.personalInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };