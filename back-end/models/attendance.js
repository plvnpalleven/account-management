const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    checkIn: {
      type: Date,
      required: function () {
        return this.status !== "absent" && this.status !== "leave";
      },
    },
    checkOut: { type: Date, required: false }, //อาจยังไม่มีในตอนแรก
    totalHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["on time", "late", "leave", "absent"],
      required: true,
    },
    overtime: {
      status: {
        type: String,
        enum: [
          "none",
          "requested",
          "approved",
          "declined",
          "active",
          "finished",
        ],
        default: "none",
      },
      requestedHours: { type: Number, default: 0 },
      plannedHours: { type: Number, default: 0 },
      otStart: { type: Date, default: null }, //'HH:MM'
      otEnd: { type: Date, default: null }, //'HH:MM'
      totalOTHours: { type: Number, default: 0 },
      // isRequested: { type: Boolean, default: false },
      // isApproved: { type: Boolean, default: false },
      // isOTActive:{type:Boolean,default:false},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
