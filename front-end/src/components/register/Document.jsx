import React from "react";

const Document = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    const { name, files } = e.target; // ดึง name และไฟล์จาก input
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: files[0], // เก็บเฉพาะไฟล์แรกที่ผู้ใช้อัปโหลด
      },
    }));
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
                       hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-in-out"
          />
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
        </div>
      </div>
    </div>
  );
};

export default Document;
