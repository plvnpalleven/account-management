// ProfileTab.jsx
import React, { useState } from "react";

function ProfileTab({ user }) {
  const [editMode, setEditMode] = useState(false); // state สำหรับโหมดแก้ไข
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    // ...ฟิลด์อื่นๆ ที่อยากให้แก้ไขได้
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // เรียก API สำหรับ update user profile
    // อาจใช้ axios.patch("/api/users/me", formData)
    // แล้ว setEditMode(false)
  };

  if (!user) {
    return <p>No user data</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      
      {/* โหมดแสดง */}
      {!editMode && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          {/* ...อื่นๆ */}
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* โหมดแก้ไข */}
      {editMode && (
        <div className="flex flex-col space-y-2">
          <label>
            Name: 
            <input
              className="ml-2 p-1 border border-gray-300 rounded"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email: 
            <input
              className="ml-2 p-1 border border-gray-300 rounded"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone: 
            <input
              className="ml-2 p-1 border border-gray-300 rounded"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          {/* ...อื่นๆ ตามต้องการ */}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileTab;
