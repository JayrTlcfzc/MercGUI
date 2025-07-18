import React, { useState, useRef, useEffect } from "react";
import { FaUserLock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { encryptPassword } from '../../api/login'

export default function PasswordModal({ onProceed = () => {}, onClose = () => {} }) {

  const { t, i18n } = useTranslation();
  const [password, setPassword] = useState('');
  const inputRef = useRef(null); // Reference for the password input field

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (password) {

      const allocpassword = encryptPassword(password);
      const currentpassword = JSON.parse(localStorage.getItem('pow'));

      if (allocpassword === currentpassword){
        onProceed(); 
        onClose(); 
      }else {
        toast.error('Please enter a valid PASSWORD');
      }
     
    } else {
      toast.error('Please enter a valid PASSWORD');
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };  

  const handleChange = (e) => {
    setPassword(e.target.value); // Update the password state
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <div className="flex flex-row justify-center items-center">
          <FaUserLock className="text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-800 ml-2">{t('modal_authentication')}</h2>
        </div>

        <p className="text-gray-600 mb-6">
        {t('modal_please_enter_your')} <span className="font-bold">{t('modal_password')}</span>
        </p>

        {/* Controlled input for password */}
        <input
          type="password"
          ref={inputRef} // Attach the ref to the input
          className="mb-6 rounded shadow-outline border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-bg-blue-400 focus:border-transparent"
          placeholder="Password"
          value={password} 
          onChange={handleChange} 
          onKeyDown={handleEnterPress}
        />

        <div className="flex justify-center gap-4">
          <button
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
            onClick={handleSubmit}
          >
            {t('modal_proceed')}
          </button>
          <button
            className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
            onClick={onClose}
          >
            {t('modal_cancel')}
          </button>
        </div>
      </div>

      <ToastContainer />

    </div>
  );
}
