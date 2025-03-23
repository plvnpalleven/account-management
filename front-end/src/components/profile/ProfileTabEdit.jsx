import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeEditSchema } from "../../schema/employeeEditSchema";
import { flattenObject } from "../../utils/flattenObject";
import axiosCloudinary from "../../utils/axiosCloudinary";
import axios from "../../utils/axios";
import ProfileImageUpload from "./ProfileImageUpload";

const ProfileTabEdit = ({ initialData, onSave, onCancel }) => {
  //state สำหรับเก็บ metadata (public_id , resource_type) ของไฟล์ที่อัปโหลด
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: initialData,
    resolver: zodResolver(employeeEditSchema),
    mode: "onBlur",
  });

  const [uploadedDocs, setUploadedDocs] = useState({});

  const currentProfileUrl = initialData.documents?.profilePicture?.secure_url || null;
  const handleProfileUpload = ({ secure_url, public_id, resource_type }) => {
    // setValue ใน react-hook-form
    // สมมติว่าเราจะเก็บที่ documents.profilePicture
    setValue(
      "documents.profilePicture",
      { secure_url, public_id, resource_type },
      { shouldDirty: true, shouldValidate: true }
    );

    // ถ้าใช้ uploadedDocs เพื่อ handleCancel
    setUploadedDocs((prev) => ({
      ...prev,
      profilePicture: { public_id, resource_type },
    }));
  };
  //ฟังก์ชันสำหรับ documents โดยเฉพาะเพื่อแสดง preview ไฟล์ที่อัปโหลดแล้ว
  const watchDocuments = watch("documents");

  //ฟังก์ชัน Immediate upload: จะทำงานทันทีที่เลือกไฟล์ (onChange)
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "account_management_preset");

    try {
      const res = await axiosCloudinary.post("/raw/upload", uploadData);
      const { secure_url, public_id, resource_type } = res.data;
      console.log(`${name} uploaded, URL: `, secure_url);

      //ใช้ setValue ใน react-hook-form เพื่ออัปเดตฟิลด์ documents.[name] ด้วย secure_url ที่ได้มา
      setValue(
        `documents.${name}`,
        { secure_url, public_id, resource_type },
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );

      setUploadedDocs((prev) => ({
        ...prev,
        [name]: { public_id, resource_type },
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  //ฟังก์ชัน hybrid เอาไว้รวม dirty fields กับเทียบค่า old/new (manual diff)
  const getHybridData = (newData, oldData, dirty) => {
    const updated = {};
    //วนลูปผ่าน key ใน dirtyFields เท่านั้น (field ที่เคยแก้)
    Object.keys(dirty).forEach((key) => {
      const isNestedObject =
        typeof dirty[key] === "object" &&
        dirty[key] !== null &&
        !Array.isArray(dirty[key]);

      if (isNestedObject) {
        //ถ้าเป็น object ซ้อน เช่น personal Info , address Info , ...
        const nestedChanges = getHybridData(
          newData[key],
          oldData[key] || {},
          dirty[key]
        );
        if (Object.keys(nestedChanges).length > 0) {
          updated[key] = nestedChanges;
        }
      } else {
        //ฟิลด์ที่ไม่ใช่ object
        //เช็คว่า newData กับ oldData ต่างกันจริงไหม?
        if (newData[key] !== oldData[key]) {
          updated[key] = newData[key];
        }
      }
    });
    return updated;
  };

  const onSubmit = async (data) => {
    console.log("Raw form data:", data);
    console.log("Dirty fields:", dirtyFields);

    for (const key in initialData.documents) {
      const oldDoc = initialData.documents[key];
      const newDoc = getValues(`documents.${key}`);

      //ใช้ deep equally เพื่อเปรียบเทียบ object
      if (oldDoc && JSON.stringify(oldDoc) !== JSON.stringify(newDoc)) {
        //ถ้าไฟล์เก่ามี public_id อยู่ ให้ลบไฟล์เก่าทิ้ง
        if (oldDoc.public_id) {
          try {
            await axios.delete("/api/delete-file", {
              data: {
                publicId: oldDoc.public_id,
                resource_type: oldDoc.resource_type,
              },
            });
            console.log(`Delete old ${key} file from cloudinary`);
          } catch (error) {
            console.error(`Error deleting old ${key} file:`, error);
          }
        }
      }
    }
    // สร้าง diff data จาก hybrid approach
    const diffData = getHybridData(data, initialData, dirtyFields);
    console.log("Diff data (before flatten):", diffData);

    // สร้าง Flatten diffData ให้เป็น dot-notation
    const flattenData = flattenObject(diffData);
    console.log("Flatten data to send:", flattenData);

    console.log("Form Data:", data); // ตรวจสอบค่าที่จะถูกส่งไป backend
    //ตอนแรกใช้ diffData แต่เปลี่ยนเป็น flattenData
    onSave(flattenData);
    // ส่งข้อมูลทั้งหมดที่แก้ไขใน form ไปให้ onSave
  };

  const onError = (formErrors) => {
    console.log("Form validation error:", formErrors);
  };

  const handleCancelWithDeletion = async () => {
    const promises = [];

    //iterates ผ่าน keys ที่มี metadata เก็บไว้
    for (const key in uploadedDocs) {
      const docValue = watchDocuments[key];
      //เปรียบเทียบว่าไฟล์ที่มีใน state metadata ไม่ตรงกับ initiaData หรือกับค่าปัจจุบันในฟอร์ม
      if (
        !initialData.documents?.[key] ||
        initialData.documents[key] !== getValues(`documents.${key}`)
      ) {
        const deletePromise = axios
          .delete("/api/delete-file", {
            data: {
              publicId: uploadedDocs[key].public_id,
              resource_type: uploadedDocs[key].resource_type,
            },
          })
          .then(() => {
            console.log(`Deleted ${key} file from cloudinary`);
          })
          .catch((error) => {
            console.error(`Error deleting ${key} file:`, error);
          });
        promises.push(deletePromise);
      }
    }

    try {
      await Promise.all(promises);
      console.log("All delete operations finished");
    } catch (err) {
      console.error("Some delete operations failed", err);
    }
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="p-4 space-y-6 max-h-[590px] overflow-y-auto custom-scrollbar"
    >
      
      <h2 className="text-3xl font-bold mb-2 text-center">Edit Profile</h2>
      <section className="max-w-4xl w-full mx-auto mb-4">
        <div className="flex items-center justify-center">
        <ProfileImageUpload
          initialValue={currentProfileUrl}
          onUpload={handleProfileUpload}
        />
        </div>
      </section>

      {/* Personal Info Section */}
      <section className="bg-gray-50 p-4 rounded shadow-profile-section max-w-4xl w-full mx-auto">
        <h4 className="text-2xl font-bold mb-2">Personal Info</h4>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="space-y-2">
            <label className="block font-semibold">First Name:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("personalInfo.firstName")}
            />
            {errors.personalInfo?.firstName && (
              <p className="text-red-500 text-sm">
                {errors.personalInfo.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Last Name:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("personalInfo.lastName")}
            />
            {errors.personalInfo?.lastName && (
              <p className="text-red-500 text-sm">
                {errors.personalInfo.lastName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Phone:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("personalInfo.phone")}
            />
            {errors.personalInfo?.phone && (
              <p className="text-red-500 text-sm">
                {errors.personalInfo.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("personalInfo.email")}
            />
            {errors.personalInfo?.email && (
              <p className="text-red-500 text-sm">
                {errors.personalInfo.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Age:</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("personalInfo.age")}
            />
            {errors.personalInfo?.age && (
              <p className="text-red-500 text-sm">
                {errors.personalInfo.age.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Date of Birth:</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("personalInfo.dateOfBirth")}
            />
            {errors.personalInfo?.dateOfBirth && (
              <p className="text-red-500 text-sm">
                {errors.personalInfo.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-gray-50 p-4 rounded shadow-profile-section max-w-4xl w-full mx-auto">
        <h4 className="text-2xl font-bold mb-2">Additional Info</h4>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="space-y-2">
            <label className="block font-semibold">Nationality:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("additionalInfo.nationality")}
            />
            {errors.additionalInfo?.nationality && (
              <p className="text-red-500 text-sm">
                {errors.additionalInfo.nationality.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Ethnicity:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("additionalInfo.ethnicity")}
            />
            {errors.additionalInfo?.ethnicity && (
              <p className="text-red-500 text-sm">
                {errors.additionalInfo.ethnicity.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Religion:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              {...register("additionalInfo.religion")}
            >
              <option value="">Select Religion</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Christianity">Christianity</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Other">Other</option>
            </select>
            {errors.additionalInfo?.religion && (
              <p className="text-red-500 text-sm">
                {errors.additionalInfo.religion.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Marital Status:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              {...register("additionalInfo.maritalStatus")}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Other">Other</option>
            </select>
            {errors.additionalInfo?.maritalStatus && (
              <p className="text-red-500 text-sm">
                {errors.additionalInfo.maritalStatus.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-semibold">Military Status:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              {...register("additionalInfo.militaryStatus")}
            >
              <option value="">Select Military Status</option>
              <option value="Exempted">Exempted</option>
              <option value="Reserve">Reserve</option>
              <option value="Not Yet Drafted">Not Yet Drafted</option>
              <option value="Other">Other</option>
            </select>
            {errors.additionalInfo?.militaryStatus && (
              <p className="text-red-500 text-sm">
                {errors.additionalInfo.militaryStatus.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Address Info Section */}
      <section className="bg-gray-50 p-4 rounded shadow-profile-section max-w-4xl w-full mx-auto">
        <h4 className="text-2xl font-bold mb-2">Address Info</h4>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="space-y-2">
            <label className="block font-semibold">Current Address:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("addressInfo.currentAddress")}
            />
            {errors.addressInfo?.currentAddress && (
              <p className="text-red-500 text-sm">
                {errors.addressInfo.currentAddress.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Street Name:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("addressInfo.streetName")}
            />
            {errors.addressInfo?.streetName && (
              <p className="text-red-500 text-sm">
                {errors.addressInfo.streetName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Province:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("addressInfo.province")}
            />
            {errors.addressInfo?.province && (
              <p className="text-red-500 text-sm">
                {errors.addressInfo.province.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Postal Code:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("addressInfo.postalCode")}
            />
            {errors.addressInfo?.postalCode && (
              <p className="text-red-500 text-sm">
                {errors.addressInfo.postalCode.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Sub District:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("addressInfo.subDistrict")}
            />
            {errors.addressInfo?.subDistrict && (
              <p className="text-red-500 text-sm">
                {errors.addressInfo.subDistrict.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Village:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("addressInfo.villageName")}
            />
            {errors.addressInfo?.villageName && (
              <p className="text-red-500 text-sm">
                {errors.addressInfo.villageName.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Job Info Section */}
      <section className="bg-gray-50 p-4 rounded shadow-profile-section max-w-4xl w-full mx-auto">
        <h4 className="text-2xl font-bold mb-2">Job Info</h4>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="space-y-2">
            <label className="block font-semibold">Position:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("jobInfo.position")}
            />
            {errors.jobInfo?.position && (
              <p className="text-red-500 text-sm">
                {errors.jobInfo.position.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">
              Expected Salary (per Month):
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("jobInfo.expectedSalary")}
            />
            {errors.jobInfo?.expectedSalary && (
              <p className="text-red-500 text-sm">
                {errors.jobInfo.expectedSalary.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="p-4 rounded shadow-profile-section max-w-4xl w-full mx-auto">
        <h4 className="text-2xl font-bold mb-2">Documents</h4>
        <div className="grid grid-cols-2 gap-4 text-lg">
          {[
            { label: "ID Card", name: "idCard" },
            { label: "House Registration", name: "houseRegistration" },
            { label: "Diploma", name: "diploma" },
            { label: "Bank Account", name: "bankAccount" },
          ].map(({ label, name }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold">{label}:</label>
              <input
                type="hidden"
                value={JSON.stringify(watchDocuments?.[name] || "")}
              />
              <input
                type="file"
                name={name}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-200 file:transition-all file:duration-300 file:ease-out"
              />
              {errors.documents?.[name] && (
                <p className="text-red-500 text-sm">
                  {errors.documents?.[name].message}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl w-full mx-auto flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancelWithDeletion}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileTabEdit;
