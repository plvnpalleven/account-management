const Employee = require("../models/employeeModel");

//ดึงข้อมูลผู้สมัครทั้งหมด
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); //ดึงข้อมูลจาก mongoDB
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

//อัปเดตสถานะผู้สมัคร
const updateEmployeeStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { applicationStatus: newStatus },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee status", error });
  }
};

module.exports = { getEmployees, updateEmployeeStatus };
