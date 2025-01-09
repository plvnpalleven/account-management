import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";
const Sidebar = () => {
  const location = useLocation(); //ดึง path ปัจจุบัน
  const [isWorkOfficeOpen, setIsWorkOfficeOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isFinancialOpen, setIsFinancialOpen] = useState(false);

  const toggleWorkOffice = () => setIsWorkOfficeOpen(!isWorkOfficeOpen);
  const toggleCustomerService = () => setIsCustomerOpen(!isCustomerOpen);
  const toggleFinancialService = () => setIsFinancialOpen(!isFinancialOpen);

  return (
    <div className="sidebar">
      <h1 className="sidebar-header">My App</h1>
      <nav className="flex flex-col space-y-2 p-4">
        {/* Work Office Dropdown */}
        <>
          <button
            onClick={toggleWorkOffice}
            className={`dropdown-button ${
              isWorkOfficeOpen ? "dropdown-active" : ""
            }`}
          >
            Work Office
          </button>
          {/* Work Office Child*/}
          {isWorkOfficeOpen && (
            <div className="flex flex-col space-y-2">
              <Link
                to="/WorkOffice/Recruitment"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/Recruitment"
                    ? "nav-active"
                    : ""
                }`}
              >
                Recruitment
              </Link>
              <Link
                to="/WorkOffice/Attendance"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/Attendance"
                    ? "nav-active"
                    : ""
                }`}
              >
                Attendance
              </Link>
              <Link
                to="/WorkOffice/ToDo"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/ToDo" ? "nav-active" : ""
                }`}
              >
                To-Do List
              </Link>
              <Link
                to="/WorkOffice/DayOff"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/DayOff" ? "nav-active" : ""
                }`}
              >
                Day Off
              </Link>
              <Link
                to="/WorkOffice/RoomBooking"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/RoomBooking"
                    ? "nav-active"
                    : ""
                }`}
              >
                Room Booking
              </Link>

              <Link
                to="/WorkOffice/VehicleBooking"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/VehicleBooking"
                    ? "nav-active"
                    : ""
                }`}
              >
                Vehicle Booking
              </Link>

              <Link
                to="/WorkOffice/ExpenseReimbursement"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/ExpenseReimbursement"
                    ? "nav-active"
                    : ""
                }`}
              >
                Expense Reimbursement
              </Link>

              <Link
                to="/WorkOffice/Payroll"
                className={`nav-link ${
                  location.pathname === "/WorkOffice/Payroll"
                    ? "nav-active"
                    : ""
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
            className={`dropdown-button ${
              isCustomerOpen ? "dropdown-active" : ""
            }`}
          >
            Customer Service
          </button>
          {/* Customer Service Child */}
          {isCustomerOpen && (
            <div className="flex flex-col space-y-2">
              <Link
                to="/CustomerService/AddInfo"
                className={`nav-link ${
                  location.pathname === "/CustomerService/AddInfo"
                    ? "nav-active"
                    : ""
                }`}
              >
                Add Info
              </Link>
              <Link
                to="/CustomerService/Quotation"
                className={`nav-link ${
                  location.pathname === "/CustomerService/Quotation"
                    ? "nav-active"
                    : ""
                }`}
              >
                Quotation
              </Link>
              <Link
                to="/CustomerService/Invoice"
                className={`nav-link ${
                  location.pathname === "/CustomerService/Invoice"
                    ? "nav-active"
                    : ""
                }`}
              >
                Invoice
              </Link>
              <Link
                to="/CustomerService/Receipt"
                className={`nav-link ${
                  location.pathname === "/CustomerService/Receipt"
                    ? "nav-active"
                    : ""
                }`}
              >
                Receipt
              </Link>
              <Link
                to="/CustomerService/MeetingSchedule"
                className={`nav-link ${
                  location.pathname === "/CustomerService/MeetingSchedule"
                    ? "nav-active"
                    : ""
                }`}
              >
                Meeting Schedule
              </Link>
              <Link
                to="/CustomerService/ConfidentialyAgreement"
                className={`nav-link ${
                  location.pathname ===
                  "/CustomerService/ConfidentialyAgreement"
                    ? "nav-active"
                    : ""
                }`}
              >
                Confidentialy Agreement
              </Link>
            </div>
          )}
        </>

        {/* Financial System Dropdown */}
        <>
          <button
            onClick={toggleFinancialService}
            className={`dropdown-button ${
              isFinancialOpen ? "dropdown-active" : ""
            }`}
          >
            Financial Service
          </button>
          {/* Financial System Child */}
          {isFinancialOpen && (
            <div className="flex flex-col space-y-2">
              <Link
                to="/FinancialSystem/AnnualExpenses"
                className={`nav-link ${
                  location.pathname === "/FinancialSystem/AnnualExpenses"
                    ? "nav-active"
                    : ""
                }`}
              >
                Annual Expenses
              </Link>
              <Link
                to="/FinancialSystem/AnnualRevenue"
                className={`nav-link ${
                  location.pathname === "/FinancialSystem/AnnualRevenue"
                    ? "nav-active"
                    : ""
                }`}
              >
                Annual Revenue
              </Link>
            </div>
          )}
        </>
      </nav>
    </div>
  );
};
export default Sidebar;
