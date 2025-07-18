import React, { useState, useRef, useEffect } from "react";
import LoginImage from "../assets/LoginImage.png";
import OTPModal from "../components/Modals/OTPModal";
import { HandleChange, HandleChangeDigitsOnly } from "../components/Validations";
import { toast, ToastContainer } from "react-toastify";

import { useTranslation } from 'react-i18next';
import { verifyCredentials, verifyOTP } from "../api/login";
import changePassword from "../api/changepassword";
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from "../components/Auth/authContext";
import ChangePasswordModal from '../components/Modals/changePasswordModal';
import Loadingmodal from '../components/Modals/Loadingmodal';
import { US } from 'country-flag-icons/react/3x2';
import { FR } from 'country-flag-icons/react/3x2';
import logo from "../assets/nufinlogo.png";

const Login = () => {

  const initialFormData = {
    msisdn: '',
    username: '',
    password: ''
  };

//test
  const [otpFromServer, setOtpFromServer] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = formData.msisdn && formData.username && formData.password;
  
    if (isFormValid) {
      setLoading(true);
      try {
        const { success, message, otp } = await verifyCredentials(
          formData.msisdn,
          formData.username,
          formData.password
        );
  
        if (success) {
          setLoading(false);
          setOtpFromServer(otp); // Store OTP sent by mock server
          setOpenModal("OTPModal"); // Open OTP modal
        }else{
          setLoading(false);
          toast.error(message);
        
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.message || "Login Error");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };  

  const languageDropdownRef = useRef(null);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const toggleLanguageDropdown = () => setLanguageDropdownOpen(prevState => !prevState);

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
              setLanguageDropdownOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { t, i18n } = useTranslation();
  const changeLanguage = (language) => i18n.changeLanguage(language);
  const currentLanguage = i18n.language;

 
  // Dropdown closing state handler
  const handleClickOutside = (event) => {
    if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
      setLanguageDropdownOpen(false);
    }
  };

  // Event Listener to detect clicks outside dropdowns
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      {loading && <Loadingmodal />}
  
      <div className="flex w-full max-w-6xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden h-[550px]">
        
        {/* Left Section: Image */}
        <div className="w-1/2 hidden lg:flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="relative w-full h-full bg-center bg-cover">
            <img src={LoginImage} alt="Login Illustration" className="w-full h-full object-cover" />
          </div>
        </div>
  
        {/* Right Section: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-8 bg-white">
          <div className="mb-5">
            <img src={logo} alt="Logo" className="w-24 object-contain" />
          </div>
          <div className="w-full md:px-6">
            <h2 className="text-2xl font-extrabold text-center text-blue-800 mb-4">Merchant Login</h2>
            <form className="space-y-4">
              {/* MSISDN */}
              <div>
                <label htmlFor="msisdn" className="block font-medium text-gray-700">{t("msisdn")}</label>
                <input
                  type="text"
                  id="msisdn"
                  name="msisdn"
                  value={formData.msisdn}
                  onChange={HandleChangeDigitsOnly(setFormData)}
                  onKeyDown={handleEnterPress}
                  placeholder={t("Enter your MSISDN")}
                  className="p-2 text-sm w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
  
              {/* Username */}
              <div>
                <label htmlFor="username" className="block font-medium text-gray-700">{t("username")}</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={HandleChange(setFormData)}
                  onKeyDown={handleEnterPress}
                  placeholder={t("Enter your username")}
                  className="p-2 text-sm w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
  
              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-medium text-gray-700">{t("login_password")}</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={HandleChange(setFormData)}
                  onKeyDown={handleEnterPress}
                  placeholder="********************"
                  className="p-2 text-sm w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
  
              {/* Show Password */}
            
  
              {/* Language + Forgot Password */}
              <div className="flex justify-between items-center">
                <div className="relative group flex items-center">
                  <label className="text-gray-700 mr-2">{t("generic_label_language")}:</label>
                  <div
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                    onClick={toggleLanguageDropdown}
                  >
                    {currentLanguage === 'en' ? <US className="w-5" /> : <FR className="w-5" />}
                  </div>
                  {isLanguageDropdownOpen && (
                    <div
                      ref={languageDropdownRef}
                      className="absolute top-10 right-0 w-30 bg-white shadow-lg rounded-lg z-50"
                    >
                      <div className="flex items-center px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer" 
                      onClick={() => {
                          changeLanguage('en');
                          setLanguageDropdownOpen(false);
                        }}>
                        <US className="w-5 mr-2" /> English
                      </div>
                      <div className="flex items-center px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer" 
                      onClick={() => {
                          changeLanguage('fr');
                          setLanguageDropdownOpen(false);
                        }}>
                        <FR className="w-5 mr-2" /> French
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                  className="mr-2 w-4 h-4 cursor-pointer rounded"
                />
                <label>{t('login_show_password')}</label>
              </div>
              </div>
  
              {/* Submit Button */}
              <div>
              <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-none hover:bg-blue-400 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg"
                  >

                  {t("login")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      {/* OTP Modal */}
      {openModal === "OTPModal" && (
        <OTPModal
          onProceed={async (enteredOtp) => {
            try {
              const { success, message, data } = await verifyOTP(
                enteredOtp,
                formData.msisdn,
                formData.username,
                formData.password
              );
  
              if (success) {
                // toast.success(message);
                if (
                  message === "Password expired. Please use forgot password or contact the administrator." ||
                  data.isfirstlogon === "1"
                ) {
                  setOpenModal("");
                  setOpenModal("ChangePasswordModal");
                } else {
                  login();
                  setOpenModal("");
                  navigate("/dashboard");
                }
              } else {
                toast.error(message);
              }
            } catch (error) {
              toast.error(error.message || "Invalid OTP");
            }
          }}
          handleClose={() => setOpenModal("")}
        />
      )}
  
      {/* Change Password Modal */}
      {openModal === "ChangePasswordModal" && (
        <ChangePasswordModal
          onSubmit={async (newPassword) => {
            try {
              const { success, message } = await changePassword(oldPassword, newPassword);
              if (success) {
                toast.success(message || "Password changed successfully");
                setOpenModal("");
              } else {
                toast.error(message || "Failed to change password");
              }
            } catch (error) {
              toast.error(error.message || "Error changing password");
            }
          }}
          handleClose={() => setOpenModal("")}
        />
      )}
    </div>
  );
  
};

export default Login;
