import React, { useState, useEffect, useContext } from "react";
import axios from "../../../../back-end/axios";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
  const [otHours, setOtHours] = useState(1);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isOTActive, setIsOTActive] = useState(false);

  if (loading) {
    return (
      <div className="text-center text-gray-600">🔄 Loading user data...</div>
    );
  }
  // API: Check-in
  const handleCheckIn = async () => {
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

  const handleIncreaseOt = () => {
    setOtHours((prev) => prev + 1);
  };

  const handleDecreaseOt = () => {
    setOtHours((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // API: Request OT
  const handleRequestOT = async () => {
    try {
      // const requestedHours = 2; // ตัวอย่างขอ OT 2 ชั่วโมง
      const res = await axios.post("/attendance/request-ot", {
        userId: user._id,
        requestedHours: otHours,
      });
      setIsOTRequested(res.data.attendanceRecord.overtime.isRequested);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data.message || "OT Request Error");
    }
  };

  // time remain calculate function
  const calculateTimeToEndOfWork = () => {
    const now = new Date();
    const endOfWork = new Date();
    endOfWork.setHours(17, 30, 0, 0); //เลิก 17.30
    //ตรงนี้แก้เพราะเอากลับไปทำที่บ้าน อย่าลืมเปลี่ยนกลับเป็น 17.30
    let diff = Math.floor((endOfWork - now) / 1000);
    return diff > 0 ? diff : 0;
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`/attendance/${user._id}/today`); //API ดึงข้อมูลวันนี้
      if (res.data) {
        setCheckInTime(res.data.checkIn || "--:--");
        setCheckOutTime(res.data.checkOut || "--:--");
        setIsCheckedIn(!!res.data.checkInTime && !res.data.checkOutTime);
        setIsOTRequested(res.data.overtime.isRequested || false);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    if (!loading && user?._id) {
      fetchAttendance();
    }
  }, [loading,user]);

  useEffect(() => {
    let timer;

    if (!isOTActive) {
      setRemainingTime(calculateTimeToEndOfWork()); //ถ้านับปกติ
    } else {
      setRemainingTime(otHours * 3600); //ถ้าเริ่ม OT -> แปลงชั่วโมงเป็นนาที
    }

    timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          alert("Time ups!");
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOTActive, otHours]);

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

      {/* display countdown */}

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="text-4xl font-semibold mb-5">Remaining Time</div>
        <div className="text-6xl font-semibold mt-1">
          {/* {Math.floor(remainingTime / 3600)} :{" "}
          {Math.floor((remainingTime % 3600) / 60)} : {remainingTime % 60} */}
          {String(Math.floor(remainingTime / 3600)).padStart(2, "0")}:
          {String(Math.floor((remainingTime % 3600) / 60)).padStart(2, "0")}:
          {String(remainingTime % 60).padStart(2, "0")}
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
              <div className="text-lg font-medium">Add Hour</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                  onClick={handleDecreaseOt}
                >
                  <RemoveIcon sx={{ fontSize: "16px" }} />
                </button>
                <div className="text-lg ml-2 mr-2">{otHours}</div>

                <button
                  className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                  onClick={handleIncreaseOt}
                >
                  <AddIcon sx={{ fontSize: "16px" }} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
              <div className="text-lg font-medium">Total Hours</div>
              <div className="text-lg mt-1">{otHours} Hours</div>
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
