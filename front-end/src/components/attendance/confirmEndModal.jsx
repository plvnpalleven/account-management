import React from "react";

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, remainingTime, type }) => {
  if (!isOpen) return null;

  // แปลง remainingTime (วินาที) ให้เป็น HH:MM:SS
  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  // กำหนดข้อความตามประเภท
  const modalText =
    type === "checkout"
      ? `คุณแน่ใจหรือไม่ว่าต้องการ Check Out? ตอนนี้เหลือเวลา ${formatTime(remainingTime)} ก่อนถึงเวลาเลิกงานปกติ`
      : `คุณแน่ใจหรือไม่ว่าต้องการสิ้นสุด OT? ตอนนี้เหลือเวลา ${formatTime(remainingTime)} ก่อนถึงเวลาเลิกงานปกติ`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {type === "checkout" ? "ยืนยัน Check Out?" : "ยืนยันการสิ้นสุด OT?"}
        </h2>
        <p className="text-gray-700 mb-4">{modalText}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
