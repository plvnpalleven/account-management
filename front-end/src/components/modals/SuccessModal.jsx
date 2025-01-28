import React from "react";

const SuccessModal = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4 text-green-500">
            สมัครสำเร็จแล้ว!
          </h2>
          <p className="text-gray-700 mb-6">กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
          <button
            onClick={onRedirect}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            ไปหน้า Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
