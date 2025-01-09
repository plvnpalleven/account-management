import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../index.css";
const Sidebar = () => {
  const location = useLocation(); //ดึง path ปัจจุบัน
  const [isWorkOfficeOpen, setIsWorkOfficeOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isFinancialOpen,setIsFinancialOpen] = useState(false);

  const toggleWorkOffice = () => setIsWorkOfficeOpen(!isWorkOfficeOpen);
  const toggleCustomerService = () => setIsCustomerOpen(!isCustomerOpen);
  const toggleFinancialService = () => setIsFinancialOpen(!isFinancialOpen);
  
  return (
    <div className="w-60 h-screen bg-gray-800 text-white flex flex-col">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-700">
        My App
      </h1>
      <nav className="flex flex-col space-y-2 p-4">
        {/* Work Office Dropdown */}
        <>
        <button
          onClick={toggleWorkOffice}
          className={`p-2 rounded text-left ${
            isWorkOfficeOpen ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          Work Office
        </button>
        {/* Work Office Child*/}
        {isWorkOfficeOpen && (
          <div className="flex flex-col space-y-2">
            <Link
              to="/WorkOffice/Recruitment"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/Recruitment"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Recruitment
            </Link>
            <Link
              to="/WorkOffice/Attendance"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/Attendance"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Attendance
            </Link>
            <Link
              to="/WorkOffice/ToDo"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/ToDo"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              To-Do List
            </Link>
            <Link
              to="/WorkOffice/DayOff"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/DayOff"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Day Off
            </Link>
            <Link
              to="/WorkOffice/RoomBooking"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/RoomBooking"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Room Booking
            </Link>

            <Link
              to="/WorkOffice/VehicleBooking"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/VehicleBooking"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Vehicle Booking
            </Link>

            <Link
              to="/WorkOffice/ExpenseReimbursement"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/ExpenseReimbursement"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Expense Reimbursement
            </Link>

            <Link
              to="/WorkOffice/Payroll"
              className={`p-2 rounded ${
                location.pathname === "/WorkOffice/Payroll"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Payroll
            </Link>
          </div>
        )}
        </>
        <>

        {/* Customer Service Dropdown */}
        <button
          onClick={toggleCustomerService}
          className={`p-2 rounded text-left ${
            isCustomerOpen ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          Customer Service
        </button>
         {/* Customer Service Child */}
        {isCustomerOpen && (
            <Link>
            
            </Link>
        )}
        </>

        {/* Financial System Dropdown */}
        <>
        <button
          onClick={toggleFinancialService}
          className={`p-2 rounded text-left ${
            isFinancialOpen ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          Financial Service
        </button>
        </>

      </nav>
    </div>
  );
};
export default Sidebar;
