import React, { useState, useEffect, useRef } from "react";
import { FaUserLock } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';

export default function PinModal({
  onProceed = () => {},
  handleClose = () => {},
}) {
  const { t, i18n } = useTranslation();
  const [pin, setPin] = useState(["", "", "", ""]);
  const firstInputRef = useRef(null); // Ref for the first input
  const [error, setError] = useState(false);

  // Autofocus on the first input field when the modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Focus on the first input when there's an error
  useEffect(() => {
    if (error && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [error]);

  const handleKeyDown = (e, index) => {
    // If backspace is pressed on an empty field, focus the previous one
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      document.getElementById(`pin-input-${index - 1}`).focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = () => {
    if (pin.length === 4 && pin.every((digit) => digit !== "")) {
      onProceed(pin.join(""));  // Pass the full PIN as a string
      handleClose(); 
    } else {
      toast.error('Please enter a valid PIN');
      setError(true);
      setPin(["", "", "", ""]);
    }
  };
  

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };  

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (error) {
      setError(false);
    }

    // If the value is not a number, do not update
    if (isNaN(value) && value !== "") return;

    // Update the PIN value at the corresponding index
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to the next input if the current field is filled
    if (value !== "" && index < pin.length - 1) {
      document.getElementById(`pin-input-${index + 1}`).focus();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <div className="flex flex-row justify-center items-center">
          <FaUserLock className="text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-800 ml-2">
          {t('modal_authentication')}
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
        {t('modal_please_enter_your')} <span className="font-bold">{t('modal_pin')}</span>
        </p>

        <div className="flex justify-center space-x-2 mb-4">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-input-${index}`}
              ref={index === 0 ? firstInputRef : null} // Attach ref to the first input
              type="password"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className={`w-12 h-12 text-center text-xl font-semibold border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 ${
                error ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
             className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
            onClick={handleSubmit}
          >
            {t('modal_proceed')}
          </button>
          <button
            className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
            onClick={handleClose}
          >
            {t('modal_cancel')}
          </button>
        </div>
      </div>

      <ToastContainer />

    </div>
  );
}
