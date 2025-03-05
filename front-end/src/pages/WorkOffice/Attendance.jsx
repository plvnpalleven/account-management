import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TabHeader from "../../components/TabHeader";

// สมมติถ้าอยากโชว์ชื่อ User
const mockUser = {
  firstName: "John",
  lastName: "Doe",
};

// ฟังก์ชันไว้สร้างข้อความวันที่วันนี้
const getTodayString = () => {
  const now = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  return now.toLocaleDateString("en-GB", options);
};

// Mock Data สำหรับ Attendance
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

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("attendance"); // Tab ปัจจุบัน
  const { user, loading } = useContext(AuthContext);

  // จัดเก็บเวลาปัจจุบัน (โชว์บนจอแบบเรียลไทม์)
  const [currentTime, setCurrentTime] = useState("");

  // Mock State สำหรับ Check-in / Check-out
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // OT (mock)
  const [isOTRequested, setIsOTRequested] = useState(false);

  // อัปเดตเวลาปัจจุบันทุก 1 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ฟังก์ชัน Check-in
  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCheckInTime(now);
    setIsCheckedIn(true);
  };

  // ฟังก์ชัน Check-out
  const handleCheckOut = () => {
    const now = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCheckOutTime(now);
    setIsCheckedIn(false);
  };

  // ฟังก์ชัน Request OT
  const handleRequestOT = () => {
    setIsOTRequested(true);
    alert("OT request submitted! (Mockup)");
  };

  // รายการ Tab
  const pageTabs = [
    { label: "Attendance", value: "attendance" },
    { label: "Summary", value: "summary" },
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-300 min-h-screen">
      {/* Tab Header */}
      <TabHeader
        pageTabs={pageTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area */}
      <div className="flex-1 bg-white p-6 shadow-md max-h-screen overflow-auto">
        {activeTab === "attendance" && (
          <div>
            {/* 1) แสดงชื่อ และ วันที่ */}
            <div className="flex justify-between items-start mb-4">
              <div className="text-left ml-10 mt-5 mb-10">
                <h2 className="text-3xl font-semibold">
                  Hi {mockUser.firstName} {mockUser.lastName} !!
                </h2>
                <p className="text-lg text-gray-600">It's {getTodayString()}</p>
              </div>
            </div>
            {/* 2) ส่วนแสดงเวลาปัจจุบัน (Time remain) */}
            <div className="flex flex-col items-center justify-center mb-5">
              <h3 className="text-4xl text-gray-500 mb-2">Time remain</h3>
              <div className="text-6xl font-bold">{currentTime}</div>
            </div>
            <div className="flex justify-center my-6">
              <hr className="w-4/6 border-gray-300 border-[1.5px]" />
            </div>
            {/* 3) สร้าง "สองคอลัมน์" วางเคียงข้าง: (ซ้าย) Check In/Out, (ขวา) OT */}
            <div className="flex flex-row flex-wrap justify-center items-start gap-8 mb-6">
              {/* --- คอลัมน์ซ้าย: Check In / Check Out --- */}
              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <h3 className="text-gray-700 text-3xl font-bold">
                  Clock In & Out
                </h3>
                <div className="flex gap-4 w-full">
                  {/* Card: Check In */}
                  <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                    <div className="text-sm font-medium">Check In</div>
                    <div className="text-sm mt-1">
                      {checkInTime ? checkInTime : "9:00"}
                    </div>
                  </div>

                  {/* Card: Check Out */}
                  <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                    <div className="text-sm font-medium">Check Out</div>
                    <div className="text-sm mt-1">
                      {checkOutTime ? checkOutTime : "9:00"}
                    </div>
                  </div>
                </div>

                {/* ปุ่ม Check-in / Check-out (เต็มความกว้าง) */}
                <div className="w-full">
                  {!isCheckedIn ? (
                    <button
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                      onClick={handleCheckIn}
                    >
                      Check In
                    </button>
                  ) : (
                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                      onClick={handleCheckOut}
                    >
                      Check Out
                    </button>
                  )}
                </div>
              </div>

              {/* --- คอลัมน์ขวา: OT (Start / End / Request) --- */}
              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
                <div className="flex gap-4 w-full">
                  {/* Card: Start OT */}
                  <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                    <div className="text-sm font-medium">Start</div>
                    <div className="text-sm mt-1">-- : --</div>
                  </div>

                  {/* Card: End OT */}
                  <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                    <div className="text-sm font-medium">End</div>
                    <div className="text-sm mt-1">-- : --</div>
                  </div>
                </div>

                {/* ปุ่ม Request OT (เต็มความกว้าง) */}
                <div className="w-full">
                  <button
                    className={`w-full py-2 rounded-lg ${
                      isOTRequested
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    onClick={handleRequestOT}
                    disabled={isOTRequested}
                  >
                    {isOTRequested ? "OT Requested ✅" : "Request OT"}
                  </button>
                </div>
              </div>
            </div>
            {/* 4) ตารางประวัติ Attendance หรือส่วนอื่น ๆ */}
            {/* ... ถ้ายังต้องการใส่ตารางก็ใส่ต่อด้านล่าง ... */}
          </div>
        )}

        {/* Tab "Summary" */}
        {activeTab === "summary" && (
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
        )}
      </div>
    </div>
  );
};

export default Attendance;
