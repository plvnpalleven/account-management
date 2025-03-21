import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "../../../../back-end/axios";

const LeaveModal = ({ open, onClose, onLeaveCreated }) => {
  const [leaveType, setLeaveType] = useState("sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/leave/request",
        { leaveType, startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // success
      onLeaveCreated(); 
    } catch (error) {
      console.error("Error creating leave request:", error);
      alert(error.response?.data?.message || "Error");
    }
  };

  const handleClose = () => {
    // เคลียร์ฟอร์มเมื่อปิดโมดัล
    setLeaveType("sick");
    setStartDate("");
    setEndDate("");
    setReason("");

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Leave</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Leave Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="leave-type-label">Leave Type</InputLabel>
            <Select
              labelId="leave-type-label"
              value={leaveType}
              label="Leave Type"
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <MenuItem value="sick">Sick</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="vacation">Vacation</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Start Date */}
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          {/* End Date */}
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          {/* Reason */}
          <TextField
            label="Reason"
            fullWidth
            margin="normal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit Leave
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeaveModal;
