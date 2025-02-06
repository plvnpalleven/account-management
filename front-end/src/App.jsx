import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Login/register.jsx";
import { Toaster } from "sonner"; //sonner's toaster
import PrivateRoute from "./components/privateRoute.jsx";
import axios from "axios";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      {/* Toaster */}
      <Toaster position="top-center" richColors visibleToasts={1} />
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        {/* Register Route */}
        <Route path="/register" element={<Register />} />
        {/* Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
