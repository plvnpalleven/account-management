import { Link, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import "./Sidebar.css";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
const Sidebar = () => {
  const location = useLocation(); //ดึง path ปัจจุบัน
  const { user } = useContext(AuthContext);

  const [isWorkOfficeOpen, setIsWorkOfficeOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isFinancialOpen, setIsFinancialOpen] = useState(false);

  const toggleWorkOffice = () => {
    setIsWorkOfficeOpen(!isWorkOfficeOpen);
    setIsCustomerOpen(false); // ปิด Customer Service
    setIsFinancialOpen(false); // ปิด Financial Service
  };
  const toggleCustomerService = () => {
    setIsCustomerOpen(!isCustomerOpen);
    setIsWorkOfficeOpen(false); // ปิด Work Office
    setIsFinancialOpen(false); // ปิด Financial Service
  };
  const toggleFinancialService = () => {
    setIsFinancialOpen(!isFinancialOpen);
    setIsWorkOfficeOpen(false); // ปิด Work Office
    setIsCustomerOpen(false); // ปิด Customer Service
  };

  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" className="sidebar-logo" />
      <nav className="flex flex-col">
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
            <div className="flex flex-col">
              {user?.role === "admin" && (
                <Link
                  to="/dashboard/WorkOffice/Recruitment"
                  className={`nav-link ${
                    location.pathname === "/dashboard/WorkOffice/Recruitment"
                      ? "nav-active"
                      : ""
                  }`}
                >
                  Recruitment
                </Link>
              )}

              <Link
                to="/dashboard/WorkOffice/Attendance"
                className={`nav-link ${
                  location.pathname === "/dashboard/WorkOffice/Attendance"
                    ? "nav-active"
                    : ""
                }`}
              >
                Attendance
              </Link>
              <Link
                to="/dashboard/WorkOffice/ToDo"
                className={`nav-link ${
                  location.pathname === "/dashboard/WorkOffice/ToDo"
                    ? "nav-active"
                    : ""
                }`}
              >
                To-Do List
              </Link>
              <Link
                to="/dashboard/WorkOffice/DayOff"
                className={`nav-link ${
                  location.pathname === "/dashboard/WorkOffice/DayOff"
                    ? "nav-active"
                    : ""
                }`}
              >
                Day Off
              </Link>
              <Link
                to="/dashboard/WorkOffice/RoomBooking"
                className={`nav-link ${
                  location.pathname === "/dashboard/WorkOffice/RoomBooking"
                    ? "nav-active"
                    : ""
                }`}
              >
                Room Booking
              </Link>

              <Link
                to="/dashboard/WorkOffice/VehicleBooking"
                className={`nav-link ${
                  location.pathname === "/dashboard/WorkOffice/VehicleBooking"
                    ? "nav-active"
                    : ""
                }`}
              >
                Vehicle Booking
              </Link>

              <Link
                to="/dashboard/WorkOffice/ExpenseReimbursement"
                className={`nav-link ${
                  location.pathname ===
                  "/dashboard/WorkOffice/ExpenseReimbursement"
                    ? "nav-active"
                    : ""
                }`}
              >
                Expense Reimbursement
              </Link>

              <Link
                to="/dashboard/WorkOffice/Payroll"
                className={`nav-link ${
                  location.pathname === "/dashboard/WorkOffice/Payroll"
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
            <div className="flex flex-col">
              <Link
                to="/dashboard/CustomerService/AddInfo"
                className={`nav-link ${
                  location.pathname === "/dashboard/CustomerService/AddInfo"
                    ? "nav-active"
                    : ""
                }`}
              >
                Add Info
              </Link>
              <Link
                to="/dashboard/CustomerService/Quotation"
                className={`nav-link ${
                  location.pathname === "/dashboard/CustomerService/Quotation"
                    ? "nav-active"
                    : ""
                }`}
              >
                Quotation
              </Link>
              <Link
                to="/dashboard/CustomerService/Invoice"
                className={`nav-link ${
                  location.pathname === "/dashboard/CustomerService/Invoice"
                    ? "nav-active"
                    : ""
                }`}
              >
                Invoice
              </Link>
              <Link
                to="/dashboard/CustomerService/Receipt"
                className={`nav-link ${
                  location.pathname === "/dashboard/CustomerService/Receipt"
                    ? "nav-active"
                    : ""
                }`}
              >
                Receipt
              </Link>
              <Link
                to="/dashboard/CustomerService/MeetingSchedule"
                className={`nav-link ${
                  location.pathname ===
                  "/dashboard/CustomerService/MeetingSchedule"
                    ? "nav-active"
                    : ""
                }`}
              >
                Meeting Schedule
              </Link>
              <Link
                to="/dashboard/CustomerService/ConfidentialyAgreement"
                className={`nav-link ${
                  location.pathname ===
                  "/dashboard/CustomerService/ConfidentialyAgreement"
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
            <div className="flex flex-col">
              <Link
                to="/dashboard/FinancialSystem/AnnualExpenses"
                className={`nav-link ${
                  location.pathname ===
                  "/dashboard/FinancialSystem/AnnualExpenses"
                    ? "nav-active"
                    : ""
                }`}
              >
                Annual Expenses
              </Link>
              <Link
                to="/dashboard/FinancialSystem/AnnualRevenue"
                className={`nav-link ${
                  location.pathname ===
                  "/dashboard/FinancialSystem/AnnualRevenue"
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
