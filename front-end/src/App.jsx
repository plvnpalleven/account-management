import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "./context/AuthContext.jsx";
const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);

  const { user, loading } = useContext(AuthContext);

  // useEffect(() => {
  //   const checkTokenValidity = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setIsAuthenticated(false);
  //       setLoading(false);
  //       return;
  //     }
  //     try {
  //       const { data } = await axios.get(
  //         "http://localhost:5000/api/auth/validate-token",
  //         {
  //           headers: { authorization: `Bearer ${token}` },
  //         }
  //       );
  //       if (data.valid) {
  //         setIsAuthenticated(true);
  //       } else {
  //         localStorage.removeItem("token");
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       localStorage.removeItem("token");
  //       setIsAuthenticated(false);
  //     }
  //     setLoading(false);
  //   };

  //   checkTokenValidity();
  // }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" richColors visibleToasts={1} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
         {/* 404 */}
         <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
