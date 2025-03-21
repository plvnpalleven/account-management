const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const {protect} = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

router.post("/request",protect,leaveController.requestLeave);
router.patch("/:leaveId/approve",protect,isAdmin,leaveController.approveLeave);
router.patch("/:leaveId/reject",protect,isAdmin,leaveController.rejectLeave);
router.get("/my-leaves",protect,leaveController.getMyLeaves);
router.get("/admin-requests", protect, isAdmin, leaveController.getAllLeaves);

module.exports = router;