import { useState, useEffect, useContext } from "react";
import axios from "../../../../back-end/axios";
import { AuthContext } from "../../context/AuthContext";

import TabHeader from "../../components/TabHeader";
import RecruitSearch from "../../components/recruitment/RecruitSearch";
import ProfileModal from "../../components/recruitment/ProfileModal";
import ProfileTab from "../../components/ProfileTab";

import BoxApplicant from "../../components/recruitment/BoxApplicant";
import BoxInterview from "../../components/recruitment/BoxInterview";
import BoxApproved from "../../components/recruitment/BoxApproved";
import BoxProbation from "../../components/recruitment/BoxProbation";

const Recruitment = () => {
  const { user, loading } = useContext(AuthContext);

  //State
  const [activeTab, setActiveTab] = useState("applicants"); // state สำหรับ tab ที่ active
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // state สำหรับเก็บค่า search
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  //Fetch Candidates
  useEffect(() => {
    if (!user || loading) return;
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/api/recruit", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, [user, loading]);

  const handleAccept = async (id, newStatus) => {
    try {
      const updateData = { applicationStatus: newStatus };

      if (newStatus === "probation" || newStatus === "employee") {
        updateData.accessStatus = "granted";
      } else {
        updateData.accessStatus = "pending";
      }

      const response = await axios.patch(
        `/api/recruit/${id}/status`,
        updateData
      );
      const updatedCandidate = response.data;

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === id
            ? {
                ...candidate,
                applicationStatus: updatedCandidate.applicationStatus,
                accessStatus:
                  updatedCandidate.accessStatus || candidate.accessStatus,
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
      const updateData = {
        accessStatus: "revoked", //revoked = login ไม่ได้
      };

      //เปลี่ยนapplication status เป็น rejected
      updateData.applicationStatus = "rejected";

      const response = await axios.patch(
        `/api/recruit/${id}/status`,
        updateData
      );
      const updatedCandidate = response.data;

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === id
            ? {
                ...candidate,
                applicationStatus: updatedCandidate.applicationStatus,
                accessStatus: updatedCandidate.accessStatus,
              }
            : candidate
        )
      );
    } catch (error) {
      console.error("Error rejecting candidate:", error);
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

  const pageTabs = [
    { label: "Applicant", value: "applicants" },
    { label: "Probation", value: "probation" },
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-300 min-h-screen">
      {/* ใช้ TabHeader ส่ง pageTabs */}
      <TabHeader
        pageTabs={pageTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 bg-white p-6 shadow-md max-h-screen overflow-hidden">
        {/* ทำให้เห็นก็ต่อเมื่อไม่เป็น Profile */}
        {activeTab !== "profile" && (
          <RecruitSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}

        {/* สลับแสดง BoxApplicant/Interview/Approved/Probation ตามแท็บ */}
        {activeTab === "applicants" && (
          <div className="flex gap-4 h-[530px] w-full mt-4">
            <BoxApplicant
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "new"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
              onClick={(candidate) => setSelectedCandidate(candidate)}
            />
            <BoxInterview
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "interview"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
              onClick={(candidate) => setSelectedCandidate(candidate)}
            />
            <BoxApproved
              candidates={filteredCandidates.filter(
                (c) => c.applicationStatus === "approved"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
              onClick={(candidate) => setSelectedCandidate(candidate)}
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
              onClick={(candidate) => setSelectedCandidate(candidate)}
            />
          </div>
        )}
        
        {activeTab === "profile" && <ProfileTab user={user} />}
      </div>
      {selectedCandidate && (
        <ProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default Recruitment;
