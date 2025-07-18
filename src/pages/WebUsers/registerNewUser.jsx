import React, { useState, useEffect } from "react";
import StatusModal from "../../components/Modals/statusModal";
import { FaUserPlus } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import { HandleChange, HandleChangeDigitsOnly, HandleChangeTextOnly, ResetFormData,HandleChangeReg } from '../../components/Validations'; 
import { useTranslation } from 'react-i18next';
import { userLevelCol, registerWebUser } from "../../api/webuser";
import LoadingModal from '../../components/Modals/loadingModal';

const RegisterNewUser = () => {
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLevels = async () => {
      setLoading(true);
      try {
        const result = await userLevelCol();
        if (result.success) {
          const parsedLevels = JSON.parse(result.level);
          if (Array.isArray(parsedLevels)) {
            setLevels(parsedLevels); 

          } else {
            setError('Invalid user level data format');
            toast.error("Invalid user level data format");
          }
        } else {
          setError(result.message || 'Invalid data format');
          toast.error(result.message || "Invalid user level data format");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserLevels();
  }, []);

  const initialFormData = {
    username: '',
    msisdn: '',
    otpMsisdn: '',
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    department: '',
    userLevel: '',
    status: '',
  };

  const { t, i18n } = useTranslation();
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
      formData.username &&
      formData.msisdn &&
      formData.otpMsisdn &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.company &&
      formData.department &&
      formData.userLevel &&
      formData.status;

      if (isFormValid) {
        setLoading(true);
        const response = await registerWebUser(formData);

        if(response.success){
          setModalState({
            isOpen: true,
            status: "success",
            message: response.message,
          });
          ResetFormData(setFormData, initialFormData)();
          setLoading(false);
        } else{
          setModalState({
            isOpen: true,
            status: "error",
            message: response.message,
          });
          setLoading(false);
        }
      } else {
        setModalState({
          isOpen: true,
          status: "error",
          message: "Failed to Add User. Please try again.",
        });
      }
  };

  return (
    <div className="flex items-center justify-center p-4">
      {loading && (<LoadingModal />)}

      <div className="w-full max-w-4xl">
        {/* Register New User Title outside of the border */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <FaUserPlus className="text-blue-500 mr-2" />
            {t('register_new_user')}
          </h2>

          <p className="text-gray-600">
            {t('register_new_user_instruction')}
          </p>
        </div>

        {/* Form container with border and new border color */}
        <div className="border-2 border-bg-blue-400 rounded-2xl p-8 bg-white shadow-lg">
          <span className="font-bold text-2xl text-bg-blue-400 mb-10">
          {t('account_details')}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('username')}
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={HandleChangeReg(setFormData)}
                placeholder="Enter username"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"  
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('msisdn')}
              </label>
              <input
                type="text"
                name="msisdn"
                id="msisdn"
                value={formData.msisdn}
                onChange={HandleChangeDigitsOnly(setFormData)}
                placeholder="Enter MSISDN"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('otp_msisdn')}
              </label>
              <input
                type="text"
                name="otpMsisdn"
                id="otpMsisdn"
                value={formData.otpMsisdn}
                onChange={HandleChangeDigitsOnly(setFormData)}
                placeholder="Enter OTP MSISDN"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                maxLength={15}
              />
            </div>

            {/* Additional fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('first_name')}
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={HandleChangeTextOnly(setFormData)}
                placeholder="Enter first name"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('last_name')}
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={HandleChangeTextOnly(setFormData)}
                placeholder="Enter last name"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('email')}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={HandleChangeReg(setFormData)}
                placeholder="Enter email"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('company')}
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={HandleChangeReg(setFormData)}
                placeholder="Enter company"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('department')}
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={HandleChangeReg(setFormData)}
                placeholder="Enter department"
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('user_level')}
              </label>
              <select
                name="userLevel"
                id="userLevel"
                value={formData.userLevel}
                onChange={HandleChangeReg(setFormData)}
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                required
              >
                <option value="">Select User Level</option>
                {levels.map((level) => (
                  <option key={level.USERSLEVEL} value={level.USERSLEVEL.toUpperCase()}>
                    {level.USERSLEVEL}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
              {t('status')}
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={HandleChange(setFormData)}
                className="w-full px-4 py-2 rounded-lg border border-bg-blue-400 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
                required
              >
                <option value="">Select status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="DEACTIVE">DEACTIVE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit button outside the border */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            onClick={handleSubmit}
             className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
          >
            {t('submit')}
          </button>
        </div>
      </div>

      {/* Status Modal component */}
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        status={modalState.status}
        message={modalState.message}
      />

      <ToastContainer />
      
    </div>
  );
};

export default RegisterNewUser;
