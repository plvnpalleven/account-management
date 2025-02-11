import { useState, useEffect } from "react";
import axios from "../../../../back-end/axios";
import BoxApplicant from "../../components/recruitment/BoxApplicant";
import BoxInterview from "../../components/recruitment/BoxInterview";
import BoxApproved from "../../components/recruitment/BoxApproved";
import TabHeader from "../../components/TabHeader";
import BoxProbation from "../../components/recruitment/BoxProbation";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("Applicant"); // state สำหรับ tab ที่ active
  const [candidates, setCandidates] = useState([]);

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

  const mainTabs = [
    { label: "Applicant", value: "applicants" },
    { label: "Probation", value: "probation" },
  ];

  const profileTabs = {
    label: "Profile",
    value: "profile",
  };

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      <TabHeader
        mainTabs={mainTabs}
        profileTabs={profileTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className=" bg-white p-6 shadow-md  min-h-[640px]">
        {activeTab === "applicants" && (
          <div className="flex gap-4 h-[590px] w-full">
            <BoxApplicant
              candidates={candidates.filter(
                (c) => c.applicationStatus === "new"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <BoxInterview
              candidates={candidates.filter(
                (c) => c.applicationStatus === "Interview"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <BoxApproved
              candidates={candidates.filter(
                (c) => c.applicationStatus === "Approved"
              )}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </div>
        )}

        {activeTab === "probation" && (
          <div>
            <BoxProbation
              candidates={candidates.filter(
                (c) => c.applicationStatus === "Probation"
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
