import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "../../utils/axios";
import { toast } from "sonner";


const HolidayModal = ({ open, onClose, onHolidayCreated }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        //ยังไม่ได้ทำ API
        "/leave/holidays",
        { startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // success
      toast.success("Holiday added successfully!");
      onHolidayCreated && onHolidayCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating leave request:", error);
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleClose = () => {
    // เคลียร์ฟอร์มเมื่อปิดโมดัล
    setStartDate("");
    setEndDate("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Holidays</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Start Date */}
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            required
          />

          {/* End Date */}
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            required
          />

          {/* Reason */}
          <TextField
            label="Reason (Holiday Name)"
            fullWidth
            margin="normal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HolidayModal;
