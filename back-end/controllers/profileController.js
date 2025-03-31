const Employee = require("../models/employeeModel");

// GET /api/profile/me
const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fecting profile:", error);
    res.status(500).json({ message: "Error fetchin profile", error });
  }
};

// PATCH /api/profile/me
const updatedProfile = async (req, res) => {
  try {
    const updateData = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

module.exports = { getProfile, updatedProfile };