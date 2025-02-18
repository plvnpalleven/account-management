import React from "react";

const TabHeader = ({ pageTabs, activeTab, onTabChange }) => {
  return (
    <div className="flex justify-between items-center">
      {/* กลุ่มปุ่มหลัก (Tabs เฉพาะของหน้านั้น) */}
      <div className="flex gap-1">
        {pageTabs.map((tab) => (
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
            activeTab === "profile" ? "bg-white font-bold" : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => onTabChange("profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
};


export default TabHeader;
