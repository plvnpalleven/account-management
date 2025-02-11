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
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {name}
          </h3>
          {/* <p className="text-sm text-gray-500">{applicationStatus}</p> */}
        </div>
      </div>
      {/* Action button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAccept(id)}
          className="w-10 h-10 flex items-center justify-center gap-1 bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-md transition-colors duration-150 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 active:bg-green-700"
          >
          ✓
        </button>
        <button
          onClick={() => onReject(id)}
          className="w-10 h-10 flex items-center justify-center gap-1 bg-red-500 text-white font-bold px-4 py-2 rounded-full shadow-md transition-colors duration-150 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 active:bg-red-700"
          >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
