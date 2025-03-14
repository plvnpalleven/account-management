import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../../../../back-end/axios";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const getTodayString = () => {
  const now = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  return now.toLocaleDateString("en-GB", options);
};

const AttendanceTab = ({ currentTime }) => {
  const { user, loading } = useContext(AuthContext);

  // attendance state
  const [checkInTime, setCheckInTime] = useState("--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const hasCheckOut = checkOutTime !== "--:--";

  // ot state
  const [adjustHours, setAdjustHours] = useState(1);
  const [plannedHours, setPlannedHours] = useState(0);
  const [isOTRequested, setIsOTRequested] = useState(false);
  const [isOTApproved, setIsOTApproved] = useState(false);
  const [isOTActive, setIsOTActive] = useState(false);

  // countdown state
  const [remainingTime, setRemainingTime] = useState(0);

  const fetchAttendanceToday = async () => {
    try {
      const res = await axios.get(`/attendance/today`);
      if (res.data) {
        setCheckInTime(res.data.checkIn || "--:--");
        setCheckOutTime(res.data.checkOut || "--:--");
        setIsCheckedIn(!!res.data.checkIn && !res.data.checkOut);
      }
      if (res.data.overtime) {
        setIsOTRequested(res.data.overtime.isRequested);
        setIsOTApproved(res.data.overtime.isApproved);
        setPlannedHours(res.data.overtime.plannedHours);
        setIsOTActive(res.data.overtime.isOTActive);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // API: Check-in
  const handleCheckIn = async () => {
    try {
      const now = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await axios.post("/attendance/check-in", {
        userId: user._id,
        checkInTime: now,
      });
      await fetchAttendanceToday();
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

      await axios.post("/attendance/check-out", {
        userId: user._id,
        checkOutTime: now,
      });
      await fetchAttendanceToday();
    } catch (error) {
      alert(error.response?.data.message || "Check-out error");
    }
  };

  const handleIncreaseAdjust = () => {
    setAdjustHours((prev) => prev + 1);
  };

  const handleDecreaseAdjust = () => {
    setAdjustHours((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncreasePlanned = async () => {
    try {
      const res = await axios.post("/attendance/adjust-planned-hours", {
        hours: 1, // +1 hour
      });
      const updated = res.data.attendanceRecord.overtime.plannedHours;
      setPlannedHours(updated);
    } catch (error) {
      alert(error.response?.data.message || "Adjust planned hours failed");
    }
  };

  const handleDecreasePlanned = async () => {
    try {
      const res = await axios.post("/attendance/adjust-planned-hours", {
        hours: -1, //-1 hour
      });
      const updated = res.data.attendanceRecord.overtime.plannedHours;
      setPlannedHours(updated);
    } catch (error) {
      alert(error.response?.data.message || "Adjust planned hours failed");
    }
  };

  const handleStartOT = async () => {
    try {
      //ส่งเวลาเริ่มแบบ HH:MM
      const nowTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const res = await axios.post("/attendance/start-ot", {
        startTime: nowTime,
      });
      alert(res.data.message);

      // update state
      const newRecord = res.data.attendanceRecord;
      setIsOTActive(newRecord.overtime.isOTActive);
      // (ถ้ามี field otStart ก็อาจเก็บ state ไว้แสดงได้)
    } catch (error) {
      alert(error.response?.data.message || "Start OT failed");
    }
  };

  const handleEndOT = async () => {
    try {
      const nowTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const res = await axios.post("/attendance/end-ot", {
        endTime: nowTime,
      });
      alert(res.data.message);

      //update state
      const newRecord = res.data.attendanceRecord;
      setIsOTActive(newRecord.overtime.isOTActive);
      //อาจเก็บ totalHours มาโชว์ หรือเก็บ otEnd มาโชว์ได้
    } catch (error) {
      alert(error.response?.data.message || "End OT failed");
    }
  };

  // API: Request OT
  const handleRequestOT = async () => {
    try {
      // const requestedHours = 2; // ตัวอย่างขอ OT 2 ชั่วโมง
      const res = await axios.post("/attendance/request-ot", {
        userId: user._id,
        requestedHours: adjustHours,
      });
      setIsOTRequested(res.data.attendanceRecord.overtime.isRequested);
      setIsOTApproved(res.data.attendanceRecord.overtime.isApproved);
      setPlannedHours(res.data.attendanceRecord.overtime.plannedHours);

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data.message || "OT Request Error");
    }
  };

  useEffect(() => {
    if (!loading && user?._id) {
      fetchAttendanceToday();
    }
  }, [loading, user]);

  const alertShownRef = useRef(false);

  useEffect(() => {
    let timer;

    const calculateTimeToEndOfWork = () => {
      const now = new Date();
      const endOfWork = new Date();
      endOfWork.setHours(17, 30, 0, 0); // เวลาเลิกงาน
      const diff = Math.floor((endOfWork - now) / 1000);
      return diff > 0 ? diff : 0;
    };
    if (!isOTActive) {
      setRemainingTime(calculateTimeToEndOfWork()); //ถ้านับปกติ
    } else {
      setRemainingTime(plannedHours * 3600); //ถ้าเริ่ม OT -> แปลงชั่วโมงเป็นนาที
    }

    timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          if (!alertShownRef.current) {
            alert("Time ups!");
            alertShownRef.current = true;
          }
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOTActive, plannedHours]);

  if (loading) {
    return (
      <div className="text-center text-gray-600">🔄 Loading user data...</div>
    );
  }

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
              <div className="text-lg mt-1">{checkInTime}</div>
            </div>
            <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
              <div className="text-lg font-medium">Check Out</div>
              <div className="text-lg mt-1">{checkOutTime}</div>
            </div>
          </div>
          <button
            disabled={hasCheckOut}
            className={`w-full py-2 rounded-lg transition-all duration-300 ${
              hasCheckOut
                ? "bg-gray-400 cursor-not-allowed text-white"
                : isCheckedIn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          >
            {/* {isCheckedIn ? "Check Out" : "Check In"} */}
            {hasCheckOut
              ? "Already Checked Out"
              : isCheckedIn
              ? "CheckOut"
              : "Check In"}
          </button>
        </div>

        {!isOTRequested && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Add Hour</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleDecreaseAdjust}
                      disabled={isOTRequested}
                    >
                      <RemoveIcon sx={{ fontSize: "16px" }} />
                    </button>
                    <div className="text-lg ml-2 mr-2">{adjustHours}</div>

                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleIncreaseAdjust}
                      disabled={isOTRequested}
                    >
                      <AddIcon sx={{ fontSize: "16px" }} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total Hours</div>
                  <div className="text-lg mt-1">{adjustHours} Hours</div>
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
          </>
        )}
        {isOTRequested && !isOTApproved && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">
                    Total Hours (wait for approve.)
                  </div>
                  <div className="text-lg mt-1">{adjustHours} Hours</div>
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
          </>
        )}

        {isOTApproved && !isOTActive && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Add Hour</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleDecreasePlanned}
                    >
                      <RemoveIcon sx={{ fontSize: "16px" }} />
                    </button>
                    <div className="text-lg ml-2 mr-2">{adjustHours}</div>

                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleIncreasePlanned}
                    >
                      <AddIcon sx={{ fontSize: "16px" }} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total Hours</div>
                  <div className="text-lg mt-1">{plannedHours} Hours</div>
                </div>
              </div>

              <button
                className={`w-full py-2 rounded-lg ${
                  isOTRequested
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                onClick={handleStartOT}
              >
                Start OT
              </button>
            </div>
          </>
        )}

        {isOTActive && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Add Hour</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleDecreasePlanned}
                      disabled={isOTActive}
                    >
                      <RemoveIcon sx={{ fontSize: "16px" }} />
                    </button>
                    <div className="text-lg ml-2 mr-2">{adjustHours}</div>

                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleIncreasePlanned}
                    >
                      <AddIcon sx={{ fontSize: "16px" }} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total Hours</div>
                  <div className="text-lg mt-1">{plannedHours} Hours</div>
                </div>
              </div>

              <button
                className="w-full py-2 rounded-lg 
                    : bg-green-500 hover:bg-green-600 text-white"
                onClick={handleEndOT}
              >
                Finish OT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceTab;
