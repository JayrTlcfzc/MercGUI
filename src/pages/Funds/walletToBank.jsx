import React, { useState, useEffect } from 'react';
import StatusModal from '../../components/Modals/statusModal';
import PasswordModal from '../../components/Modals/PasswordModal';
import OTPModal from '../../components/Modals/OTPModal';
import { FaBuildingColumns } from 'react-icons/fa6';
import { HandleChange, HandleChangeDigitsOnly, HandleChangeTextOnly, ResetFormData } from '../../components/Validations'; // Import validation and reset functions
import { useTranslation } from 'react-i18next';
import { walletToBank, allocateOtpRequest, bankCollection } from '../../api/walletToBank';
import LoadingModal from '../../components/Modals/LoadingModal';


const WalletToBank = () => {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isOTPModalOpen, setOTPModalOpen] = useState(false); // OTP modal state
  const [modalState, setModalState] = useState({ isOpen: false, status: '', message: '' });
  const [banks, setBanks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  
  useEffect(() => {
    const fetchUserLevels = async () => {
      try {
        setLoading(true);
        const result = await bankCollection();
        if (result.success) {
          const parsedBank = JSON.parse(result.bank);
          if (Array.isArray(parsedBank)) {
            setBanks(parsedBank); 
          } else {
            setError('Invalid user level data format');
          }
        } else {
          setError(result.message || 'Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserLevels();
  }, []);

  const { t, i18n } = useTranslation();

  // Setting initial input
  const initialFormData = {
    bank: '',
    bankaccountfullname: '',
    bankaccountnumber: '',
    amount: '',
    remarks: '',
  };

  // Passing input
  const [formData, setFormData] = useState(initialFormData);

  // Check if all fields have values
  const isFormValid = formData.bank && formData.bankaccountfullname && formData.bankaccountnumber && formData.amount && formData.remarks;

  const handleAllocate = () => setPasswordModalOpen(true); // Open password modal on click


  const handleProceedPassword = async () => {
    
    setPasswordModalOpen(false); 
    try {
      setLoading(true);
        const res = await allocateOtpRequest();
        setOTPModalOpen(true);
      } catch (error) {
        setModalState({ isOpen: true, status: "error", message: error.message });
      } finally {
        ResetFormData(setFormData, initialFormData);
        setLoading(false);
      }
     
  };

  const handleProceedOTP = async (otp) => {
    setOtpValue(otp);
    const updatedFormData = { ...formData, otp }; // Include OTP in form data
    setFormData(updatedFormData);
    setOTPModalOpen(false);
    try {
      setLoading(true);
      const res = await walletToBank(updatedFormData);
      setModalState({ isOpen: true, status: res.success ? "success" : "error", message: res.message });
    } catch (error) {
      setModalState({ isOpen: true, status: "error", message: error.message });
    } finally {
      ResetFormData(setFormData, initialFormData);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading && (<LoadingModal />)}
      
      <h2 className="text-2xl font-bold mb-8 flex items-center text-center">
        <FaBuildingColumns className="text-blue-500 mr-2" />
        {t('wallet_to_bank')}
      </h2>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-4xl border-2 border-bg-blue-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <label 
              className="block text-sm font-medium mb-2 truncate" 
              title={t('bank')} // Tooltip for full label
            >
              {t('bank')}
            </label>
            <select
              name="bank"
              value={formData.bank}
              onChange={HandleChange(setFormData)}
              className="p-3 border rounded-md shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
            >
              <option value="">{t('select_bank')}</option>
                    {banks.map((bank) => (
                      <option key={bank.ID} value={bank.KEYNAME.toUpperCase()}>
                        {bank.BANKNAME}
                      </option>
                    ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label 
              className="block text-sm font-medium mb-2 truncate" 
              title={t('bank_account_full_name')} // Tooltip for full label
            >
              {t('bank_account_full_name')}
            </label>
            <input
              type="text"
              name="bankaccountfullname"
              value={formData.bankaccountfullname}
              onChange={HandleChangeTextOnly(setFormData)}
              placeholder={t('bank_account_full_name')}
              className="p-3 border rounded-md shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label 
              className="block text-sm font-medium mb-2 truncate" 
              title={t('bank_account_number')} // Tooltip for full label
            >
              {t('bank_account_number')}
            </label>
            <input
              type="text"
              name="bankaccountnumber"
              value={formData.bankaccountnumber}
              onChange={HandleChangeDigitsOnly(setFormData)}
              placeholder={t('bank_account_number')}
              className="p-3 border rounded-md shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label 
              className="block text-sm font-medium mb-2 truncate" 
              title={t('amount')} // Tooltip for full label
            >
              {t('amount')}
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={HandleChangeDigitsOnly(setFormData)}
              placeholder={t('amount')}
              className="p-3 border rounded-md shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label 
              className="block text-sm font-medium mb-2 truncate" 
              title={t('remarks')} // Tooltip for full label
            >
              {t('remarks')}
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={HandleChange(setFormData)} // Using general handleChange for remarks
              placeholder={t('remarks')}
              className="p-3 border rounded-md shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-6">
        <button
          className={`text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-300 ${
            isFormValid
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleAllocate}
          disabled={!isFormValid}
        >
          {t('submit')}
        </button>
        <button 
          className="bg-gradient-to-br from-gray-500 to-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
          onClick={ResetFormData(setFormData, initialFormData)} // Resetting form
        >
          {t('reset')}
        </button>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          onProceed={handleProceedPassword}
          handleClose={() => setPasswordModalOpen(false)}
        />
      )}

      {/* OTP Modal */}
      {isOTPModalOpen && (
        <OTPModal
          isOpen={isOTPModalOpen}
          onClose={() => setOTPModalOpen(false)}
          onProceed={handleProceedOTP}
          handleClose={() => setOTPModalOpen(false)}
        />
      )}

      {/* Status Modal */}
      {modalState.isOpen && (
        <StatusModal
          isOpen={modalState.isOpen}
          onClose={() => {
            setModalState(prev => ({ ...prev, isOpen: false }));
            if (modalState.status === 'success') {
              ResetFormData(setFormData, initialFormData)(); // Resetting formData when modal closes on success
            }
          }}
          status={modalState.status}
          message={modalState.message}
        />
      )}
    </div>
  );
};

export default WalletToBank;
