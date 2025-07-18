import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Menu, ChevronLeft } from "lucide-react";
import {
  FcSettings,
  FcTwoSmartphones,
  FcRatings,
  FcConferenceCall,
  FcCurrencyExchange
} from "react-icons/fc";
import { cn } from "../../lib/utils";
import logo from "../../assets/nufinlogo.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const storedData = JSON.parse(localStorage.getItem('userData'));
  const { t } = useTranslation();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleItem = (item) => {
    if (!isOpen) {
      setIsOpen(true);
      setExpandedItem(item);
    } else {
      setExpandedItem(expandedItem === item ? null : item);
    }
  };

  const menuItems = [
    {
      id: "account",
      title: t('account_management'),
      icon: FcTwoSmartphones,
      subItems: [
        storedData.Modules?.includes('ACCOUNTS.REGISTER') && { title: t('register_subscriber'), path: "/account/register" },
        { title: t('search_subscriber'), path: "/account/search" },
        storedData.Modules?.includes('ACCOUNTS.PENDINGSUBS') && { title: t('view_pending_subscriber'), path: "/account/view-pending" },
      ].filter(Boolean),
    },
    {
      id: "webUsers",
      title: t('web_users'),
      icon: FcConferenceCall,
      subItems: [
        storedData.Modules?.includes('USERS.SEARCHUSER') && { title: t('view_web_users'), path: "/web-users/view-web-users" },
        storedData.Modules?.includes('USERS.REGISTER') && { title: t('register_new_user'), path: "/web-users/register-new-user" },
        storedData.Modules?.includes('USERS.NEWUSERSLEVEL') && { title: t('manage_user_levels'), path: "/web-users/manage-user-level" },
        storedData.Modules?.includes('USERS.UPDATEROLES') && { title: t('roles_configuration'), path: "/web-users/roles-configuration" }
      ].filter(Boolean),
    },
    {
      id: "funds",
      title: t('funds'),
      icon: FcCurrencyExchange,
      subItems: [
        storedData.Modules?.includes('FUNDS.CASHALLOCATION') && { title: t('allocate_cash'), path: "/funds/allocate-cash" },
        storedData.Modules?.includes('FUNDS.WALLETTOBANK') && { title: t('wallet_to_bank'), path: "/funds/wallet-to-bank" },
        storedData.Modules?.includes('FUNDS.BATCHREQUESTCOL') && { title: t('batch_files'), path: "/funds/batch-files" },
        storedData.Modules?.includes('FUNDS.BATCHALLOCREQUEST') && { title: t('batch_payment_upload'), path: "/funds/batch-payment-upload" },
        storedData.Modules?.includes('FUNDS.BATCHUPLOADEDCOL') && { title: t('batch_uploaded_files'), path: "/funds/batch-uploaded-files" },
      ].filter(Boolean),
    },
    {
      id: "reports",
      title: t('reports'),
      icon: FcRatings,
      subItems: [{ title: t('request_reports'), path: "/reports/request-reports" }],
    },
    {
      id: "audit",
      title: 'Settings',
      icon: FcSettings,
      subItems: [{ title: t('audit_trail'), path: "/audit-trail" }],
    },
  ];

  useEffect(() => {
    const matchedParent = menuItems.find((item) =>
      item.subItems.some((sub) => sub.path === location.pathname)
    );
    if (matchedParent) {
      setExpandedItem(matchedParent.id);
    }
  }, [location.pathname]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg md:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          "h-screen bg-white z-50 md:z-10",
          "rounded-tr-2xl rounded-br-2xl shadow-lg",
          isOpen ? "w-64" : "w-16",
          "fixed md:relative top-0 left-0",
          isOpen ? "" : "hidden md:block"
        )}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors md:block"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>

        {isOpen && (
          <Link to="/dashboard">
            <div className="flex flex-col justify-center items-center h-32 mt-2">
              <img src={logo} alt="Nufin Logo" className="w-24" />
              <span className="text-4xl mt-2 text-blue-500">E M O N E Y</span>
            </div>
          </Link>
        )}

        <nav className={cn("px-2", isOpen ? "mt-4" : "mt-16")}>
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "w-full font-bold flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-br from-blue-500 to-indigo-600 hover:text-white transition-colors group",
                  expandedItem === item.id && "bg-gray-100"
                )}
              >
                <item.icon size={25} className="group-hover:text-white transition-colors" />
                {isOpen && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                    {item.subItems.length > 0 &&
                      (expandedItem === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </>
                )}
              </button>

              {isOpen && expandedItem === item.id && item.subItems.length > 0 && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={cn(
                        "block py-2 px-3 text-sm rounded-md transition-colors",
                        location.pathname === subItem.path
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow"
                          : "font-bold text-gray-600 hover:bg-gradient-to-br from-blue-500 to-indigo-600 hover:text-white"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
