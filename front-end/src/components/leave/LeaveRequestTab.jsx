import React, { useState, useEffect } from "react";
import axios from "../../utils/axios"; // ปรับ path ตามโปรเจคจริง

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, IconButton } from "@mui/material";

const LeaveRequestTab = () => {
  const [requests, setRequests] = useState([]);

  // สมมติทำ pagination เหมือนใน LeaveTab
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // โหลดข้อมูลทันทีที่ component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // ดึงข้อมูล leave requests ทั้งหมด (สำหรับ admin)
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/leave/admin-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching admin requests:", error);
    }
  };

  // ฟังก์ชันอนุมัติคำขอ
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/leave/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // อัปเดตหน้าจอ (re-fetch)
      fetchRequests();
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  // ฟังก์ชันปฏิเสธคำขอ
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/leave/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // อัปเดตหน้าจอ
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // เตรียมข้อมูลสำหรับหน้า (pagination)
  const startIndex = (currentPage - 1) * pageSize;
  const currentRequests = requests.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(requests.length / pageSize);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Leave Requests</h1>
        {/* <button
          onClick={fetchRequests}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Refresh
        </button> */}
      </div>

      {/* ตาราง */}
      <div className="bg-white rounded-lg shadow overflow-y-auto max-h-[450px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold uppercase">
                Employee
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold uppercase">
                End Date
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold uppercase">
                Type
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold uppercase">
                Reason
              </th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRequests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  {req.userId?.personalInfo?.firstName
                    ? `${req.userId.personalInfo.firstName} ${req.userId.personalInfo.lastName}`
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {new Date(req.startDate).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 text-center">
                  {new Date(req.endDate).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 text-center">
                  {capitalizeFirstLetter(req.leaveType)}
                </td>
                <td className="px-6 py-4 text-center max-w-sm truncate">
                  {req.reason}
                </td>
                <td className="px-6 py-4 text-center">
                  {/* แสดงปุ่ม Approve / Reject เฉพาะถ้า status เป็น pending? */}
                  {req.status?.toLowerCase() === "requested" ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="text-green-500 rounded p-2 hover:text-green-600"
                      >
                        <CheckIcon />
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="text-red-500 rounded p-2 hover:text-red-600"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm italic">
                      No Action
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={7}
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
                    <p>No requests found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {requests.length !== 0 && (
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
    </div>
  );
};

export default LeaveRequestTab;
