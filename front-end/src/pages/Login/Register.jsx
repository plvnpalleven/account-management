import React, { useState, useEffect } from "react";
import JobInfo from "../../components/register/JobInfo";
import PersonalInfo from "../../components/register/Personalnfo";
import AddressInfo from "../../components/register/AddressInfo";
import Document from "../../components/register/Document";
import Pagination from "../../components/register/Pagination";
import AddPersonalInfo from "../../components/register/AddPersonalInfo";

const Register = () => {
  const [currentTab, setCurrentTab] = useState(0); // Tab ปัจจุบัน
  const [isAnimating, setIsAnimating] = useState(false);

  const [formData, setFormData] = useState({
    jobInfo: {},
    personalInfo: {},
    additionalInfo: {},
    addressInfo: {},
    documents: [],
  });

  // Array ของแต่ละ Tab
  const tabs = [
    {
      name: "Job Info",
      component: <JobInfo formData={formData} setFormData={setFormData} />,
    },
    {
      name: "Personal Info",
      component: <PersonalInfo formData={formData} setFormData={setFormData} />,
    },
    {
      name: "Additional Info",
      component: (
        <AddPersonalInfo formData={formData} setFormData={setFormData} />
      ),
    },
    {
      name: "Address Info",
      component: <AddressInfo formData={formData} setFormData={setFormData} />,
    },
    {
      name: "Documents",
      component: <Document formData={formData} setFormData={setFormData} />,
    },
  ];

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300); // 300ms ตรงกับ duration ของ transition
    return () => clearTimeout(timer);
  }, [currentTab]);

  const handleSubmit = () => {
    const errors = [];
    const personalInfo = formData.personalInfo || {};
    if (!personalInfo.firstName) errors.push("First Name is required.");
    if (!personalInfo.lastName) errors.push("Last Name is required.");
    if (personalInfo.age && (personalInfo.age < 18 || personalInfo.age > 100)) {
      errors.push("Age must be between 18 and 100.");
    }
    if (personalInfo.phone && !/^\d+$/.test(personalInfo.phone)) {
      errors.push("Phone number must contain only digits.");
    }
    if (personalInfo.email && !/\S+@\S+\.\S+/.test(personalInfo.email)) {
      errors.push("Please enter a valid email address.");
    }

    // Validation for other sections can be added here...

    // Check if there are errors
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n\n${errors.join("\n")}`);
      return;
    }
    console.log("Submitted Data:", formData);
    alert("Register successfully");
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
