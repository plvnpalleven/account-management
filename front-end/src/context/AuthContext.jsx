import React, { createContext, useState, useEffect } from "react";
import axios from "../utils/axios";

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
          const userFromAPI = res.data.user;
          setUser(userFromAPI);
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
    console.log("User from API:", user);
  }, [user]); 

  const login = (token, userData) => {
    localStorage.setItem("token", token);

    console.log("Before setting token:", axios.defaults.headers.common);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("After setting token:", axios.defaults.headers.common);

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
