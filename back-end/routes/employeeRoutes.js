const express = require('express');
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/info", employeeController.getEmployeeInfo);

module.exports = router;