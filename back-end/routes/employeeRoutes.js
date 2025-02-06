const express = require("express");
const {
  checkUsernameExists,
  registerEmployee,
  checkEmailExists,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/check-username", checkUsernameExists);
router.post("/check-email", checkEmailExists);
router.post("/register", registerEmployee);

router.get("/dashboard",protect,(req,res)=>{
    //ใครจะเรียก /api/employees/dashboard ได้ ต้องมี token ที่ถูก
    //สมมติว่าส่งข้อมูลกลับ
    res.json({status:"OK",message:"Protected dashboard data"});
});

module.exports = router;
