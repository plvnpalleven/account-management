const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["sick", "personal", "vacation","holidays", "other"],
      required: true,
    },
    startDate: { type: Date, require: true },
    endDate: { type: Date, require: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "cancelled"],
      default:"requested",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveRequest", leaveSchema);
