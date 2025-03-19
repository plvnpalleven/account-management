const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const registerRoutes = require("./routes/registerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const recruitRoutes = require("./routes/recruitRoutes");
const profileRoutes = require("./routes/profileRoutes");
const deleteFileRoute = require("./routes/deleteFileRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const attendanceControllerAdmin = require("./routes/attendanceRoutesAdmin");
const employeeRoutes = require("./routes/employeeRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/employees", registerRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recruit",recruitRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/delete-file", deleteFileRoute);
app.use("/attendance",attendanceRoutes);
app.use("/attendanceAdmin",attendanceControllerAdmin);
app.use("/employee", employeeRoutes);

require("./utils/cronJobs");


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
