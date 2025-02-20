import React, { useState } from "react";

const ProfileTabEdit = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: initialData.personalInfo?.firstName || "",
      lastName: initialData.personalInfo?.lastName || "",
      phone: initialData.personalInfo?.phone || "",
      email: initialData.personalInfo?.email || "",
    },
    // เพิ่มฟิลด์อื่น ๆ ที่ต้องการแก้ไขได้ตามต้องการ
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleSaveClick = () => {
    onSave(formData);
  };

  return (
    <div className="p-4 space-y-6 max-h-[700px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>

      <section className="bg-gray-50 p-4 rounded shadow space-y-2">
        <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">First Name:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="firstName"
              value={formData.personalInfo.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold">Last Name:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="lastName"
              value={formData.personalInfo.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold">Phone:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="phone"
              value={formData.personalInfo.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold">Email:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              name="email"
              value={formData.personalInfo.email}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={handleSaveClick}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileTabEdit;
