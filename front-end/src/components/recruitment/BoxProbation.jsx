import React from "react";
import CandidateCard from "./CandidateCard";

const BoxProbation = ({ candidates, onAccept, onReject }) => {
  return (
    <div className="flex flex-col h-full w-[394.4px] bg-gray-100 shadow rounded-lg">
      <div className="bg-recruitHeader text-white text-center py-2 rounded-t-lg font-semibold">
        Probation
      </div>
      <div className="custom-scrollbar mt-4  mb-4 space-y-4 overflow-y-auto px-2">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              id={candidate._id}
              name={`${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`}
              profileImage={candidate.documents.profilePicture}
              applicationStatus={candidate.applicationStatus}
              onAccept={() => onAccept(candidate._id, "employee")}
              onReject={() => onReject(candidate._id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">ไม่มีผู้สมัคร</p>
        )}
      </div>
    </div>
  );
};

export default BoxProbation;
