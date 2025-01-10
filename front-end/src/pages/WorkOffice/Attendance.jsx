import { useState } from "react";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("employee"); // state สำหรับ tab ที่ active

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      {/* Tabs Header */}
      <div className="flex gap-1">
        <button
          className={`w-32 h-10 flex items-center justify-center rounded-tl-lg rounded-tr-lg ${
            activeTab === "employee"
              ? "bg-white font-bold"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setActiveTab("employee")}
        >
          สมัครงาน
        </button>
        <button
          className={`w-32 h-10 flex items-center justify-center rounded-tl-lg rounded-tr-lg ${
            activeTab === "hr"
              ? "bg-white font-bold"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setActiveTab("hr")}
        >
          ทดลองงาน
        </button>
      </div>

      {/* Tabs Content */}
      <div className=" bg-white p-6">
        {activeTab === "employee" && (
          <div className="w-[800px] h-[560px]">
            <h2 className="text-xl font-bold mb-4">Employee Section</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-blue-100 p-4 rounded shadow">
                <p>Firstname Lastname</p>
                
                <div className="flex gap-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">
                    ✓
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "hr" && (
          <div className="w-[800px] h-[560px]">
            <h2 className="text-xl font-bold mb-4">HR Section</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-yellow-100 p-4 rounded shadow">
                <p>Firstname Lastname</p>
                <div className="flex gap-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">
                    ✓
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
