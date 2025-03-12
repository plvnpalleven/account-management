const express = require("express");
const router = express.Router();
const attendanceControllerAdmin = require("../controllers/attendanceControllerAdmin");
const {protect} = require("../middleware/authMiddleware");

router.get("/ot-requests",protect,attendanceControllerAdmin.getAllOTRequests);
router.post("/ot-approve/:requestId",protect,attendanceControllerAdmin.approveOT);
router.post("/ot-decline/:requestId",protect,attendanceControllerAdmin.declineOT);

module.exports = router;