import React from "react";
import { Navigate } from "react-router-dom";

// เราจะรับ prop isAuthenticated มาจาก App หรือ Context ก็ได้
const PrivateRoute = ({ isAuthenticated, children }) => {
  // ถ้าล็อกอินอยู่ ให้ render children (เช่น Dashboard)
  // ถ้าไม่ ให้ Redirect ไป /login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
