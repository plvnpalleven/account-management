// src/axios.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

// ตั้ง Header ค่าเริ่มต้น
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

export default axios;
