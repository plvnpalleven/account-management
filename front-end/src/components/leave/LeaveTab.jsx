import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import LeaveModal from "./LeaveModal";
import HolidayModal from "./HolidayModal";
import { AuthContext } from "../../context/AuthContext";

const LeaveTab = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  // const [openModal, setOpenModal] = useState(false);

  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [openHolidayModal, setOpenHolidayModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/leave/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // const handleOpenModal = () => setOpenModal(true);
  // const handleCloseModal = () => setOpenModal(false);

  const handleOpenLeaveModal = () => setOpenLeaveModal(true);
  const handleCloseLeaveModal = () => setOpenLeaveModal(false);

  const handleOpenHolidayModal = () => setOpenHolidayModal(true);
  const handleCloseHolidayModal = () => setOpenHolidayModal(false);

  const handleLeaveCreated = () => {
    handleCloseLeaveModal();
    fetchLeaves();
  };

  const handleHolidayCreated = () => {
    handleCloseHolidayModal();
    fetchLeaves();
  };

  // Function to return appropriate badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentLeaves = leaves.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(leaves.length / pageSize);

  //handler
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg h-[500px]">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Leave Requests</h1>
        <div className="flex flex-row gap-4">
          {user?.role === "admin" && (
            <button
              onClick={handleOpenHolidayModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
            >
              Add Holidays
            </button>
          )}
          <button
            onClick={handleOpenLeaveModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
          >
            Add Leave
          </button>
        </div>
      </div>

      {/* Leave table */}
      <div className="overflow-y-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLeaves.map((leave) => (
              <tr
                key={leave._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {new Date(leave.startDate).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center ">
                  {new Date(leave.endDate).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {capitalizeFirstLetter(leave.leaveType)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate text-center">
                  {leave.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeColor(
                      leave.status
                    )}`}
                  >
                    {capitalizeFirstLetter(leave.status)}
                  </span>
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-300 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No leave requests found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {leaves.length !== 0 && (
        <div className="flex justify-center mt-3 space-x-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="flex items-center">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <LeaveModal
        open={openLeaveModal}
        onClose={handleCloseLeaveModal}
        onLeaveCreated={handleLeaveCreated}
      />

      {user?.role === "admin" && (
        <HolidayModal
          open={openHolidayModal}
          onClose={handleCloseHolidayModal}
          onHolidayCreated={handleHolidayCreated}
        />
      )}
    </div>
  );
};

export default LeaveTab;
