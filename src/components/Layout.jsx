import React, { useState, useEffect } from "react";
import Sidebar from "./Navbar/Sidebar";
import Logo from '../assets/nufinlogo.png';
import Topbar from "./Navbar/Topbar";
import { useTranslation } from 'react-i18next';

// Function to format date and time to 12-hour format
const formatDateTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
};

const Layout = ({ children }) => {
  const storedData = JSON.parse(localStorage.getItem('userData'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [currentUser, setCurrentUser] = useState(storedData.username); 
  const [currentUserLevel, setCurrentUserLevel] = useState(storedData.userslevel);
  const [lastLogin, setLastLogin] = useState("");

  const { t, i18n } = useTranslation();

  // Mouse enter event on icons
  const handleMouseEnter = (icon) => {
    setHoveredIcon(icon);
  };

  // Mouse leave event on icons
  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  // Update last login time when dropdown content is opened
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDateTime = new Date();
      setLastLogin(formatDateTime(currentDateTime));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col w-full">
       
        <header className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 flex items-center -ml-4">
            {/* Left Section: Logo + MerchantGUI */}
            <div className="flex items-center pl-12 sm:pl-0">
            {/* When sidebar is closed, show logo on mobile only */}
            {!isSidebarOpen && (
              <>
                <img
                  src={Logo}
                  className="h-10 w-auto rounded sm:hidden"
                  alt="Logo"
                />
                <span className="ml-2 font-semibold text-xl sm:inline hidden">MerchantGUI</span>
              </>
            )}
            {/* When sidebar is open, show text only (optional for larger screens) */}
            {isSidebarOpen && (
              <span className="ml-2 font-semibold text-xl">MerchantGUI</span>
            )}
          </div>


            {/* Spacer */}
            <div className="flex-grow" />

            {/* Topbar */}
            <Topbar
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              hoveredIcon={hoveredIcon}
              username={currentUser}
              userslevel={currentUserLevel}
              lastLogin={lastLogin}
            />
          </header>

       
        <div className="flex-1 bg-gray-200 p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;



