import { useState } from "react";
import logo from "../../assets/logo.png"; // อันนี้แค่เทสน่ะ
import ff from "../../assets/ff.jpg";
const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("employee"); // state สำหรับ tab ที่ active

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      {/* Tabs Header */}
      <div className="flex gap-1 justify-between">
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
        <button
          className={`w-32 h-10 flex items-center justify-center rounded-tl-lg rounded-tr-lg ${
            activeTab === "hr"
              ? "bg-white font-bold"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >Profile</button>
      </div>

      {/* Tabs Content */}
      <div className=" bg-white p-6">
        {activeTab === "employee" && (
          <div className="w-full h-[560px] flex items-center justify-center">
            {/* <h2 className="text-xl font-bold mb-4">Employee Section</h2> */}
            <div className="flex gap-24">
              <div className="w-[300px] h-[500px] bg-[#FBFBFB] shadow-xl rounded-lg">
                {/* หัวข้อ */}
                <div className="bg-blue-400 text-white text-center py-2 rounded-t-lg font-bold">
                  ผู้สมัครใหม่
                </div>
                {/* Content */}
                <div className="profile flex items-center justify-between p-2 h-16 mx-4">
                  <div className="image flex items-center gap-5">
                    <img
                      src={ff}
                      alt="pfp"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <h1 className="name flex justify-center items-center">
                      John Doe
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="border-2 flex items-center justify-center w-8 h-8 border-black text-black p-2 rounded-full font-bold">
                      ✓
                    </button>
                    <button className="border-2 flex items-center justify-center w-8 h-8 border-black text-black p-2 rounded-full font-bold">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-[300px] h-[500px] bg-[#FBFBFB] shadow-xl rounded-lg">
                <div className="bg-yellow-300 text-white text-center py-2 rounded-t-lg font-bold">
                  รอสัมภาษณ์
                </div>
              </div>
              <div className="w-[300px] h-[500px] bg-[#FBFBFB] shadow-xl rounded-lg">
                <div className="bg-green-400 text-white text-center py-2 rounded-t-lg font-bold">
                  ผ่านสัมภาษณ์
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
      {activeTab === "profile" && (
          <profileTab/>
        )}
    </div>
  );
};

export default Recruitment;
