import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import ไอคอน

const Pagination = ({ currentTab, setCurrentTab, totalTabs }) => {
  const handlePrev = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };
  const handleNext = () => {
    if (currentTab < totalTabs - 1) setCurrentTab(currentTab + 1);
  };
  return (
    <div className="flex justify-center items-center mt-4 ">
      {/* prev btn */}
      <button
        onClick={handlePrev}
        disabled={currentTab === 0}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          currentTab === 0
            ? "text-green-500 cursor-not-allowed"
            : "text-gray-300 hover:text-green-500"
        }`}
      >
        <FaChevronLeft />
      </button>


      {Array.from({ length: totalTabs }).map((_, index) => (
        <div
          key={index}
          onClick={() => setCurrentTab(index)}
          className={`cursor-pointer ${
            index === currentTab
              ? "w-12 h-4 bg-green-500 rounded-lg" // Active: ยาวขึ้นและเป็นสีเขียว
              : "w-4 h-4 bg-gray-300 rounded-full" // Default: วงกลมเล็ก
          } mx-1 transition-all duration-300 flex justify-center items-center`}
        >
          {/* แสดง Active Tab
          {index === currentTab && <span className="text-white"></span>} */}
        </div>
      ))}

      {/* next btn */}

       <button
        onClick={handleNext}
        disabled={currentTab === totalTabs - 1}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          currentTab === totalTabs - 1
            ? "text-green-500 cursor-not-allowed"
            : "text-gray-300 hover:text-green-500"
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
