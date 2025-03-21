const LeaveRequest = require("../models/leaveRequest");
const Attendance = require("../models/attendance");
const mongoose = require("mongoose");

exports.requestLeave = async (req, res) => {
  try {
    const userId = req.user._id;

    const { leaveType, startDate, endDate, reason } = req.body;

    const newLeave = await LeaveRequest.create({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(200).json({
      message: "Leave request created successfully",
      newLeave,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Approve Leave
exports.approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    //หา leave request ที่ต้องการอนุมัติ
    const leaveRequest = await LeaveRequest.findById(leaveId);

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return res.status(400).json({ message: "Invalid leaveId" });
    }

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    //update status เป็น approved
    leaveRequest.status = "approved";
    await leaveRequest.save();

    //สร้าง attendance ล่วงหน้าสำหรับทุกวันในช่วง startDate - endDate
    const currentDate = new Date(leaveRequest.startDate);
    const endDate = new Date(leaveRequest.endDate);

    //วน loop จาก start -> end
    while (currentDate <= endDate) {
      //set 00:00:00 จะได้ compare ได้ถูกต้องเป๊ะๆ
      const loopDate = new Date(currentDate);
      loopDate.setHours(0, 0, 0, 0);

      //เช็คก่อนว่ามี attendance วันนี้อยู่แล้วหรือยัง

      const existingRecord = await Attendance.findOne({
        userId: leaveRequest.userId,
        date: loopDate,
      });

      //ถ้ายังไม่มี -> สร้างใหม่
      if (!existingRecord) {
        await Attendance.create({
          userId: leaveRequest.userId,
          date: loopDate,
          checkIn: null,
          checkOut: null,
          totalHours: 0,
          status: "leave",
          overtime: {
            status: "none",
            requestedHours: 0,
            plannedHours: 0,
            otStart: null,
            otEnd: null,
            totalOTHours: 0,
          },
        });
      } else {
        if (existingRecord.status !== "leave") {
          existingRecord.status = "leave";
          existingRecord.checkIn = null;
          existingRecord.checkOut = null;
          existingRecord.totalHours = 0;
          await existingRecord.save();
        }
      }
      //เลื่อนไปวันถัดไป
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.status(200).json({
      message: "Leave approved successfully.",
      leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const leaveRequest = await LeaveRequest.findById(leaveId);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leaveRequest.status = "rejected";
    await leaveRequest.save();

    return res.status(200).json({
      message: "Leave rejected successfully.",
      leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// (optional) 4) ฟังก์ชัน get Leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user._id;
    const leaves = await LeaveRequest.find({ userId });
    return res.status(200).json(leaves);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    // ถ้าต้องการดึง user details ด้วย ก็ใช้ .populate() ได้
    // เช่น populate('userId', 'username email')
    const allLeaves = await LeaveRequest.find().populate(
      "userId",
      "personalInfo.firstName personalInfo.lastName"
    );

    return res.status(200).json(allLeaves);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
