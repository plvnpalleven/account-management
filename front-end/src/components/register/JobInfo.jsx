import React from "react";

const JobInfo = ({ formData, setFormData }) => {
  // ฟังก์ชันอัปเดตข้อมูลใน formData
  const handleChange = (e) => {
    const { name, value } = e.target; // ดึง name และ value จาก input
    setFormData((prev) => ({
      ...prev, // คัดลอกค่าก่อนหน้า
      jobInfo: {
        ...prev.jobInfo, // คัดลอกข้อมูล jobInfo เดิม
        [name]: value, // อัปเดตค่าของฟิลด์ที่เปลี่ยนแปลง
      },
    }));
  };

  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">Position</label>
      <input
        type="text"
        name="position" // กำหนด name ให้ตรงกับ key ใน jobInfo
        value={formData.jobInfo.position || ""} // ดึงค่าจาก formData.jobInfo.position
        onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
        placeholder="Enter desired position"
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">Expected Salary</label>
      <input
        type="number"
        name="expectedSalary" // กำหนด name ให้ตรงกับ key ใน jobInfo
        value={formData.jobInfo.expectedSalary || ""} // ดึงค่าจาก formData.jobInfo.expectedSalary
        onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
        placeholder="Enter expected salary"
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />
    </div>
  );
};

export default JobInfo;
