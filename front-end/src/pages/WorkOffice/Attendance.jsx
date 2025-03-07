// Attendance.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TabHeader from "../../components/TabHeader";
import AttendanceTab from "../../components/attendance/AttendanceTab";
import SummaryTab from "../../components/attendance/SummaryTab";
import axios from "../../../../back-end/axios"; 

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("attendance"); // Tab ปัจจุบัน
  const { user, loading } = useContext(AuthContext);

  // จัดเก็บเวลาปัจจุบัน (โชว์บนจอแบบเรียลไทม์)
  const [currentTime, setCurrentTime] = useState("");

  const [todayAttendance , setTodayAttendance] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(null);

  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isOTRequested, setIsOTRequested] = useState(false);
  
  useEffect(() => {
    if (loading || !user || !user._id) return;

    const fetchTodayAttendance = async ()=>{
      setLoadingAttendance(true);

      try{
        const res = await axios.get(`/attendance/${user._id}/${new Date().getMonth()+1}/${new Date().getFullYear()}`);
        console.log(res.data);


        //หาข้อมูล attendance ของวันนี้
        const today = new Date().toISOString().split("T")[0];//yyyy-mm-dd
        const todayData = res.data.records.find(
            (record) => record.date.split("T")[0] === today
        );

        if(todayData){
          setTodayAttendance(todayData);
          setCheckInTime(todayData.checkIn);
          setCheckOutTime(todayData.checkOut);
          setIsCheckedIn(todayData.checkIn && !todayData.checkOut);
          setIsOTRequested(todayData.overtime.isRequested);
        }
      }catch(error){
        console.error("Error fetching today's attendance: ",error);
      }finally{
        setLoadingAttendance(false);
      }
    };

    fetchTodayAttendance();
  },[loading,user]);

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

  if (loading || loadingAttendance) {
    return (
      <div className="text-center text-gray-600 p-8">
        🔄 Loading user data...
      </div>
    );
  }

  if (!user || !user._id) {
    return <div className="text-center">⚠️ ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่</div>;
  }

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

  if (loading) return <div>Loading...</div>;

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
          <AttendanceTab 
            currentTime={currentTime}
            checkInTime={checkInTime}
            setCheckInTime={setCheckInTime}
            checkOutTime={checkOutTime}
            setCheckOutTime={setCheckOutTime}
            isCheckedIn={isCheckedIn}
            setIsCheckedIn={setIsCheckedIn}
            isOTRequested={isOTRequested}
            setIsOTRequested={setIsOTRequested}
            todayAttendance={todayAttendance}
            loadingAttendance={loadingAttendance}
          />
        )}
        {activeTab === "summary" && <SummaryTab />}
      </div>
    </div>
  );
};

export default Attendance;
