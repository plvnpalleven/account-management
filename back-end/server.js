const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // โหลดค่าจากไฟล์ .env

const app = express();

// Middleware
app.use(cors()); // เปิดใช้งาน CORS
app.use(express.json()); // ให้ Express อ่านข้อมูล JSON ได้

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Route ตัวอย่าง
app.get("/", (req, res) => {
  res.send("Hello, MERN Stack!");
});

const applicantSchema = new mongoose.Schema({
    name: String,
    status: String,
    image: String,
  });
  
  const Applicant = mongoose.model("Applicant", applicantSchema);

  app.get("/api/applicants", async (req, res) => {
    try {
      const applicants = await Applicant.find();
      res.json(applicants);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


// รันเซิร์ฟเวอร์
const PORT = process.env.PORT || 4000; // ใช้พอร์ตจาก .env หรือ 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
