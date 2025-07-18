import { useState } from "react";
import StatusModal from "../../../components/Modals/statusModal";
import {
  HandleChange,
  HandleChangeDigitsOnly,
  HandleChangeTextOnly,
  ResetFormData,
} from "../../../components/Validations";
import { useTranslation } from "react-i18next";
import { addUserLevel } from "../../../api/manageUserLevels";
import { toast, ToastContainer } from "react-toastify";
import LoadingModal from '../../../components/Modals/loadingModal';

const AddUserLevel = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    userLevel: "",
    sessionTimeout: "",
    passwordExpiry: "",
    minimumPassword: "",
    passwordHistory: "",
    maxAllocation: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [modalState, setModalState] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate form submission success or failure
    const isFormValid =
      formData.userLevel &&
      formData.sessionTimeout &&
      formData.passwordExpiry &&
      formData.minimumPassword &&
      formData.passwordHistory &&
      formData.maxAllocation;

    if (isFormValid) {

      try {
        setLoading(true);
        const response = await addUserLevel(formData);
        if (response.success) {
        setModalState({
          isOpen: true,
          status: "success",
          message: response.message,
        });
        ResetFormData(setFormData, initialFormData)();
      }else {
        setModalState({
          isOpen: true,
          status: "error",
          message: response.message || t("Failed to add data."),
        });
      }
      } catch (error) {
        setModalState({
            isOpen: true,
            status: "error",
            message: error.message || t("Failed to add data."),
        });
      } finally {
        setLoading(false);
      }

    } else {
      toast.error(t('fill_up_form'));
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to Add User Level. Please try again.",
      });
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {loading && <LoadingModal />}
      <form className="p-6 w-full max-w-4xl">
        {/* Fields Container */}
        <div className="border-2 border-bg-blue-400 bg-white p-4 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* User Level */}
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1 truncate w-full">
                {t("user_level")}
              </label>
              <input
                type="text"
                name="userLevel"
                id="userLevel"
                value={formData.userLevel}
                onChange={HandleChange(setFormData)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                placeholder={t("user_level")}
              />
            </div>
  
            {/* Session Timeout */}
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1 truncate w-full">
                {t("session_timeout")}
              </label>
              <input
                type="number"
                name="sessionTimeout"
                id="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={HandleChangeDigitsOnly(setFormData)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                placeholder={t("session_timeout")}
              />
            </div>
  
            {/* Password Expiry */}
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1 truncate w-full">
                {t("password_expiry")}
              </label>
              <input
                type="number"
                name="passwordExpiry"
                id="passwordExpiry"
                value={formData.passwordExpiry}
                onChange={HandleChangeDigitsOnly(setFormData)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                placeholder={t("password_expiry")}
              />
            </div>
  
            {/* Minimum Password */}
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1 truncate w-full">
                {t("minimum_password")}
              </label>
              <input
                type="text"
                name="minimumPassword"
                id="minimumPassword"
                value={formData.minimumPassword}
                onChange={HandleChangeDigitsOnly(setFormData)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                placeholder={t("minimum_password")}
              />
            </div>
  
            {/* Password History */}
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1 truncate w-full">
                {t("password_history")}
              </label>
              <input
                type="text"
                name="passwordHistory"
                id="passwordHistory"
                value={formData.passwordHistory}
                onChange={HandleChangeDigitsOnly(setFormData)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                placeholder={t("password_history")}
              />
            </div>
  
            {/* Max Allocation */}
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1 truncate w-full">
                {t("max_allocation")}
              </label>
              <input
                type="text"
                name="maxAllocation"
                id="maxAllocation"
                value={formData.maxAllocation}
                onChange={HandleChangeDigitsOnly(setFormData)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                placeholder={t("max_allocation")}
              />
            </div>
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            onClick={handleSubmit}
             className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
          >
            {t("add")}
          </button>
        </div>
      </form>
  
      <ToastContainer />
  
      {/* Status Modal */}
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        status={modalState.status}
        message={modalState.message}
      />
    </div>
  );
  
};

export default AddUserLevel;
