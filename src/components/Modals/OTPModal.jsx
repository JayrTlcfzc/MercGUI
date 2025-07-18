import React, { useState, useRef, useEffect } from "react";
import { FaUserLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";

export default function OTPModal({
  onProceed = () => {},
  handleClose = () => {},
  otpBatchFiles
}) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const firstInputRef = useRef(null);
  const [error, setError] = useState(false);
  const [remarksError, setRemarksError] = useState(false);

  const initialFormData = {
    remarks: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset remarks error when user starts typing
    if (name === "remarks") {
      setRemarksError(false);
    }
  };

  // Autofocus the first input field when the modal opens
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

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Reset error state on change
    if (error) {
      setError(false);
    }

    // Only allow numeric input
    if (isNaN(value) && value !== "") return;

    // Update OTP at the current index
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if the current one is filled
    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // If backspace is pressed on an empty field, focus the previous one
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = () => {
    if (otp.every((digit) => digit !== "")) {
      // Check for empty remarks if otpBatchFiles is true
      if (otpBatchFiles && !formData.remarks.trim()) {
        setRemarksError(true);
        toast.error("Remarks cannot be empty.");

        // Focus the remarks input
        const remarksInput = document.getElementById("remarks");
        if (remarksInput) {
          remarksInput.focus();
        }
        return;
      }
  
      if (otpBatchFiles) {
        onProceed(otp.join(""), formData.remarks); // Pass concatenated OTP and Remarks
      } else {
        onProceed(otp.join("")); // Pass concatenated OTP
      }
  
      handleClose();
    } else {
      setError(true);
      setOtp(["", "", "", "", "", ""]);
      toast.error(t("valid_pin"));
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <div className="flex flex-row justify-center items-center">
          <FaUserLock className="text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-800 ml-2">
            {t("modal_authentication")}
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          {t("modal_please_enter_your")}{" "}
          <span className="font-bold">{t("modal_one_time_password")}</span>
        </p>

        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              ref={index === 0 ? firstInputRef : null}
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

        {otpBatchFiles && (
          <div className="flex flex-col justify-center space-x-2 mb-4">
            <label htmlFor="remarks" className="text-gray-600 font-semibold mb-1">
            {t("remarks")}
            </label>
            <input
              id="remarks"
              name="remarks"
              type="text"
              value={formData.remarks}
              onChange={handleInputChange}
              className={`mt-1 p-2 w-full border ${
                remarksError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 ${
                remarksError ? "focus:ring-red-500" : "focus:ring-bg-blue-400"
              }`}
              placeholder="Remarks"
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
             className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
            onClick={handleSubmit}
          >
            {t("modal_proceed")}
          </button>
          <button
            className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
            onClick={handleClose}
          >
            {t("modal_cancel")}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
