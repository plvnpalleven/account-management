// SummaryTab.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "../../../../back-end/axios";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";

const SummaryTab = () => {
  const { user } = useContext(AuthContext);

  //state สำหรับดึงข้อมูลจาก Backend
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    totalDaysAttended: 0,
    totalWorkHours: 0,
    totalOTHours: 0,
    lateCount: 0,
    absentCount: 0,
    leaveCount: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  ถ้าจะทำให้เลือกปีได้ ก็มาเปลี่ยนตรงนี้
  const selectedYear = new Date().getFullYear();

  const fetchSummary = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.get("/attendance/summary", {
        params: {
          userId: user._id,
          month: selectedMonth,
          year: selectedYear,
        },
      });
      //res.data => { attendanceRecords, summary }
      setAttendanceData(res.data.attendanceRecords);
      setSummary(res.data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user, selectedMonth, selectedYear]);

  // ฟังก์ชันเปลี่ยนเดือน
  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  // ฟังก์ชันเปลี่ยนปี
  // const handleYearChange = (e) => {
  //   setSelectedYear(Number(e.target.value));
  // };

  return (
    <div>
      <div className="flex flex-row justify-between">
      <h2 className="text-3xl font-bold mb-5 text-jpSystemGreen">
        Summary of{" "}
        {new Date(selectedYear, selectedMonth - 1).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border rounded text-xl border-transparent"
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
      </div>
      </div>
      {/* Summary section */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Total Days Attended
          </div>
          <div className="text-lg font-semibold">
            {summary.totalDaysAttended} Days (
            {summary.totalWorkHours.toFixed(1)} Hours)
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Overtime Hours
          </div>
          <div className="text-lg font-semibold">
            {summary.totalOTHours.toFixed(1)} Hours
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">Late Count</div>
          <div className="text-lg font-semibold">{summary.lateCount}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Absent Count
          </div>
          <div className="text-lg font-semibold">{summary.absentCount}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="text-xl font-bold text-jpSystemGreen">
            Leave Count
          </div>
          <div className="text-lg font-semibold">{summary.leaveCount}</div>
        </div>
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-3xl font-bold text-jpSystemGreen mt-3">History</h2>
        {/* Attendance card container */}
        <div className="mt-10 h-[45vh] overflow-y-auto custom-scrollbar px-4">
          <div className="grid grid-cols-3 gap-4">
            {/* {attendanceData.map((record, index) => ( */}
            {[...attendanceData]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((record, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                >
                  <div className="text-lg font-semibold">
                    {formatDate({ $date: record.date })}
                  </div>
                  <div className="text-sm text-gray-">
                    Check-in{" "}
                    {record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Check-out{" "}
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </div>
                  <div
                    className={`text-sm font-bold mt-2 ${
                      record.status === "on time"
                        ? "text-green-600"
                        : record.status === "late"
                        ? "text-yellow-600"
                        : record.status === "leave" ||
                          record.status === "absent"
                        ? "text-red-600"
                        : "text-blue-600"
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
