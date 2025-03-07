import React, { useContext } from "react";
import axios from "../../../../back-end/axios";
import { AuthContext } from "../../context/AuthContext";

// สมมติถ้าอยากโชว์ชื่อ User จาก Context จริงๆ
const getTodayString = () => {
  const now = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  return now.toLocaleDateString("en-GB", options);
};

const AttendanceTab = ({
  currentTime,
  checkInTime,
  setCheckInTime,
  checkOutTime,
  setCheckOutTime,
  isCheckedIn,
  setIsCheckedIn,
  isOTRequested,
  setIsOTRequested,
  todayAttendance,
  loadingAttendance,
}) => {
  const { user, loading } = useContext(AuthContext);

   if (loading) {
    return (
      <div className="text-center text-gray-600">
        🔄 Loading user data...
      </div>
    );
  }
  // API: Check-in
  const handleCheckIn = async () => {
    // console.log("🔍 Debug: Checking User from Context", user);
    // if (!user || !user._id) {
    //     alert("⚠️ User data is not available. Please wait a moment.");
    //     return;
    //   }
    try {
      const now = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      console.log("🚀 Sending Check-in Request with User ID:", user._id);

      const res = await axios.post("/attendance/check-in", {
        userId: user._id,
        checkInTime: now,
      });

      setCheckInTime(res.data.checkIn);
      setIsCheckedIn(true);
    } catch (error) {
      alert(error.response?.data.message || "Check-in error");
    }
  };

  // API: Check-out
  const handleCheckOut = async () => {
    try {
      const now = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const res = await axios.post("/attendance/check-out", {
        userId: user._id,
        checkOutTime: now,
      });
      setCheckOutTime(now);
      setIsCheckedIn(false);
    } catch (error) {
      alert(error.response?.data.message || "Check-out error");
    }
  };

  // API: Request OT
  const handleRequestOT = async () => {
    try {
      const requestedHours = 2; // ตัวอย่างขอ OT 2 ชั่วโมง
      const res = await axios.post("/attendance/request-ot", {
        userId: user._id,
        requestedHours,
      });
      setIsOTRequested(true);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data.message || "OT Request Error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="text-left ml-10 mt-5 mb-10">
          <h2 className="text-3xl font-semibold">
            Hi {user.firstName} {user.lastName} !!
          </h2>
          <p className="text-lg text-gray-600">It's {getTodayString()}</p>
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center items-start gap-8 mb-6">
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <h3 className="text-gray-700 text-3xl font-bold">Clock In & Out</h3>
          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
              <div className="text-lg font-medium">Check In</div>
              <div className="text-lg mt-1">{checkInTime || "--:--"}</div>
            </div>
            <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
              <div className="text-lg font-medium">Check Out</div>
              <div className="text-lg mt-1">{checkOutTime || "-- : --"}</div>
            </div>
          </div>
          <button
            className={`w-full py-2 rounded-lg transition-all duration-300 ${
              isCheckedIn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
              <div className="text-lg font-medium">Start</div>
              <div className="text-lg mt-1">-- : --</div>
            </div>

            <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
              <div className="text-lg font-medium">End</div>
              <div className="text-lg mt-1">-- : --</div>
            </div>
          </div>

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
  );
};

export default AttendanceTab;
