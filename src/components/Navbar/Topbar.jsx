import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../Modals/changePasswordModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../Auth/authContext';

import { FcBusinessman } from "react-icons/fc";
import { US } from 'country-flag-icons/react/3x2';
import { FR } from 'country-flag-icons/react/3x2';

const Topbar = ({ handleMouseEnter, handleMouseLeave, userslevel, hoveredIcon, username, lastLogin }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [disableHover, setDisableHover] = useState(false);
    const dropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(); // Access i18n instance
    const { logout } = useAuth();
    
    // Toggle profile dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const userDropdownRef = useRef(null);

    const toggleLanguageDropdown = () => {
        setLanguageDropdownOpen(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                languageDropdownRef.current &&
                !languageDropdownRef.current.contains(event.target)
            ) {
                setLanguageDropdownOpen(false);
            }
            if (
                (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) &&
                (dropdownRef.current && !dropdownRef.current.contains(event.target))
            ) {
                setIsDropdownOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const currentLanguage = i18n.language;

   
    // Logout function
    const handleLogout = () => {
        logout();
        navigate('/login'); // Navigate to login page
    };

    // Handle change password modal close
    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setDisableHover(null);
    };

    return (
        <div className="ml-auto flex items-center space-x-2 text-lg">
            <div className="group relative" ref={userDropdownRef}>
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-transform duration-300 transform hover:scale-110 cursor-pointer"
                    onClick={toggleDropdown}
                    ref={dropdownRef}
                    onMouseEnter={() => {
                    if (!isChangePasswordModalOpen && !disableHover) {
                        handleMouseEnter("user");
                    }
                    }}
                    onMouseLeave={() => {
                    if (!isChangePasswordModalOpen && !disableHover) {
                        handleMouseLeave();
                    }
                    }}
                >
                    <FcBusinessman
                    size={28}
                    color={
                        disableHover || isChangePasswordModalOpen
                        ? "#D95F08"
                        : hoveredIcon === "user" || isDropdownOpen
                        ? "#FCAD74"
                        : "#D95F08"
                    }
                    />
                </div>

                {/* Dropdown menu */}
                <div
                    className={`absolute top-10 right-0 w-64 bg-[#fcfcfc] text-black shadow-lg rounded-tl-lg rounded-bl-3xl z-50 transition-all duration-300 transform ${
                    isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                    <div className="p-4 space-y-2">
                    <p className="font-bold text-lg">{username}</p>
                    <p className="font-bold text-base">{userslevel}</p>
                    <p className="text-sm">Last Login: {lastLogin}</p>

                    <button
                        onClick={() => {
                        setIsChangePasswordModalOpen(true);
                        handleMouseLeave();
                        }}
                        className="block w-full text-left mt-4 hover:text-indigo-600 transition-colors"
                    >
                        {t("change_password")}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="block w-full text-left hover:text-indigo-600 transition-colors"
                    >
                        {t("logout")}
                    </button>
                    </div>
                </div>
                </div>
           
             <div className="group relative">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-transform duration-300 transform hover:scale-110 cursor-pointer"
                            onClick={toggleLanguageDropdown}
                        >
                            {currentLanguage === 'en' ? (
                                <US title="English" className="w-5" />
                            ) : currentLanguage === 'fr' ? (
                                <FR title="French" className="w-5" />
                            ) : null}
                        </div>
                        {/* Language Dropdown Menu */}
                        <div ref={languageDropdownRef}
                            className={`absolute top-10 right-0 w-30 bg-white shadow-lg rounded-lg opacity-0 scale-95 transform transition-all duration-300 ${isLanguageDropdownOpen ? 'opacity-100 scale-100' : 'pointer-events-none'
                                }`}
                        >
                            <div className="flex items-center px-4 py-2 hover:bg-gradient-to-br from-blue-500 to-indigo-600 hover:text-white cursor-pointer" onClick={() => { changeLanguage('en'); setLanguageDropdownOpen(false); }}>
                                <US title="English" className="w-5 mr-2" />
                                <span className="text-gray-700 hover:text-white">English</span>
                            </div>
                            <div className="flex items-center px-4 py-2 hover:bg-gradient-to-br from-blue-500 to-indigo-600 hover:text-white cursor-pointer" onClick={() => { changeLanguage('fr'); setLanguageDropdownOpen(false); }}>
                                <FR title="France" className="w-5 mr-2" />
                                <span className="text-gray-700 hover:text-white">French</span>
                            </div>
                        </div>
                    </div>
            {isChangePasswordModalOpen && (
                <ChangePasswordModal handleClose={handleCloseChangePasswordModal} />
            )}

      

        </div>
    );
};

export default Topbar;
