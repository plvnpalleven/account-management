const Attendance = require("../models/attendance");
const mongoose = require("mongoose");


exports.getAllOTRequests = async (req, res) => {
  try {
    const requests = await Attendance.find({
      "overtime.status": "requested",
    }).populate("userId", "personalInfo.firstName personalInfo.lastName documents.profilePicture.secure_url");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching OT requests" });
  }
};
  
exports.approveOT = async (req, res) => {
  try {
    await Attendance.findByIdAndUpdate(req.params.requestId, {
      "overtime.status": "approved",
    });
    res.status(200).json({ message: "OT approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving OT" });
  }
};

exports.declineOT = async (req, res) => {
  try {
    await Attendance.findByIdAndUpdate(req.params.requestId, {
      "overtime.status": "declined",
    });
    res.status(200).json({ message: "OT declined" });
  } catch (error) {
    res.status(500).json({ message: "Error declining OT" });
  }
};
