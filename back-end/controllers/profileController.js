const Employee = require("../models/employeeModel");

// GET /api/profile/me
const getProfile = async (req, res) => {
  try {
    // สมมติ Auth Middleware ใส่ req.user.id
    const employee = await Employee.findById(req.user.id).select("-password");
    // .select("-password") เพื่อตัด password ทิ้ง ไม่ส่งกลับ

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
    // สมมติในฟอร์มส่งมา { personalInfo: { firstName, lastName, phone, email }, ... }
    // หรืออาจจะส่งแบบแยก field
    const updateData = req.body;

    // updateData อาจจะต้องกรองเฉพาะฟิลด์ที่ให้แก้ เช่น personalInfo
    // ขึ้นกับโครงสร้าง DB
    // ตัวอย่างสมมติ:
    // updateData = {
    //   personalInfo: { firstName: "John", lastName: "Doe", phone: "099xxx", email: "john@mail.com" }
    //   addressInfo: { currentAddress: "Bangkok", ...}
    // }

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