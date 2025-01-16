import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Login/Register.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // state for login

  return (
    <Router>
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
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
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
