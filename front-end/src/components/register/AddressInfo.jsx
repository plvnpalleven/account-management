import React from "react";

const AddressInfo = ({
  formData,
  setFormData,
  errors,
  debouncedValidation,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      addressInfo: {
        ...prev.addressInfo,
        [name]: value,
      },
    }));
    debouncedValidation(name,value);
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
            name="currentAddress" // กำหนด name ให้ตรงกับ key ใน personalInfo
            value={formData.addressInfo.currentAddress || ""} // ดึงค่าจาก formData.personalInfo.fullName
            onChange={handleChange} // อัปเดตค่าเมื่อผู้ใช้กรอกข้อมูล
            placeholder="Enter your current address"
            className={`w-full px-3 py-2 border ${
              errors.currentAddress ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.currentAddress && (
            <span className="text-red-500 text-sm">
              {errors.currentAddress}
            </span>
          )}
        </div>
        <div className="flex-[3]">
          <label className="block mb-2 font-medium text-gray-700">
            Village No.
          </label>
          <input
            type="text"
            name="villageNumber"
            value={formData.addressInfo.villageNumber || ""}
            onChange={handleChange}
            placeholder="Village No."
            className={`w-full px-3 py-2 border ${
              errors.villageNumber ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.villageNumber && (
            <span className="text-red-500 text-sm">{errors.villageNumber}</span>
          )}
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">
              Street Name
            </label>
            <input
              type="text"
              name="streetName"
              value={formData.addressInfo.streetName || ""}
              onChange={handleChange}
              placeholder="Enter your street name"
              className={`w-full px-3 py-2 border ${
                errors.streetName ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.streetName && (
              <span className="text-red-500 text-sm">{errors.streetName}</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">
              Sub District
            </label>
            <input
              type="text"
              name="subDistrict"
              value={formData.addressInfo.subDistrict || ""}
              onChange={handleChange}
              placeholder="Enter your Sub-district"
              className={`w-full px-3 py-2 border ${
                errors.subDistrict ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.subDistrict && (
              <span className="text-red-500 text-sm">{errors.subDistrict}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">
              Province
            </label>
            <input
              type="text"
              name="province"
              value={formData.addressInfo.province || ""}
              onChange={handleChange}
              placeholder="Enter your province"
              className={`w-full px-3 py-2 border ${
                errors.province ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.province && (
              <span className="text-red-500 text-sm">{errors.province}</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.addressInfo.postalCode || ""}
              onChange={handleChange}
              placeholder="Enter your postal code"
              className={`w-full px-3 py-2 border ${
                errors.postalCode ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.postalCode && (
              <span className="text-red-500 text-sm">{errors.postalCode}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
