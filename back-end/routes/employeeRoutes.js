const express = require("express");
const {checkUsername , registerEmployee} = require("../controllers/employeeController");

const router = express.Router();

router.post("/check-username",checkUsername);
router.post("/register",registerEmployee);

module.exports = router;