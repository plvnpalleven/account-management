import { useState, useEffect } from "react";
import axios from "../../../../back-end/axios";
import BoxApplicant from "../../components/recruitment/BoxApplicant";
import BoxInterview from "../../components/recruitment/BoxInterview";
import BoxApproved from "../../components/recruitment/BoxApproved";
import TabHeader from "../../components/TabHeader";
import BoxProbation from "../../components/recruitment/BoxProbation";
import RecruitSearch from "../../components/recruitment/RecruitSearch";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("Applicant"); // state สำหรับ tab ที่ active
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // state สำหรับเก็บค่า search

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/api/recruit");
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleAccept = async (id, newStatus) => {
    try {
      const response = await axios.patch(`/api/recruit/${id}/status`, {
        newStatus,
      });
      const updatedCandidate = response.data;

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === id
            ? {
                ...candidate,
                applicationStatus: updatedCandidate.applicationStatus,
              }
            : candidate
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`/employees/${id}`);
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== id));
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  // กรอง candidates โดยตรวจสอบชื่อและนามสกุล (แปลงเป็น lowercase เพื่อความแม่นยำ)
  const filteredCandidates = candidates.filter((candidate) => {
    const firstName = candidate.personalInfo.firstName.toLowerCase();
    const lastName = candidate.personalInfo.lastName.toLowerCase();
    const fullName = `${firstName} ${lastName}`; // รวมชื่อและนามสกุล
    const term = searchTerm.toLowerCase();
    return fullName.includes(term); // ตรวจสอบ fullName ว่ามี term หรือไม่
  });

  const mainTabs = [
    { label: "Applicant", value: "applicants" },
    { label: "Probation", value: "probation" },
  ];

  const profileTabs = {
    label: "Profile",
    value: "profile",
  };

  return (
    <div className="flex flex-col p-6 bg-gray-300 min-h-screen">
      <TabHeader
        mainTabs={mainTabs}
        profileTabs={profileTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 bg-white p-6 shadow-md max-h-screen overflow-hidden">
        {/* ส่งค่า searchTerm และฟังก์ชัน setSearchTerm ไปให้ RecruitSearch */}
        <RecruitSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {activeTab === "applicants" && (
          <div className="flex gap-4 h-[530px] w-full mt-4">
            <BoxApplicant
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "new"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <BoxInterview
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "interview"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <BoxApproved
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "approved"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </div>
        )}

        {activeTab === "probation" && (
          <div className="flex gap-4 h-[530px] w-full mt-4">
            <BoxProbation
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "probation"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruitment;
