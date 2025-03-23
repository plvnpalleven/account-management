import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatDecimalHoursToHHMM } from "../../utils/formatDecimalDateToHHMM";
import { toast } from "sonner";
import ConfirmEndModal from "./ConfirmEndModal";
import AutoEndOTModal from "./AutoEndOTModal";

const formatTime = (dateString) => {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [totalHours, setTotalHours] = useState(0);

  const hasCheckOut = checkOutTime !== "--:--";
  // ot state
  const [adjustHours, setAdjustHours] = useState(1);
  const [plannedHours, setPlannedHours] = useState(0);
  const [otStatus, setOtStatus] = useState("none"); // "none","requested","active","finished","declined"
  const [otStartTime, setOtStartTime] = useState(null);
  const [otEndTime, setOtEndTime] = useState(null);
  const [totalOTHours, setTotalOTHours] = useState(0);

  // countdown state
  const [remainingTime, setRemainingTime] = useState(0);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isAutoEndModalOpen, setIsAutoEndModalOpen] = useState(false);
  const GRACE_PERIOD = 15; // 15 วิ , 600 = 15 นาที

  useEffect(() => {
    if (otStatus === "active" && remainingTime <= 0) {
      //เมื่อเหลือเวลา 0 (หรือ < 0 ) จะเปิด AutoEndModal
      setIsAutoEndModalOpen(true);
    }
    else{
      setIsAutoEndModalOpen(false);
    }
  }, [remainingTime, otStatus]);

  const openCheckOutModal = () => {
    setModalType("checkOut");
    setIsModalOpen(true);
  };

  const openEndOTModal = () => {
    setModalType("endOT");
    setIsModalOpen(true);
  };

  const handleConfirmCheckOut = () => {
    handleCheckOut(); // ฟังก์ชัน Check Out เดิม
    setIsModalOpen(false);
  };

  const handleConfirmEndOT = () => {
    handleEndOT(); // ฟังก์ชัน End OT เดิม
    setIsModalOpen(false);
  };

  const fetchEmployeeInfo = async () => {
    try {
      const res = await axios.get("/employee/info", {
        params: { userId: user._id },
      });
      setEmployeeInfo(res.data);
    } catch (error) {
      console.error("Error fetching employee info:", error);
    }
  };

  const fetchAttendanceToday = async () => {
    try {
      const res = await axios.get(`/attendance/today`);
      if (res.data) {
        setCheckInTime(formatTime(res.data.checkIn));
        setCheckOutTime(formatTime(res.data.checkOut));
        setIsCheckedIn(!!res.data.checkIn && !res.data.checkOut);

        if (res.data.totalHours) {
          setTotalHours(res.data.totalHours);
        } else {
          setTotalHours(0);
        }
      }

      if (res.data.overtime) {
        setOtStatus(res.data.overtime.status);
        setPlannedHours(res.data.overtime.plannedHours);
        if (res.data.overtime.otStart) {
          setOtStartTime(res.data.overtime.otStart);
        }
        if (res.data.overtime.otEnd) {
          setOtEndTime(res.data.overtime.otEnd);
        }

        // เช็คว่ามี totalOTHours กลับมาจาก backend หรือไม่
        if (res.data.overtime.totalOTHours) {
          setTotalOTHours(res.data.overtime.totalOTHours);
        } else {
          // กรณีไม่มีค่า ก็อาจเซตเป็น 0 หรือปล่อยตามเดิม
          setTotalOTHours(0);
        }
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
      });
      toast.success("Check-in success!");

      await fetchAttendanceToday();
    } catch (error) {
      toast.error(error.response?.data.message || "Check-in error");
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
      });
      await fetchAttendanceToday();
      toast.success("Check-out success!");
    } catch (error) {
      toast.error(error.response?.data.message || "Check-out error");
    }
  };

  const handleIncreaseAdjust = () => {
    if (adjustHours >= 8) {
      toast.error("Reached maximum OT.");
      return;
    }
    setAdjustHours((prev) => prev + 1);
  };

  const handleDecreaseAdjust = () => {
    if (adjustHours <= 1) {
      toast.error("Cannot reduce below 0 hours.");
      return;
    }
    setAdjustHours((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncreasePlanned = async () => {
    if (plannedHours >= 8) {
      toast.error("Reached maximum OT.");
      return;
    }
    try {
      const res = await axios.patch("/attendance/adjust-planned-hours", {
        hours: 1, // +1 hour
      });
      const updated = res.data.attendanceRecord.overtime.plannedHours;
      setPlannedHours(updated);
      setAdjustHours((prev) => prev + 1);
    } catch (error) {
      toast.error(
        error.response?.data.message || "Adjust planned hours failed"
      );
    }
  };

  const handleDecreasePlanned = async () => {
    if (otStatus === "active") {
      toast.error("After starting OT, hours cannot be reduced.");
      return;
    }
    if (plannedHours <= 1) {
      toast.error("Cannot reduce below 0 hours.");
      return;
    }
    try {
      const res = await axios.patch("/attendance/adjust-planned-hours", {
        hours: -1, //-1 hour
      });
      const updated = res.data.attendanceRecord.overtime.plannedHours;
      setPlannedHours(updated);
      setAdjustHours((prev) => (prev > 1 ? prev - 1 : prev));
    } catch (error) {
      toast.error(
        error.response?.data.message || "Adjust planned hours failed"
      );
    }
  };

  const handleExtendOT = async () => {
    try {
      const res = await axios.patch("/attendance/adjust-planned-hours", {
        hours: 1,
      });
      const updated = res.data.attendanceRecord.overtime.plannedHours;
      setPlannedHours(updated);
      //Toast สำหรับแจ้งเตือน
      toast.success("Extend OT by 1 hours.");

      //อาจจะต้องรีเซต localStorage otTimeAlertShown ถ้าใช้
      localStorage.removeItem("otTimeAlertShown");
      //จากนั้น fetchAttendanceToday() เพื่อดึงข้อมูลใหม่
      await fetchAttendanceToday();
    } catch (error) {
      toast.error(error.response?.data.message || "Extend OT failed");
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
      toast.success(res.data.message);
      await fetchAttendanceToday();

      // update state
      setOtStatus(res.data.attendanceRecord.overtime.status);
      // (ถ้ามี field otStart ก็อาจเก็บ state ไว้แสดงได้)
    } catch (error) {
      toast.error(error.response?.data.message || "Start OT failed");
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
      toast.success(res.data.message);

      //update state
      setOtStatus(res.data.attendanceRecord.overtime.status);
      setTotalOTHours(res.data.attendanceRecord.overtime.totalOTHours);
      //อาจเก็บ totalHours มาโชว์ หรือเก็บ otEnd มาโชว์ได้
      await fetchAttendanceToday();
    } catch (error) {
      toast.error(error.response?.data.message || "End OT failed");
    }
  };

  const handleEndOTAuto = async () => {
    try {
      const nowTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const res = await axios.post("/attendance/end-ot", {
        endTime: nowTime,
      });
      toast.success("OT ended automatically.");

      setOtStatus(res.data.attendanceRecord.overtime.status);
      setTotalOTHours(res.data.attendanceRecord.overtime.totalOTHours);
      await fetchAttendanceToday();
    } catch (error) {
      toast.error(error.response?.data.message || "End OT failed");
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
      setOtStatus(res.data.attendanceRecord.overtime.status);
      setPlannedHours(res.data.attendanceRecord.overtime.plannedHours);

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data.message || "OT Request Error");
    }
  };

 
  //fetch
  useEffect(() => {
    if (!loading && user?._id) {
      fetchAttendanceToday();
      fetchEmployeeInfo();
    }
  }, [loading, user]);

  const alertShownRef = useRef(false);

  //timer
  useEffect(() => {
    let timer;
    const calculateRemainingTime = () => {
      if (otStatus === "approved" && hasCheckOut) {
        return plannedHours * 3600;
      }
      if (hasCheckOut && otStatus !== "active") {
        return 0;
      }

      if (otStatus === "active" && otStartTime) {
        const totalSeconds = plannedHours * 3600;
        const startTimestamp = new Date(otStartTime).getTime();
        const currentTimestamp = Date.now();
        const elapsed = Math.floor((currentTimestamp - startTimestamp) / 1000);
        return Math.max(totalSeconds - elapsed, 0);
      } else if (otStatus === "finished") {
        return 0;
      } else {
        const now = new Date();
        const endOfWork = new Date();
        endOfWork.setHours(17, 30, 0, 0);
        const diff = Math.floor((endOfWork - now) / 1000);
        return diff > 0 ? diff : 0;
      }
    };

    //ตั้งค่า remaingTime ครั้งแรก
    setRemainingTime(calculateRemainingTime());

    timer = setInterval(() => {
      const newRemaining = calculateRemainingTime();
      setRemainingTime(newRemaining);
      if (newRemaining <= 0) {
        clearInterval(timer);
        //ใช้ localStorage เก็บ flag เพื่อกัน alert ซ้ำเมื่อ refresh
        if (!localStorage.getItem("otTimeAlertShown")) {
          toast("Times ups!");
          localStorage.setItem("otTimeAlertShown", "true");
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otStatus, plannedHours, otStartTime, checkOutTime]);

  //loading
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
            Hi , {employeeInfo?.firstName} {employeeInfo?.lastName}
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
            onClick={isCheckedIn ? openCheckOutModal : handleCheckIn}
          >
            {/* {isCheckedIn ? "Check Out" : "Check In"} */}
            {hasCheckOut
              ? "Already Checked Out"
              : isCheckedIn
              ? "CheckOut"
              : "Check In"}
          </button>
        </div>

        {otStatus === "none" && (
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
                    >
                      <RemoveIcon sx={{ fontSize: "16px" }} />
                    </button>
                    <div className="text-lg ml-2 mr-2">{adjustHours}</div>

                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleIncreaseAdjust}
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
                className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                onClick={handleRequestOT}
                disabled={otStatus !== "none"}
              >
                Request OT
              </button>
            </div>
          </>
        )}
        {otStatus === "requested" && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">
                    Total Hours (Await for approve.)
                  </div>
                  <div className="text-lg mt-1">{plannedHours} Hours</div>
                </div>
              </div>
              <button
                className="w-full py-2 rounded-lg bg-gray-400 cursor-not-allowed text-white"
                disabled
                // onClick={handleRequestOT}
              >
                OT Requested ✅
              </button>
            </div>
          </>
        )}

        {otStatus === "approved" && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total Hours</div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleDecreasePlanned}
                    >
                      <RemoveIcon sx={{ fontSize: "16px" }} />
                    </button>
                    <div className="text-lg mt-1">{plannedHours} Hours</div>
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleIncreasePlanned}
                    >
                      <AddIcon sx={{ fontSize: "16px" }} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-2 rounded-lg transition-all duration-300 text-white ${
                  !hasCheckOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={handleStartOT}
                disabled={!hasCheckOut}
                title={!hasCheckOut ? "You need to check out first!" : ""}
              >
                Start OT
              </button>
            </div>
          </>
        )}

        {otStatus === "active" && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total Hours</div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleDecreasePlanned}
                    >
                      <RemoveIcon sx={{ fontSize: "16px" }} />
                    </button>
                    <div className="text-lg mt-1">{plannedHours} Hours</div>
                    <button
                      className="bg-gray-300 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-110"
                      onClick={handleIncreasePlanned}
                    >
                      <AddIcon sx={{ fontSize: "16px" }} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                onClick={openEndOTModal}
              >
                Finish OT
              </button>
            </div>
          </>
        )}
        {otStatus === "finished" && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Start At</div>
                  <div className="text-lg mt-1">{formatTime(otStartTime)}</div>
                </div>
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">End At</div>
                  <div className="text-lg mt-1">{formatTime(otEndTime)}</div>
                </div>
                {/* <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total</div>
                  <div className="text-lg mt-1">{formatDecimalHoursToHHMM(totalOTHours)} Hours</div>
                </div> */}
              </div>

              <button
                className="w-full py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
                disabled
              >
                Overtime has been finished
              </button>
            </div>
          </>
        )}
        {otStatus === "declined" && (
          <>
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <h3 className="text-gray-700 text-3xl font-bold">Overtime</h3>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Start At</div>
                  <div className="text-lg mt-1">{formatTime(otStartTime)}</div>
                </div>
                <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">End At</div>
                  <div className="text-lg mt-1">{formatTime(otEndTime)}</div>
                </div>
                {/* <div className="flex-1 bg-gray-100 p-4 rounded shadow text-center">
                  <div className="text-lg font-medium">Total</div>
                  <div className="text-lg mt-1">{formatDecimalHoursToHHMM(totalOTHours)} Hours</div>
                </div> */}
              </div>

              <button
                className="w-full py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
                disabled
              >
                Overtime request has been declined
              </button>
            </div>
          </>
        )}
      </div>
      <ConfirmEndModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === "checkOut" ? "Confirm Check Out" : "Confirm End OT"
        }
        message={
          modalType === "checkOut"
            ? "Are you sure you want to check out?"
            : "Are you sure you want to finish OT"
        }
        confirmText={
          modalType === "checkOut" ? "Yes, Check Out" : "Yes, Finish OT"
        }
        cancelText="Cancel"
        onConfirm={
          modalType === "checkOut" ? handleConfirmCheckOut : handleConfirmEndOT
        }
      />
      <AutoEndOTModal
        isOpen={isAutoEndModalOpen}
        onClose={() => setIsAutoEndModalOpen(false)}
        onConfirmEnd={handleEndOTAuto}
        onExtend={handleExtendOT}
        gracePeriod={600} // 15 วินาทีทดสอบ
      />
    </div>
  );
};

export default AttendanceTab;
