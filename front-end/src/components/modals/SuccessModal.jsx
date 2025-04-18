import React from "react";

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <div className="flex items-center gap-4">
          <span>✔️</span>
          <span>{message}</span>
        </div>
        <div className="mt-4 text-right">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={() => {
              if (onClose) onClose(); // Logic สำหรับ redirect
            }}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
