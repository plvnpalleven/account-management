import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const RecruitSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-[70vh]">
      <input 
        type="text"
        value={searchTerm}
        onChange={(e)=> onSearchChange(e.target.value)}
        placeholder="Search...."
        className="ml-2 outline-none w-full"
      />
       <SearchIcon className="text-gray-500"/>
    </div>
  );
};

export default RecruitSearch;
