import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom';
const Login = ({ setIsAuthenticated}) => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) =>{
    e.preventDefault();
    //จำลองการเข้าสู่ระบบ hard-coded ไปก่อน
    if(username ==='test' && password ==='1234'){
      setIsAuthenticated(true);
      alert('Login successful!');
      navigate("/dashboard");
    }else{
      alert('Invalid username or password');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="block mb-2 font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;