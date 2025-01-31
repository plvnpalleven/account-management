import React, { useState, useEffect } from "react";
import JobInfo from "../../components/register/JobInfo";
import PersonalInfo from "../../components/register/Personalnfo";
import AddressInfo from "../../components/register/AddressInfo";
import Document from "../../components/register/Document";
import Pagination from "../../components/register/Pagination";
import AddPersonalInfo from "../../components/register/AddPersonalInfo";
import axios from "axios";
import { debounce } from "lodash";
// import { employeeInfoSchema } from "../../schema/employeeInfoSchema";
import {
  refinedAccountInfoSchema,
  employeeInfoSchema,
} from "../../schema/employeeInfoSchema";
import AccountInfo from "../../components/register/AccountInfo";
import { useNavigate } from "react-router-dom";
import RegisterSuccessModal from "../../components/modals/RegisterSuccessModal";
import RegisterFailedModal from "../../components/modals/RegisterFailedModal";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate(); // ใช้ navigate สำหรับเปลี่ยนหน้า

  const handleBack = () => {
    navigate("/login");
  };
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); //สองอันนี้ เป็น state สำหรับใช้กับ modal ที่เอาไว้ขึ้นตอน handle submit
  const [currentTab, setCurrentTab] = useState(0); // Tab ปัจจุบัน
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    accountInfo: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    jobInfo: {},
    personalInfo: {},
    additionalInfo: {},
    addressInfo: {},
    documents: {
      idCard: null,
      houseRegistration: null,
      diploma: null,
      bankAccount: null,
    },
  });

  const onError = () => {
    setIsError(true);
    setTimeout(() => setIsError(false), 500);
  };

  const validateTab = (tabIndex) => {
    try {
      if (tabIndex === 0) {
        employeeInfoSchema.shape.accountInfo.parse(formData.accountInfo);
      } else if (tabIndex === 1) {
        //Job Info
        employeeInfoSchema.shape.jobInfo.parse(formData.jobInfo);
      } else if (tabIndex === 2) {
        //Personal Info
        employeeInfoSchema.shape.personalInfo.parse(formData.personalInfo);
      } else if (tabIndex === 3) {
        //Additional Personal Info
        employeeInfoSchema.shape.additionalInfo.parse(formData.additionalInfo);
      } else if (tabIndex === 4) {
        //Address Info
        employeeInfoSchema.shape.addressInfo.parse(formData.addressInfo);
      } else if (tabIndex === 5) {
        employeeInfoSchema.shape.documents.parse(formData.documents);
      }
      return true;
    } catch (err) {
      if (err.name === "ZodError") {
        const { fieldErrors } = err.flatten();
        setErrors(fieldErrors); // อัปเดต errors state
      }
      return false;
    }
  };

  const shapesMap = [
    employeeInfoSchema.shape.accountInfo._def.schema.shape, //currentTab = 0
    employeeInfoSchema.shape.jobInfo,
    employeeInfoSchema.shape.personalInfo,
    employeeInfoSchema.shape.additionalInfo,
    employeeInfoSchema.shape.addressInfo,
    employeeInfoSchema.shape.documents,
  ];

  const handleValidation = async (key, value) => {
    const shape = shapesMap[currentTab]; // ดึง schema ของ tab ปัจจุบัน
    if (!shape) return;

    // อัปเดตค่าใน formData
    setFormData((prev) => ({
      ...prev,
      [tabs[currentTab].name.toLowerCase()]: {
        ...prev[tabs[currentTab].name.toLowerCase()],
        [key]: value,
      },
    }));

    try {
      // Validate เฉพาะ field ที่เปลี่ยนแปลง
      await shape[key].parseAsync(value);
      setErrors((prev) => ({ ...prev, [key]: null }));

      // เช็ค username และ email ซ้ำ
      if (key === "username" || key === "email") {
        const response = await axios.post(
          `http://localhost:5000/api/employees/check-${key}`,
          { [key]: value }
        );
        if (response.data.exists) {
          setErrors((prev) => ({
            ...prev,
            [key]: `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } already exists`,
          }));
        }
      }
    } catch (err) {
      if (err.name === "ZodError") {
        setErrors((prev) => ({
          ...prev,
          [key]: err.issues[0]?.message || "Invalid",
        }));
      }
    }

    // **เงื่อนไขพิเศษสำหรับ accountInfo**
    if (currentTab === 0) {
      try {
        await refinedAccountInfoSchema.parseAsync(formData.accountInfo); // Validate ทั้ง accountInfo
        setErrors((prev) => ({
          ...prev,
          confirmPassword: null, // ถ้า validate ผ่าน ให้ลบ error
        }));
      } catch (err) {
        if (err.name === "ZodError") {
          const fieldErrors = err.flatten().fieldErrors;
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
      }
    }

    // **Validate ทุก field ใน tab ปัจจุบัน**
    try {
      await shape.parseAsync(formData[tabs[currentTab].name.toLowerCase()]);
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        Object.keys(shape).forEach((field) => {
          updatedErrors[field] = null;
        });
        return updatedErrors;
      });
    } catch (err) {
      if (err.name === "ZodError") {
        const fieldErrors = err.flatten().fieldErrors;
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    }
  };

  // Debounce validation เพื่อไม่ให้ validate ทุก keypress
  const debouncedValidation = debounce((key, value) => {
    handleValidation(key, value);
  }, 200);

  const tabs = [
    {
      name: "Register",
      component: (
        <AccountInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          debouncedValidation={debouncedValidation}
        />
      ),
    },
    {
      name: "Job Info",
      component: (
        <JobInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          debouncedValidation={debouncedValidation}
        />
      ),
    },
    {
      name: "Personal Info",
      component: (
        <PersonalInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          debouncedValidation={debouncedValidation}
        />
      ),
    },
    {
      name: "Additional Info",
      component: (
        <AddPersonalInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          debouncedValidation={debouncedValidation}
        />
      ),
    },
    {
      name: "Address Info",
      component: (
        <AddressInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          debouncedValidation={debouncedValidation}
        />
      ),
    },
    {
      name: "Documents",
      component: (
        <Document
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          debouncedValidation={debouncedValidation}
        />
      ),
    },
  ];

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300); // 300ms ตรงกับ duration ของ transition
    return () => clearTimeout(timer);
  }, [currentTab]);

  const handleSubmit = async () => {
    try {
      // ตรวจสอบข้อมูลทั้งฟอร์มก่อน
      employeeInfoSchema.parse(formData);
      // ถ้าparseผ่านค่อยยิง axios ต่อ
      const response = await axios.post(
        "http://localhost:5000/api/employees/register",
        formData
      );
      toast.success("Registration Successful! Redirecting to Login...");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
      console.log("Response from server:", response.data);
    } catch (error) {
      // toast.error("Registration failed. Please enter your info before submit!");
      // console.error("Error during registration:", error);
      if (error.name === "ZodError") {
        const { fieldErrors } = error.flatten();
        setErrors(fieldErrors);
        toast.error("Please fill all fields in the form before submitting!");
      } else {
        //ถ้าเป็น error อื่นๆ เช่น 500 , network error ก็จัดการตามสมควร
        toast.error("Registration failed. Please try again.");
        console.error("Error during registration", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`w-[500px] bg-white p-6 rounded-lg shadow-md flex flex-col transition-all duration-300 ease-in-out
          ${
            isAnimating
              ? "border-2 border-green-500"
              : "border-2 border-gray-300"
          }
          ${isError ? "border-2 border-red-500 animate-shake" : ""}
          
          `}
      >
        <div className="flex flex-col justify-between gap-4">
          <h2 className="text-4xl font-bold mb-4 text-start">
            {tabs[currentTab].name}
          </h2>
          <div>{tabs[currentTab].component}</div>
        </div>
        <div>
          <div className="flex justify-center mt-1 items-center">
            <Pagination
              className="items-center"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              totalTabs={tabs.length}
              validateTab={validateTab}
              onError={onError}
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleBack}
              className="flex-[5] mt-4 bg-green-500 text-white text-xl font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[5] mt-4 bg-green-500 text-white text-xl font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {isSuccessModalOpen && (
        <RegisterSuccessModal
          message="Registration Successful!"
          onClose={() => {
            setIsSuccessModalOpen(false);
            navigate("/login"); // Redirect to login page
          }}
        />
      )}

      {/* Error Modal */}
      {isErrorModalOpen && (
        <RegisterFailedModal
          message="Failed to register. Please try again."
          onClose={() => setIsErrorModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Register;
