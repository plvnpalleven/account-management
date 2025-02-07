import { useState, useEffect } from "react";
import axios from "../../../../back-end/axios";
import BoxApplicant from "../../components/recruitment/BoxApplicant";
import BoxInterview from "../../components/recruitment/BoxInterview";
import BoxApproved from "../../components/recruitment/BoxApproved";

import logo from "../../assets/logo.png"; // อันนี้แค่เทสน่ะ
import ff from "../../assets/ff.jpg";
import TabHeader from "../../components/TabHeader";
const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("employee"); // state สำหรับ tab ที่ active
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/employees");
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleAccept = async (id, newStatus) => {
    try {
      const response = await axios.patch(`/employees/${id}/status`, {
        newStatus,
      });
      const updatedCandidate = response.datal;

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

  const handleReject = async (id) =>{
    try{
      await axios.delete(`/employees/${id}`);
      setCandidates((prev)=>prev.filter((candidate)=>candidate._id !== id));
    }catch(error){
      console.error("Error deleting candidate:",error); 
    }
  };


  return (
    <div className="flex gap-4 p-8">
      <BoxApplicant
        candidates={candidates.filter((c)=>c.applicationStatus === "สมัครใหม่")}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <BoxInterview
        candidates={candidates.filter((c)=>c.applicationStatus === "รอสัมภาษณ์")}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <BoxApproved
        candidates={candidates.filter((c)=>c.applicationStatus === "ผ่านการสัมภาษณ์")}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
};

export default Recruitment;
