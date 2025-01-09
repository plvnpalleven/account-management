import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation(); // ดึง path ปัจจุบัน
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state สำหรับเปิด/ปิด dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // สลับสถานะ dropdown
  };

  return (
    <div className="w-60 h-screen bg-gray-800 text-white flex flex-col">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-700">My App</h1>
      <nav className="flex flex-col space-y-2 p-4">
        <Link
          to="/"
          className={`p-2 rounded ${
            location.pathname === "/"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-700"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`p-2 rounded ${
            location.pathname === "/about"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-700"
          }`}
        >
          About
        </Link>
        <Link
          to="/contact"
          className={`p-2 rounded ${
            location.pathname === "/contact"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-700"
          }`}
        >
          Contact
        </Link>
        {/* Dropdown Parent */}
        <button
          onClick={toggleDropdown}
          className={`p-2 rounded text-left ${
            isDropdownOpen ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          Drop down test
        </button>
        {/* Dropdown Children */}
        {isDropdownOpen && (
          <div className="flex flex-col space-y-2">
            <Link
              to="/DropdownChild1"
              className={`p-2 rounded ${
                location.pathname === "/DropdownChild1"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Drop down child 1
            </Link>
            <Link
              to="/DropdownChild2"
              className={`p-2 rounded ${
                location.pathname === "/DropdownChild2"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Drop down child 2
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
