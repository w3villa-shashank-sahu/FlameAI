import React, { useState } from "react";

const ModalWithInput = ({ isOpen, onClose, onSend }) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0007]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold">Enter Your Email</h2>
        <p className="text-sm font-light mb-4">We will send a reset link to your email</p>

        <input
          type="text"
          placeholder="Type here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button 
            onClick={() => {
              onSend(inputValue);
              setInputValue(""); // Clear input field after sending
            }} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWithInput;
