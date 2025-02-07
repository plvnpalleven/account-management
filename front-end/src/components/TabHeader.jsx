import React from "react";
const TabHeader = ({ mainTabs, profileTabs, activeTab, onTabChange }) => {
  return (
    <div className="flex justify-between items-center">
      {/* กลุ่มปุ่มหลัก (Main Tabs) */}
      <div className="flex gap-1">
        {mainTabs.map((tab) => (
          <button
            key={tab.value}
            className={`w-32 h-10 flex items-center justify-center rounded-tl-lg rounded-tr-lg ${
              activeTab === tab.value ? "bg-white font-bold" : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ปุ่ม Profile */}
      <div className="ml-auto">
        <button
          className={`w-32 h-10 flex items-center justify-center rounded-tl-lg rounded-tr-lg ${
            activeTab === profileTabs.value ? "bg-white font-bold" : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => onTabChange(profileTabs.value)}
        >
          {profileTabs.label}
        </button>
      </div>
    </div>
  );
};


export default TabHeader;
