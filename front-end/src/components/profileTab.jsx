import React, { useState } from "react";
import { formatDate } from "../utils/formatDate";

function ProfileTab({ user }) {
  const [editMode, setEditMode] = useState(false);

  // ฟอร์มแก้ไข (ตัวอย่างแค่ Personal Info)
  const [formData, setFormData] = useState({
    firstName: user?.personalInfo?.firstName || "",
    lastName: user?.personalInfo?.lastName || "",
    phone: user?.personalInfo?.phone || "",
    email: user?.personalInfo?.email || "",
    // ถ้าต้องการแก้ addressInfo หรือ jobInfo ก็เพิ่มในนี้ได้
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // เรียก API สำหรับ update user profile
    // เช่น axios.patch("/api/users/me", formData)
    console.log("Saving formData:", formData);
    setEditMode(false);
  };

  if (!user) {
    return <p>No user data</p>;
  }

  // ─────────────────────────────────────────────────
  //               MODE: READ-ONLY
  // ─────────────────────────────────────────────────
  if (!editMode) {
    return (
      <div className="p-4 max-h-[600px] overflow-y-auto space-y-4">
        <h2 className="text-2xl font-bold mb-2">My Profile</h2>

        {/* Personal Info */}
        <section className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
          <p><span className="font-semibold">First Name:</span> {user.personalInfo?.firstName}</p>
          <p><span className="font-semibold">Last Name:</span> {user.personalInfo?.lastName}</p>
          <p><span className="font-semibold">Date of Birth:</span> {formatDate(user.personalInfo?.dateOfBirth)}</p>
          <p><span className="font-semibold">Age:</span> {user.personalInfo?.age}</p>
          <p><span className="font-semibold">Phone:</span> {user.personalInfo?.phone}</p>
          <p><span className="font-semibold">Email:</span> {user.personalInfo?.email}</p>
        </section>

        {/* Additional Info */}
        <section className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
          <p><span className="font-semibold">Religion:</span> {user.additionalInfo?.religion}</p>
          <p><span className="font-semibold">Ethnicity:</span> {user.additionalInfo?.ethnicity}</p>
          <p><span className="font-semibold">Nationality:</span> {user.additionalInfo?.nationality}</p>
          <p><span className="font-semibold">Military Status:</span> {user.additionalInfo?.militaryStatus}</p>
          <p><span className="font-semibold">Marital Status:</span> {user.additionalInfo?.maritalStatus}</p>
        </section>

        {/* Address Info */}
        <section className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Address Info</h3>
          <p><span className="font-semibold">Current Address:</span> {user.addressInfo?.currentAddress}</p>
          <p><span className="font-semibold">Village Number:</span> {user.addressInfo?.villageNumber}</p>
          <p><span className="font-semibold">Street Name:</span> {user.addressInfo?.streetName}</p>
          <p><span className="font-semibold">Sub District:</span> {user.addressInfo?.subDistrict}</p>
          <p><span className="font-semibold">Province:</span> {user.addressInfo?.province}</p>
          <p><span className="font-semibold">Postal Code:</span> {user.addressInfo?.postalCode}</p>
        </section>

        {/* Job Info */}
        <section className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Job Info</h3>
          <p><span className="font-semibold">Position:</span> {user.jobInfo?.position}</p>
          <p><span className="font-semibold">Expected Salary:</span> {user.jobInfo?.expectedSalary}</p>
        </section>

        {/* Documents */}
        <section className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Documents</h3>
          <p><span className="font-semibold">Profile Picture:</span> {user.documents?.profilePicture}</p>
          <p><span className="font-semibold">ID Card:</span> {user.documents?.idCard}</p>
          <p><span className="font-semibold">House Registration:</span> {user.documents?.houseRegistration}</p>
          <p><span className="font-semibold">Diploma:</span> {user.documents?.diploma}</p>
          <p><span className="font-semibold">Bank Account:</span> {user.documents?.bankAccount}</p>
        </section>

        {/* Other fields (not createdAt, isEmployee) */}
        <section className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Other</h3>
          <p><span className="font-semibold">Application Status:</span> {user.applicationStatus}</p>
          <p><span className="font-semibold">Access Status:</span> {user.accessStatus}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
        </section>

        <button
          onClick={() => setEditMode(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit Profile
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  //               MODE: EDIT
  // ─────────────────────────────────────────────────
  return (
    <div className="p-4 max-h-[600px] overflow-y-auto space-y-4">
      <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
      
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded shadow">
        {/* ตัวอย่างแก้แค่บางฟิลด์ */}
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ถ้าจะให้แก้ Address, Job Info ฯลฯ ก็ทำ section เพิ่มได้ */}

      <div className="flex gap-2">
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
  );
}

export default ProfileTab;
