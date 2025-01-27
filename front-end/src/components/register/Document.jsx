import axios from "axios";
import React from "react";

const Document = ({ formData, setFormData, errors, debouncedValidation }) => {
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "account_management_preset"); // Replace with your Cloudinary preset

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dzfug6mj5/raw/upload",
        uploadData
      );

      const fileURL = res.data.secure_url;
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: fileURL, // เก็บ URL ของไฟล์ใน documents
        },
      }));

      debouncedValidation(name, fileURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-3 ml-4 font-medium text-gray-700">
            National ID Card
          </label>
          <input
            type="file"
            name="idCard" // ชื่อ key สำหรับเก็บไฟล์
            onChange={handleFileChange} // อัปเดตข้อมูลไฟล์
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-in-out 
                       "
          />
          {errors.idCard && (
            <div className="text-red-500 text-sm">{errors.idCard}</div>
          )}
        </div>
        <div>
          <label className="block mb-3 ml-4 font-medium text-gray-700">
            House Registration
          </label>
          <input
            type="file"
            name="houseRegistration"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-in-out"
          />
          {errors.houseRegistration && (
            <div className="text-red-500 text-sm">
              {errors.houseRegistration}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-3 ml-4 font-medium text-gray-700">
            Diploma / Certificate
          </label>
          <input
            type="file"
            name="diploma"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-in-out "
          />
          {errors.diploma && (
            <div className="text-red-500 text-sm">{errors.diploma}</div>
          )}
        </div>
        <div>
          <label className="block mb-3 ml-4 font-medium text-gray-700">
            Bank Account
          </label>
          <input
            type="file"
            name="bankAccount"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-in-out"
          />
          {errors.bankAccount && (
            <div className="text-red-500 text-sm">{errors.bankAccount}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Document;
