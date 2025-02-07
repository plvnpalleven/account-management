const express = require("express");
const {
  checkUsernameExists,
  registerEmployee,
  checkEmailExists,
} = require("../controllers/registerController");
const router = express.Router();

router.post("/check-username", checkUsernameExists);
router.post("/check-email", checkEmailExists);
router.post("/", registerEmployee);

module.exports = router;
