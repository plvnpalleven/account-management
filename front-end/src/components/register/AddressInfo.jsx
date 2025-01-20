import React from "react";

const AddressInfo = ({formData,setFormData}) => {
  const handleChange = (e) => {
    const {name ,value} = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };


  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="flex-[7]">
          <label className="block mb-2 font-medium text-gray-700">
            Current Address
          </label>
          <input
            type="text"
            name="firstName" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.personalInfo.fullName || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Enter your current address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div className="flex-[3]">
          <label className="block mb-2 font-medium text-gray-700">
            Village No.
          </label>
          <input
            type="text"
            name="lastName" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.personalInfo.fullName || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Village No."
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
