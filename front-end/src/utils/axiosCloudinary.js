// src/axiosCloudinary.js
import axios from "axios";

const axiosCloudinary = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dzfug6mj5",
  // ไม่กำหนด header Authorization หรือ headers อื่นๆ ที่เกี่ยวกับ token
  
});
delete axiosCloudinary.defaults.headers.common["Authorization"];

export default axiosCloudinary;
