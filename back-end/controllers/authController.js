const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");

const validateToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({ valid: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // res.json({ valid: true, user: decoded }); ตรงนี้แก้แบบ optional แก้ก็ได้ไม่แก้ก็ได้ ถ้าไม่ใช้โค้ดด้านล่างเมื่อไหร่ก็กลับมาใช้อันนี้ได้เลย
    res.json({
      valid: true,
      user: { _id: decoded.id, username: decoded.username, role: decoded.role },
    });
  } catch (error) {
    res.json({ valid: false });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Employee.findOne({ "accountInfo.username": username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.accessStatus === "revoked") {
      return res.status(403).json({
        message: "Your account has been revoked. Please contact admin.",
      });
    }
    if (user.accessStatus === "pending") {
      return res.status(403).json({
        message:
          "Your account is pending approval. Please wait for admin approval.",
      });
    }

    console.log("User found:", user); // 🛠 Debug: ดูว่า user มี role หรือเปล่า

    const isMatch = await bcrypt.compare(password, user.accountInfo.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.accountInfo.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login Response:", { id: user._id, role: user.role }); // 🛠 Debug ตรงนี้

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.accountInfo.username,
        email: user.personalInfo.email,
        role: user.role,
        accessStatus: user.accessStatus,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { validateToken, login };
