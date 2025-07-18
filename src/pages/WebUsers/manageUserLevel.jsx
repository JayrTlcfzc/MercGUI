import React, { useState } from "react";
import AddUserLevel from "./manageuserlevels/addUserLevel";
import EditUserLevel from "./manageuserlevels/editUserLevel";
import { FaUserGear } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

const ManageUserLevel = () => {
  const [activeTab, setActiveTab] = useState("add");

  const { t, i18n } = useTranslation();

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-8">
          <FaUserGear className="text-blue-500 mr-2" />
          {t('manage_user_levels')}
        </h1>
        
        <div className="flex items-center justify-center gap-2 bg-gray-200 rounded-lg p-1 w-fit mx-auto">
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              activeTab === "add"
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {t('add_user_level')}
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              activeTab === "edit"
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {t('edit_user_level')}
          </button>
        </div>

        
        <div className="p-4">
          {activeTab === "add" && <AddUserLevel />}
          {activeTab === "edit" && <EditUserLevel />}
        </div>
      </div>
    </div>
  );
};

export default ManageUserLevel;
