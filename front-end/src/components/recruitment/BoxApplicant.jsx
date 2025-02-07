import React from "react";
import CandidateCard from "./CandidateCard";

const BoxApplicant = ({ candidates, onAccept, onReject }) => {
  return (
    <div className="w-[300px] bg-gray-100 shadow rounded-lg p-4">
      <div className="bg-blue-400 text-white text-center py-2 rounded-t-lg font-semibold">
        New Applicant
      </div>
      <div className="mt-4 space-y-4">
        {candidates.length > 0 ?(
            candidates.map((candidate)=>(
                <CandidateCard
                    key={candidate._id}
                    id={candidate._id}
                    name={`${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`}
                    profileImage={candidate.documents.profileImage}
                    applicationStatus={candidate.applicationStatus}
                    onAccept={()=>onAccept(candidate._id,"รอสัมภาษณ์")}
                    onReject={()=>onReject(candidate._id)}
                />
            ))
        ):(
            <p className="text-center text-gray-500">ไม่มีผู้สมัคร</p>
        )}
      </div>
    </div>
  );
};

export default BoxApplicant;
