import React from "react";

const CandidateCard = ({
  id,
  name,
  profileImage,
  applicationStatus,
  onAccept,
  onReject,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg ml-2 mr-2">
      {/* Profile Info */}
      <div className="flex items-center gap-4">
        <img
          src={profileImage}
          alt={`${name}'s profile`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          {/* <p className="text-sm text-gray-500">{applicationStatus}</p> */}
        </div>
      </div>
      {/* Action button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAccept(id)}
          className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
        >
          ✓
        </button>
        <button
          onClick={() => onReject(id)}
          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
