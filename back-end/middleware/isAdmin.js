const jwt = require("jsonwebtoken");

//Middleware เช็ค role ว่าเป็น admin หรือไม่
const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
  
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  
    next();
  };
  
  module.exports = isAdmin;
  