import React from "react";

const AddPersonalInfo = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target; // ดึง name และ value จาก input
    setFormData((prev) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div>
      <div>
        <label className="block mb-2 font-medium text-gray-700">Religion</label>
        <select 
          name="religion" // ชื่อ key ใน formData
          value={formData.additionalInfo.religion || ""} // ค่าใน Dropdown อิงจาก formData
          onChange={handleChange} // อัปเดตค่าข้อมูล
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">Select Religion</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Christianity">Christianity</option>
          <option value="Islam">Islam</option>
          <option value="Hinduism">Hinduism</option>
          <option value="Other">Other</option>
        </select>

        {/* แสดงฟิลด์อินพุตเมื่อเลือก "Other" */}
        {formData.additionalInfo.religion === "Other" && (
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Specify Religion
            </label>
            <input
              type="text"
              name="otherReligion" // ใช้ name ใหม่สำหรับค่าอื่น
              value={formData.additionalInfo.otherReligion || ""} // ดึงค่าจาก formData
              onChange={handleChange} // อัปเดตค่าข้อมูล
              placeholder="Please specify your religion"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">
            Ethnicity
          </label>
          <input
            type="text"
            name="ethnicity" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.additionalInfo.ethnicity || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Enter your ethnicity"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">
            Nationality
          </label>
          <input
            type="text"
            name="nationality" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.additionalInfo.nationality || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Enter your nationality"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">
            Military Status
          </label>
          <select
            name="militaryStatus" // ชื่อ key ใน formData
            value={formData.additionalInfo.militaryStatus || ""} // ค่าใน Dropdown อิงจาก formData
            onChange={handleChange} // อัปเดตค่าข้อมูล
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">Select Militatary Status</option>
            <option value="Exempted">Exempted</option>
            <option value="Reserve">Reserve</option>
            <option value="Not Yet Drafted">Not Yet Drafted</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">
            Marital Status
          </label>
          <select
            name="maritalStatus" // ชื่อ key ใน formData
            value={formData.additionalInfo.maritalStat || ""} // ค่าใน Dropdown อิงจาก formData
            onChange={handleChange} // อัปเดตค่าข้อมูล
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddPersonalInfo;
