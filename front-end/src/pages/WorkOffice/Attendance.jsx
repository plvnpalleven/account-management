import { useState, useEffect, useContext } from "react";
import axios from "../../../../back-end/axios"; // ถ้าอนาคตจะ fetch API จริง
import { AuthContext } from "../../context/AuthContext";

import TabHeader from "../../components/TabHeader";
import ProfileTab from "../../components/ProfileTab";

// Mock User (แสดงใน Summary)
const mockUser = {
  name: "John Doe",
  role: "Developer",
  phone: "(+62) 812 3456-7890",
  email: "natasiakhaleria@gmail.com"
};

// Mock Data สำหรับ Attendance History
const mockAttendanceData = [
  {
    date: "March 08, 2023",
    checkIn: "08:53",
    checkOut: "17:15",
    status: "on time"
  },
  {
    date: "March 07, 2023",
    checkIn: "08:27",
    checkOut: "17:09",
    status: "late"
  },
  {
    date: "March 06, 2023",
    checkIn: "-",
    checkOut: "-",
    status: "absent"
  },
  {
    date: "March 05, 2023",
    checkIn: "08:55",
    checkOut: "17:10",
    status: "on time"
  },
  {
    date: "March 04, 2023",
    checkIn: "08:58",
    checkOut: "17:06",
    status: "on time"
  },
  {
    date: "March 03, 2023",
    checkIn: "08:40",
    checkOut: "17:02",
    status: "late"
  }
];

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("attendance"); // tab ปัจจุบัน
  const { user, loading } = useContext(AuthContext);

  // ส่วน Summary (Mock)
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [avgCheckInTime, setAvgCheckInTime] = useState("");
  const [avgCheckOutTime, setAvgCheckOutTime] = useState("");
  const [lateCount, setLateCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  // โหลด Mock Data แทนการ fetch จริง
  useEffect(() => {
    // ถ้ามี API จริง ก็ใช้ axios.get(...) แทนได้
    setAttendanceData(mockAttendanceData);

    // คำนวณสถานะเบื้องต้น
    let late = 0;
    let absent = 0;
    let attendance = 0;

    mockAttendanceData.forEach((day) => {
      if (day.status === "late") late++;
      if (day.status === "absent") absent++;
      // ถือว่ามา ถ้า status เป็น on time หรือ late
      if (day.status === "on time" || day.status === "late") {
        attendance++;
      }
    });

    setLateCount(late);
    setAbsentCount(absent);
    setTotalAttendance(attendance);

    // สมมติค่าเฉลี่ยเช็คอิน/เช็คเอาท์
    setAvgCheckInTime("08:46");
    setAvgCheckOutTime("17:04");
  }, [user, loading]);

  // รายการ Tab
  const pageTabs = [
    { label: "Attendance", value: "attendance" },
    { label: "Overtime", value: "overtime" }
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-300 min-h-screen">
      <TabHeader
        pageTabs={pageTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 bg-white p-6 shadow-md max-h-screen overflow-hidden">
        {/* ------------------- Attendance Tab ------------------- */}
        {activeTab === "attendance" && (
          <div className="h-full overflow-y-auto">
            {/* Summary Dashboard */}
            <div className="bg-white rounded shadow p-6 flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mock Profile Photo */}
                <img
                  src="https://via.placeholder.com/80"
                  alt="Profile"
                  className="rounded-full w-20 h-20 object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold">{mockUser.name}</h1>
                  <p className="text-gray-600">{mockUser.role}</p>
                </div>

              </div>
              {/* Grid แสดงตัวเลขสรุป */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded shadow flex flex-col items-center">
                  <p className="text-2xl font-bold">{totalAttendance}</p>
                  <p className="text-gray-600">Total Attendance (This month) </p>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow flex flex-col items-center">
                  <p className="text-2xl font-bold">{avgCheckInTime}</p>
                  <p className="text-gray-600">Total Overtime(This month)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow flex flex-col items-center">
                  <p className="text-2xl font-bold">{avgCheckOutTime}</p>
                  <p className="text-gray-600">Avg Check Out Time</p>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow flex flex-col items-center">
                  <p className="text-2xl font-bold">Late: {lateCount}</p>
                  <p className="text-gray-600">Absent: {absentCount}</p>
                </div>
              </div>
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg font-bold mb-4">Attendance History</h2>
             
              {/* แสดงรายการด้วย Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {attendanceData.map((item, index) => {
                  let statusColor = "bg-green-100 text-green-800";
                  if (item.status === "late") {
                    statusColor = "bg-yellow-100 text-yellow-800";
                  } else if (item.status === "absent") {
                    statusColor = "bg-red-100 text-red-800";
                  }

                  return (
                    <div
                      key={index}
                      className="p-4 border rounded shadow flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{item.date}</p>
                        <span
                          className={`px-2 py-1 rounded text-sm ${statusColor}`}
                        >
                          {/* Capitalize first letter */}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Check In Time:{" "}
                        <span className="font-medium">{item.checkIn}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Check Out Time:{" "}
                        <span className="font-medium">{item.checkOut}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Pagination (ตัวอย่าง Mock) */}
              <div className="flex justify-center mt-4">
                <button className="px-3 py-1 bg-gray-200 rounded-l shadow">
                  1
                </button>
                <button className="px-3 py-1 bg-gray-200 border-l">2</button>
                <button className="px-3 py-1 bg-gray-200 border-l">3</button>
                <button className="px-3 py-1 bg-gray-200 border-l rounded-r">
                  ...
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------- Overtime Tab ------------------- */}
        {activeTab === "overtime" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Overtime</h2>
            <p>นี่คือ Tab Overtime นะจ๊ะ!</p>
          </div>
        )}

        {/* ------------------- Profile Tab ------------------- */}
        {activeTab === "profile" && <ProfileTab user={user} />}
      </div>
    </div>
  );
};

export default Attendance;
