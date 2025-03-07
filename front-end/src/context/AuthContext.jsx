import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:5000/api/auth/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.valid) {
          //แปล id -> _id
          const userFromAPI = res.data.user;
          if (!userFromAPI._id && userFromAPI.id) {
            setUser({ ...userFromAPI, _id: userFromAPI.id });
          } else {
            setUser(userFromAPI);
          }
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("User from API:", user); // ✅ ตอนนี้จะ log ค่าที่อัปเดตแล้ว
  }, [user]); // 🔍 รันทุกครั้งที่ user เปลี่ยนค่า

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
