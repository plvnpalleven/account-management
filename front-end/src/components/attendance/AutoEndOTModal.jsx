import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AutoEndOTModal = ({
  isOpen,
  onClose,
  onConfirmEnd,
  onExtend,
  gracePeriod = 600,
}) => {
  const [timeLeft, setTimeLeft] = useState(gracePeriod);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(gracePeriod);

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gracePeriod]);

  useEffect(() => {
    if (timeLeft <= 0 && isOpen) {
      //หมดเวลารอ : auto end OT
      toast("No response. OT will be ended automatically!");
      onConfirmEnd();
      onClose();
    }
  }, [timeLeft, isOpen, onConfirmEnd, onClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
      {/* Modal Content */}
      <div className="bg-white rounded-lg p-6 w-100 shadow-xl border border-gray-200 animate-fade-in">
        <div className="flex justify-center mb-2">
          <h2 className="text-3xl font-bold mb-2">OT Time is up!</h2>
        </div>
        {/* <p className="text-md font-semibold mb-2">
          Do you want to extend or end OT right now?
        </p> */}
        <div className="flex justify-center">
          <p className="text-4xl font-semibold mb-4">{formatTime(timeLeft)}</p>
        </div>
        <p className="text-xl font-semibold mb-4 text-red-500">Please proceed before time run out.</p>
        <div className="flex justify-between gap-2">
          <button
            className="flex-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={() => {
              onExtend();
              onClose();
            }}
          >
            Extend
          </button>
          <button
            className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={() => {
              onConfirmEnd();
              onClose();
            }}
          >
            Finish OT
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoEndOTModal;
