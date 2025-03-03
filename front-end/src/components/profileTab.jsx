import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileTabReadOnly from "./profile/ProfileTabReadOnly";
import ProfileTabEdit from "./profile/ProfileTabEdit";

const ProfileTab = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // ดึงข้อมูลโปรไฟล์จาก API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        if (data.personalInfo?.dateOfBirth?.includes("T")) {
          data.personalInfo.dateOfBirth = data.personalInfo.dateOfBirth.split("T")[0];
        }

        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("/api/profile/me", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profileData) return <p>No profile data</p>;

  return (
    <>
      {!editMode ? (
        <ProfileTabReadOnly profileData={profileData} onEdit={handleEdit} />
      ) : (
        <ProfileTabEdit
          initialData={profileData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ProfileTab;
