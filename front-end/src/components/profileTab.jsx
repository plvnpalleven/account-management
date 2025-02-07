import React from "react";

const profileTab = () => {
  return (
    <div className="w-[800px] h-[560px]">
      <h2 className="text-xl font-bold mb-4">HR Section</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between bg-yellow-100 p-4 rounded shadow">
          <p>Firstname Lastname</p>
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-2 py-1 rounded">
              ✓
            </button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profileTab;
