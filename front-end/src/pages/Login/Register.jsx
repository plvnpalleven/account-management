import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //จำลองการสมัครสมาชิก
    console.log("Register user:", { username, email, password });
    alert("Registration successful");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
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
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
