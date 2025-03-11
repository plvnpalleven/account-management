// SummaryTab.jsx
import React from "react";
import { formatDate } from "../../utils/formatDate";

// Mock Data สำหรับ Attendance (ใช้สำหรับแสดงสถิติ)
const mockAttendanceData = [
  {
    date: { $date: "2023-03-12T00:00:00Z" },
    checkIn: "08:53",
    checkOut: "17:15",
    status: "on time",
  },
  {
    date: { $date: "2023-03-11T00:00:00Z" },
    checkIn: "08:27",
    checkOut: "17:09",
    status: "late",
  },
  {
    date: { $date: "2023-03-10T00:00:00Z" },
    checkIn: "-",
    checkOut: "-",
    status: "on time",
  },
  {
    date: { $date: "2023-03-09T00:00:00Z" },
    checkIn: "08:53",
    checkOut: "17:15",
    status: "on time",
  },
  {
    date: { $date: "2023-03-08T00:00:00Z" },
    checkIn: "08:27",
    checkOut: "17:09",
    status: "late",
  },
  {
    date: { $date: "2023-03-07T00:00:00Z" },
    checkIn: "-",
    checkOut: "-",
    status: "on time",
  },
  {
    date: { $date: "2023-03-06T00:00:00Z" },
    checkIn: "08:53",
    checkOut: "17:15",
    status: "on time",
  },
  {
    date: { $date: "2023-03-05T00:00:00Z" },
    checkIn: "08:27",
    checkOut: "17:09",
    status: "late",
  },
  {
    date: { $date: "2023-03-04T00:00:00Z" },
    checkIn: "-",
    checkOut: "-",
    status: "on time",
  },
  {
    date: { $date: "2023-03-03T00:00:00Z" },
    checkIn: "08:53",
    checkOut: "17:15",
    status: "on time",
  },
  {
    date: { $date: "2023-03-02T00:00:00Z" },
    checkIn: "08:27",
    checkOut: "17:09",
    status: "late",
  },
  {
    date: { $date: "2023-03-01T00:00:00Z" },
    checkIn: "-",
    checkOut: "-",
    status: "on time",
  },
];

// Mock Data สำหรับเวลา OT และชั่วโมงทำงานทั้งหมดในเดือนนี้
const mockOvertimeHours = 10; // ชั่วโมง OT
const mockTotalWorkHours = 30; // ชั่วโมงทำงานรวมในเดือนนี้
const mockLeaveCount = 3;
const SummaryTab = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-5 text-jpSystemGreen">
        Summary of{" "}
        {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
      </h2>
      {/* Summary section */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Total Days Attended
          </div>
          <div className="text-lg font-semibold">
            {mockAttendanceData.length} Days ({mockTotalWorkHours} Hours)
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Overtime Hours
          </div>
          <div className="text-lg font-semibold">{mockOvertimeHours} Hours</div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">Late Count</div>
          <div className="text-lg font-semibold">2 Times</div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Absent Count
          </div>
          <div className="text-lg font-semibold">1 Times</div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Leave Count
          </div>
          <div className="text-lg font-semibold">{mockLeaveCount}</div>
        </div>
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-3xl font-bold text-jpSystemGreen mt-3">History</h2>

        {/* Attendance card container */}
        <div className="mt-10 max-h-80 overflow-y-auto custom-scrollbar px-4">
          <div className="grid grid-cols-3 gap-4">
            {mockAttendanceData.map((record, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <div className="text-lg font-semibold">
                  {formatDate(record.date)}
                </div>
                <div className="text-sm text-gray-600">
                  Check-in {record.checkIn}
                </div>
                <div className="text-sm text-gray-600">
                  Check-out {record.checkOut}
                </div>
                <div
                  className={`text-sm font-bold mt-2 ${
                    record.status === "on time"
                      ? "text-green-600"
                      : record.status === "late"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {record.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
