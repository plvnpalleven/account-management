// src/components/modals/ErrorModal.jsx
import React from "react";

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Registration Failed!
          </h2>
          <p className="text-gray-700 mb-6">
            {message || "Please check your info again"}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
