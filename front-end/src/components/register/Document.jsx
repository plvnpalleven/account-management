import axiosCloudinary from "../../../../back-end/axiosCloudinary";
import React from "react";

const Document = ({ formData, setFormData, errors, debouncedValidation }) => {
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "account_management_preset"); 
      const res = await axiosCloudinary.post("/raw/upload", uploadData);

      console.log("Cloudinary response:", res.data);

      //เพิ่มการ destructuring
      const { secure_url, public_id, resource_type } = res.data;
      console.log("public_id =>", public_id, "resource_type =>", resource_type);

      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: {
            secure_url,
            public_id: public_id || "",
            resource_type: resource_type || "",
          },
        },
      }));

      debouncedValidation(name, {
        secure_url,
        public_id:public_id || "",
        resource_type:resource_type || "",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-3 ml-4 font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-in-out"
          />
          {errors.profilePicture && (
            <div className="text-red-500 text-sm">{errors.profilePicture}</div>
          )}
        </div>
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
