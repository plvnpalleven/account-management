// Attendance.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TabHeader from "../../components/TabHeader";
import AttendanceTab from "../../components/attendance/AttendanceTab";
import SummaryTab from "../../components/attendance/SummaryTab";
import RequestTab from "../../components/attendance/RequestTab";
import axios from "../../utils/axios";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("attendance"); // Tab ปัจจุบัน
  const { user, loading } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState("");

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

  if (loading) {
    return (
      <div className="text-center text-gray-600 p-8">
        🔄 Loading user data...
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="text-center">⚠️ ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่</div>
    );
  }

  const pageTabs = [
    { label: "Attendance", value: "attendance" },
    { label: "Summary", value: "summary" },
  ];

  if (user?.role === "admin") {
    pageTabs.push({ label: "Request", value: "request" });
  }

  if (loading) return <div>Loading...</div>;

  if (!user || !user._id) {
    return (
      <div className="text-center">⚠️ ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่</div>
    );
  }

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
          <AttendanceTab currentTime={currentTime} />
        )}
        {activeTab === "request" && <RequestTab />}
        {activeTab === "summary" && <SummaryTab />}

      </div>
    </div>
  );
};

export default Attendance;
