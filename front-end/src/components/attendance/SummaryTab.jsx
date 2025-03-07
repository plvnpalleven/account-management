// SummaryTab.jsx
import React from "react";

// Mock Data สำหรับ Attendance (ใช้สำหรับแสดงสถิติ)
const mockAttendanceData = [
  {
    date: "March 08, 2023",
    checkIn: "08:53",
    checkOut: "17:15",
    status: "on time",
  },
  {
    date: "March 07, 2023",
    checkIn: "08:27",
    checkOut: "17:09",
    status: "late",
  },
  {
    date: "March 06, 2023",
    checkIn: "-",
    checkOut: "-",
    status: "absent",
  },
];

const SummaryTab = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <p className="mb-4">ภาพรวมสถิติการเข้างานของคุณ</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-sm text-gray-500">Total Days Attended</div>
          <div className="text-xl font-bold">
            {mockAttendanceData.length}
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-sm text-gray-500">Late Count</div>
          <div className="text-xl font-bold">2</div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-sm text-gray-500">Absent Count</div>
          <div className="text-xl font-bold">1</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
