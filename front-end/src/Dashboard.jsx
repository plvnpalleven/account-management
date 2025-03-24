import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Attendance from "./pages/WorkOffice/Attendance";
import Leave from "./pages/WorkOffice/Leave";
import ExpenseReimbursement from "./pages/WorkOffice/ExpenseReimbursement";
import Payroll from "./pages/WorkOffice/Payroll";
import Recruitment from "./pages/WorkOffice/Recruitment";
import RoomBooking from "./pages/WorkOffice/RoomBooking";
import ToDo from "./pages/WorkOffice/ToDo";
import VehicleBooking from "./pages/WorkOffice/VehicleBooking";
import AddInfo from "./pages/CustomerService/AddInfo";
import Quotation from "./pages/CustomerService/Quotation";
import Invoice from "./pages/CustomerService/Invoice";
import Receipt from "./pages/CustomerService/Receipt";
import MeetingSchedule from "./pages/CustomerService/MeetingSchedule";
import ConfidentialyAgreement from "./pages/CustomerService/ConfidentialyAgreement";
import AnnualExpenses from "./pages/FinancialSystem/AnnualExpenses";
import AnnualRevenue from "./pages/FinancialSystem/AnnualRevenue";
import PrivateRoute from "./components/privateRoute";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Routes>
          {/* Work Office Routes */}
          <Route
            path="WorkOffice/Recruitment"
            element={
              <PrivateRoute roles={["admin"]}>
                <Recruitment />
              </PrivateRoute>
            }
          />
          <Route path="WorkOffice/Attendance" element={<Attendance />} />
          <Route path="WorkOffice/ToDo" element={<ToDo />} />
          <Route path="WorkOffice/Leave" element={<Leave />} />
          <Route path="WorkOffice/RoomBooking" element={<RoomBooking />} />
          <Route
            path="WorkOffice/VehicleBooking"
            element={<VehicleBooking />}
          />
          <Route
            path="WorkOffice/ExpenseReimbursement"
            element={<ExpenseReimbursement />}
          />
          <Route path="WorkOffice/Payroll" element={<Payroll />} />
          {/* Customer Services Routes */}
          <Route path="CustomerService/AddInfo" element={<AddInfo />} />
          <Route path="CustomerService/Quototaion" element={<Quotation />} />
          <Route path="CustomerService/Invoice" element={<Invoice />} />
          <Route path="CustomerService/Receipt" element={<Receipt />} />
          <Route
            path="CustomerService/MeetingSchedule"
            element={<MeetingSchedule />}
          />
          <Route
            path="CustomerService/ConfidentialyAgreement"
            element={<ConfidentialyAgreement />}
          />
          {/* Financial Services Routes */}
          <Route
            path="FinancialService/AnnualExpenses"
            element={<AnnualExpenses />}
          />
          <Route
            path="FinancialService/AnnualRevenue"
            element={<AnnualRevenue />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
