import React from "react";

const PersonalInfo = ({ formData, setFormData }) => {
  // ฟังก์ชันอัปเดตข้อมูลใน formData
  const handleChange = (e) => {
    const { name, value } = e.target; // ดึง name และ value จาก input
    setFormData((prev) => ({
      ...prev, // คัดลอกค่าก่อนหน้า
      personalInfo: {
        ...prev.personalInfo, // คัดลอกข้อมูล personalInfo เดิม
        [name]: value, // อัปเดตค่าของฟิลด์ที่เปลี่ยนแปลง
      },
    }));
  };

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName" // กำหนด name ให้ตรงกับ key  ใน personalInfo
            value={formData.personalInfo.firstName || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Enter your first name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.personalInfo.lastName || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Enter your last name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="flex-[6]">
          <label className="block mb-2 font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.personalInfo.dateOfBirth || ""} // ดึงค่าจาก formData.personalInfo.dateOfBirth
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div className="flex-[4]">
        <label className="block mb-2 font-medium text-gray-700">Age</label>
        <input
          type="number"
          name="age" // กำหนด name ให้ตรงกับ key ใน personalInfo 
          value={formData.personalInfo.age || ""} // ดึงค่าจาก formData.personalInfo.age
          onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
          placeholder="Enter your age"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
        </div>
      </div>

      <label className="block mb-2 font-medium text-gray-700">Phone</label>
      <input
        type="text"
        name="phone" // กำหนด name ให้ตรงกับ key ใน personalInfo
        value={formData.personalInfo.phone || ""} // ดึงค่าจาก formData.personalInfo.phone
        onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
        placeholder="Enter your phone number"
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">Email</label>
      <input
        type="email"
        name="email" // กำหนด name ให้ตรงกับ key ใน personalInfo
        value={formData.personalInfo.email || ""} // ดึงค่าจาก formData.personalInfo.email
        onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
        placeholder="Enter your email"
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />
    </div>
  );
};

export default PersonalInfo;
