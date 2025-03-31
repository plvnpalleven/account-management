import React, { useState , useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "sonner";
import {AuthContext} from "../../context/AuthContext";

const Login = () => {
  const {login} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.preventDefault() เอาไว้ใช้กันการ refresh เมื่อเรากด submit

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );

      if (data.user.accessStatus === "revoked") {
        toast.error("Your account has been revoked.Please contact admin.");
        return;
      }
      if (data.user.accessStatus === "pending") {
        toast.warning(
          "Your account is pending approval.Please wait for admin approval."
        );
        return;
      }
      login(data.token,data.user);

      toast.success("Login successful! Redirecting...");
      navigate("/dashboard/WorkOffice/Attendance");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <div className="flex items-center justify-between mt-4">
              <h5 className="mr-2">No Account?</h5>
              <h5
                className="text-gray-500 hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
              </h5>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
