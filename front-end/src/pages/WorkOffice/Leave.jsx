import { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

import TabHeader from "../../components/TabHeader";
import ProfileTab from "../../components/ProfileTab";

import LeaveTab from "../../components/leave/LeaveTab";
import LeaveRequestTab from "../../components/leave/LeaveRequestTab";
const Leave = () => {
  const [activeTab, setActiveTab] = useState("attendance"); // state สำหรับ tab ที่ active
  const { user, loading } = useContext(AuthContext);

  const pageTabs = [{ label: "Leave", value: "leave" }];

  if (user?.role === "admin") {
    pageTabs.push({ label: "Request", value: "request" });
  }
  return (
    <div className="flex flex-col p-6 bg-gray-300 min-h-screen">
      <TabHeader
        pageTabs={pageTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 bg-white p-6 shadow-md max-h-screen overflow-auto">
        {activeTab === "request" && <LeaveRequestTab />}
        {activeTab === "leave" && <LeaveTab />}
      </div>

      <div className="flex-1 bg-white p-6 shadow-md max-h-screen overflow-hidden">
        {activeTab === "profile" && <ProfileTab user={user} />}
      </div>
    </div>
  );
};

export default Leave;
