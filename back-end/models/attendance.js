const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, require: true },
    checkIn: { type: String, require: true }, //"HH:MM"
    checkOut: { type: String, require: false }, //อาจยังไม่มีในตอนแรก
    status: {
      type: String,
      enum: ["on time", "late", "leave", "absent"],
      require: true,
    },
    overtime: {
      isRequested: { type: Boolean, default: false },
      requestedHours: { type: Number, default: 0 },
      isApproved: { type: Boolean, default: false },
      otStart: { type: String, default: null }, //'HH:MM'
      otEnd: { type: String, default: null }, //'HH:MM'
      totalOTHours: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance',attendanceSchema);