import React, { useRef, useState } from "react";
import axiosCloudinary from "../../../../back-end/axiosCloudinary";
import EditIcon from "@mui/icons-material/Edit";

const ProfileImageUpload = ({ initialValue, onUpload }) => {
  const [previewUrl, setPreviewUrl] = useState(initialValue);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // สร้าง preview ชั่วคราว
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // อัปโหลดไป Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "account_management_preset");

    try {
      const res = await axiosCloudinary.post("/raw/upload", formData);
      const { secure_url, public_id, resource_type } = res.data;
      console.log("Profile image uploaded:", secure_url);

      // ส่งข้อมูลกลับไป Parent
      onUpload({ secure_url, public_id, resource_type });
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <div className="relative w-28 h-28 group">
      {/* รูปโปรไฟล์ */}
      <img
        src={previewUrl || "/images/default-profile.png"}
        alt="Profile"
        className="w-28 h-28 object-cover rounded-full border border-gray-300"
      />

      {/* Overlay ที่จะแสดงเมื่อ hover */}
      <div
        className="absolute inset-0 bg-black bg-opacity-0
                   flex items-center justify-center
                   rounded-full
                   transition-all duration-200
                   cursor-pointer
                   group-hover:bg-opacity-50"
        onClick={handleFileSelect}
      >
        {/* ไอคอนดินสอ จะโผล่มาตอน hover */}
        <EditIcon
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ fontSize: 24 }}
        />
      </div>

      {/* Input file ซ่อน */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;
