import React from "react";

const AccountInfo = ({
  formData,
  setFormData,
  errors,
  debouncedValidation,
}) => {
  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   console.log("Before Update:", formData.accountInfo);

  //   setFormData((prev) => ({
  //     ...prev,
  //     accountInfo: {
  //       ...prev.accountInfo,
  //       [name]: value,
  //     },
  //   }));
  //   debouncedValidation(name, value);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      accountInfo: {
        ...prev.accountInfo,
        [name]: value,
      },
    }));
  
    debouncedValidation(name, value);
  };
  
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">Username</label>
      <input
        type="text"
        name="username" // กำหนด name ให้ตรงกับ key ใน jobInfo
        value={formData.accountInfo.username || ""} // ดึงค่าจาก formData.jobInfo.position
        onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
        placeholder="Enter your username"
        className={`w-full px-3 py-2 border ${
          errors.username ? "border-red-500" : "border-gray-300"
        } rounded-md`}
      />
      {errors.username && (
        <span className="text-red-500 text-sm">{errors.username}</span>
      )}
      <label className="block mb-2 font-medium text-gray-700">Password</label>
      <input
        type="password"
        name="password" // กำหนด name ให้ตรงกับ key ใน jobInfo
        value={formData.accountInfo.password || ""} // ดึงค่าจาก formData.jobInfo.expectedSalary
        onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
        placeholder="Enter your password"
        className={`w-full px-3 py-2 border ${
          errors.password ? "border-red-500" : "border-gray-300"
        } rounded-md`}
      />
      {errors.password && (
        <span className="text-red-500 text-sm">{errors.password}</span>
      )}

      <label className="block mb-2 font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.accountInfo.confirmPassword || ""}
        onChange={handleChange}
        placeholder="Confirm your password"
        className={`w-full px-3 py-2 border ${
          errors.confirmPassword ? "border-red-500" : "border-gray-300"
        } rounded-md`}
      />
      {errors.confirmPassword && (
        <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
      )}
    </div>
  );
};

export default AccountInfo;
