import React, { useEffect, useState } from "react";
import axios from "../../../../back-end/axios";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const RequestTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOTRequests();
  }, []);

  const fetchOTRequests = async () => {
    try {
      const res = await axios.get("/attendanceAdmin/ot-requests");
      setRequests(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching OT requests:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post(`/attendanceAdmin/ot-approve/${requestId}`, {
        isApproved: true,
      });
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error approving OT:", error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post(`/attendanceAdmin/ot-decline/${requestId}`, {
        isApproved: false,
      });
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error declining OT:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500">Loading OT requests...</div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Overtime Request</h2>
      <div className="border-t">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No pending OT requests
          </p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="flex  items-center py-3 border-b">
              <img
                src={req.userId?.documents?.profilePicture?.secure_url}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-lg font-semibold ml-10 mr-3">
                <h2>
                  {req.userId?.personalInfo?.firstName}

                  {req.userId?.personalInfo?.lastName}
                </h2>
              </div>
              <div className="text-lg font-semibold ml-3 mr-3">
                {req.overtime.requestedHours} Hours
              </div>
              <div className="flex">
                <IconButton
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(req._id)}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  variant="contained"
                  color="error"
                  onClick={() => handleDecline(req._id)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestTab;
