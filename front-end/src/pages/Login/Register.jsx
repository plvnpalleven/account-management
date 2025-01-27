  import React, { useState, useEffect } from "react";
  import JobInfo from "../../components/register/JobInfo";
  import PersonalInfo from "../../components/register/Personalnfo";
  import AddressInfo from "../../components/register/AddressInfo";
  import Document from "../../components/register/Document";
  import Pagination from "../../components/register/Pagination";
  import AddPersonalInfo from "../../components/register/AddPersonalInfo";
  import axios from "axios";
  import { debounce } from "lodash";
  import { employeeInfoSchema } from "../../schema/employeeInfoSchema";

  const Register = () => {
    const [currentTab, setCurrentTab] = useState(0); // Tab ปัจจุบัน
    const [isAnimating, setIsAnimating] = useState(false);
    const [errors, setErrors] = useState({});
    const [isErrors,setIsErrors] = useState(false);
    const [formData, setFormData] = useState({
    
      jobInfo: {},
      personalInfo: {},
      additionalInfo: {},
      addressInfo: {},
      documents: {
        idCard:"",
        houseRegistration:"",
        diploma:"",
        bankAccount:"",
      },
    });

    const validateTab = (tabIndex) =>{
      try{
        if(tabIndex === 0){
          //Job Info
          employeeInfoSchema.shape.jobInfo.parse(formData.jobInfo);
        }else if(tabIndex ===1 ){
          //Personal Info
          employeeInfoSchema.shape.personalInfo.parse(formData.personalInfo);
        }else if(tabIndex ===2 ){
          //Additional Personal Info
          employeeInfoSchema.shape.additionalInfo.parse(formData.additionalInfo);
        }else if(tabIndex ===3 ){
          //Address Info
          employeeInfoSchema.shape.addressInfo.parse(formData.addressInfo);
        }else if(tabIndex ===4){
          employeeInfoSchema.shape.documents.parse(formData.documents);
        }
        return true;
      } catch(err){
        if(err.name === "ZodError"){
          // เก็บ error ลงในstate `errors` เพื่อแสดงกรอบแดง / ข้อความ
          // ใช้ err.flatten() หรือ err.issues
          const {fieldErrors} = err.flatten();
          //สร้าง obj เพื่อใส่ใน setErrors
          const newErrors = {};
          for(const path in fieldErrors){
            newErrors[path] = fieldErrors[path][0];
          }
          setErrors(newErrors);
        }
        return false; //แปลว่ามี error
      }
    };


    const shapesMap = [
      employeeInfoSchema.shape.jobInfo.shape, //currentTab = 0
      employeeInfoSchema.shape.personalInfo.shape,
      employeeInfoSchema.shape.additionalInfo.shape,
      employeeInfoSchema.shape.addressInfo.shape,
      employeeInfoSchema.shape.documents.shape,
    ];

    const handleValidation = async (key,value) => {
      const shape = shapesMap[currentTab];
      if(!shape)return;

      const fieldSchema = shape[key];
      if(!fieldSchema)return; // ถ้า field ไม่อยู่ใน shape
      
      try{
        await fieldSchema.parseAsync(value);
        setErrors((prev)=>({...prev,[key]:null}));
      }catch(err){
        if(err.name === "ZodError"){
          const message = err.issues[0]?.message || "Invalid";
          setErrors((prev)=>({...prev,[key]:message}));
        }
      }
    };

    const debouncedValidation = debounce((key, value) => {
      handleValidation(key, value);
    }, 200);

    const tabs = [
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
      console.log("handleSubmit is called"); // ตรวจสอบว่าถูกเรียกใช้งาน
      console.log("Submitted Data:", JSON.stringify(formData, null, 2));

      

      try {
        const response = await axios.post(
          "http://localhost:5000/api/employees/register",
          formData
        );
        alert("Registration Successful!");
        console.log("Response from server:", response.data);
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Failed to register. Please try again.");
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div
          className={`w-[500px] bg-white p-6 rounded-lg shadow-md flex flex-col transition-all duration-300 ease-in-out ${
            isAnimating ? "border-2 border-green-500" : "border-2 border-gray-300"
          }`}
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
              />  
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-[400px] mt-4 bg-green-500 text-white text-xl font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Register;
