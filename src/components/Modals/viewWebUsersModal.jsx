import React from 'react'
import { useState, useEffect } from 'react';
import { FaUserPen } from 'react-icons/fa6'
import { X } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './confirmationModal';
import StatusModal from './statusModal';
import { HandleChange, HandleChangeDigitsOnly, HandleChangeTextOnly } from '../Validations';
import { useTranslation } from 'react-i18next';
import {userLevelCol} from "../../api/webuser";
import { updateWebUser } from '../../api/apiWebUsers';
import LoadingModal from '../../components/Modals/loadingModal';
import { useNavigate } from 'react-router-dom';

export default function viewWebUsersModal({ handleClose = () => {}, webUserData = {} }) {

  const initialFormData = {
    userId: '',
    username: '',
    msisdn: '',
    otp: '',
    company: '',
    email: '',
    firstname: '',
    lastname: '',
    department: '',
    status: '',
    locked: '',
    dateRegistered: '',
    dateModified: '',
    userslevel: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const { t, i18n } = useTranslation();
  const [onEdit, setOnEdit] = useState(false);
  const [locked, setLocked] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [openModal, setOpenModal] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalUsername, setModalUsername] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, status: '', message: '' });
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
              toast.error(result.message);
            }
          } else {
            toast.error(result.message);
          }
        } catch (err) {
          toast.error(result.message);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUserLevels();
    }, []);
  
    useEffect(() => {
      if (webUserData) {
        setFormData((prevData) => ({
          ...prevData,
          ...webUserData,
        }));
      }
    }, [webUserData]);

  const handleUseStateToggle = (result) => {
    if (modalMessage === `${t('modal_locked')}` || modalMessage === `${t('modal_unlocked')}`) {
      setLocked(!locked);
    } if (modalMessage === `${t('modal_deactivated')}` || modalMessage === `${t('modal_activated')}`) {
      setDeactivated(!deactivated);
    }
    handleConfirm(result);
  };

  const handleConfirm = (result) => {
    setModalState({
      isOpen: true,
      status: 'successul',
      message: result,
    });
  };

  const handleOpenModal = (modalMessage, modalUsername) => {
    setModalMessage(modalMessage);
    setModalUsername(modalUsername);
    setOpenModal('confirmationModal');
  };
  
  const handleCloseModal = () => {
    setOpenModal('');
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    const requiredFields = [
      formData.userId,
      formData.username,
      formData.msisdn,
      formData.otp,
      formData.company,
      formData.email,
      formData.firstname,
      formData.lastname,
      formData.department,
      formData.status,
      formData.locked,
      formData.userslevel
    ];
  
    const isFormValid = requiredFields.every(field => field && field.trim() !== "");
  
    if (isFormValid) {
      setLoading(true);

      try {
        const result = await updateWebUser(formData);
        
        if (result.logout) {
          toast.error(result.message);
          navigate('/login');
        } else if(result.success){
          setModalState({
            isOpen: true,
            status: "successul",
            message: result.message,
          });
        } else{
            setModalState({
              isOpen: true,
              status: "error",
              message: result.message,
            });
        }
      } catch (error) {
          setModalState({
            isOpen: true,
            status: "error",
            message: t('modal_failed_to_update_user'),
          });
      } finally {
        setLoading(false);
      }
    } else {
      setModalState({
        isOpen: true,
        status: "error",
        message: t('modal_failed_to_update_user'),
      });
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 text-xs md:text-sm lg:text-md">
      {loading && (<LoadingModal />)}
      <ToastContainer />
      
          <div className="bg-white rounded-lg shadow-lg max-w-full pb-6 border-2 border-blue-500 w-full md:w-[800px] lg:w-[1000px] xl:w-[1200px]">

            <div className='flex justify-between flex-row items-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-sx p-2'>
              <div className='flex flex-row'>
                <FaUserPen className='text-2xl text-white ml-2 mr-2' />
                <h2 className=" text-sm md:text-xl font-semibold text-white">
                {t('modal_edit_user')}
                </h2>
              </div>
                
              <div>
                <X 
                  className='cursor-pointer text-white'
                  onClick={handleClose}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-6 mx-6 max-h-[400px] overflow-y-auto md:max-h-[300px] lg:max-h-none lg:overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="userId">{t('user_id')}</label>
                <input
                  disabled
                  type="text"
                  name="userId"
                  id="userId"
                  value={formData.userId}
                  onChange={HandleChangeDigitsOnly(setFormData)}
                  placeholder={t('user_id')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="username">{t('username')}</label>
                <input
                  disabled={!onEdit}
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={HandleChange(setFormData)}
                  placeholder={t('username')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="msisdn">{t('msisdn')}</label>
                <input
                  disabled={!onEdit}
                  name="msisdn"
                  id="msisdn"
                  value={formData.msisdn}
                  onChange={HandleChangeDigitsOnly(setFormData)}
                  placeholder={t('msisdn')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="otp">{t('otp_msisdn')}</label>
                <input
                  disabled={!onEdit}
                  name="otp"
                  id="otp"
                  value={formData.otp}
                  onChange={HandleChangeDigitsOnly(setFormData)}
                  placeholder={t('otp_msisdn')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="company">{t('company')}</label>
                <input
                  disabled={!onEdit}
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={HandleChange(setFormData)}
                  placeholder={t('company')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">{t('email')}</label>
                <input
                  disabled
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={HandleChange(setFormData)}
                  placeholder={t('email')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="firstname">{t('first_name')}</label>
                <input
                  disabled={!onEdit}
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={HandleChangeTextOnly(setFormData)}
                  placeholder={t('first_name')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="lastname">{t('last_name')}</label>
                <input
                  disabled={!onEdit}
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={HandleChangeTextOnly(setFormData)}
                  placeholder={t('last_name')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="department">{t('department')}</label>
                <input
                  disabled={!onEdit}
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={HandleChange(setFormData)}
                  placeholder={t('department')}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="userslevel">{t('user_level')}</label>
                <select
                  disabled={!onEdit}
                  name="userslevel"
                  id="userslevel"
                  value={formData.userslevel}
                  onChange={HandleChange(setFormData)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                 <option value="">Select User Level</option>
                {levels.map((level) => (
                  <option key={level.USERSLEVEL} value={level.USERSLEVEL.toUpperCase()}>
                    {level.USERSLEVEL}
                  </option>
                ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="status">{t('status')}</label>
                <select
                  disabled
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={HandleChange(setFormData)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">Select Status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DEACTIVE">DEACTIVE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="locked">{t('locked')}</label>
                <select
                  disabled
                  name="locked"
                  id="locked"
                  value={formData.locked}
                  onChange={HandleChange(setFormData)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="dateRegistered">{t('date_created')}</label>
                <input
                  disabled
                  name="dateRegistered"
                  id="dateRegistered"
                  value={formData.dateRegistered}
                  onChange={HandleChange(setFormData)}
                  placeholder="N/A"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="dateModified">{t('date_modified')}</label>
                <input
                  disabled
                  name="dateModified"
                  id="dateModified"
                  value={formData.dateModified}
                  onChange={HandleChange(setFormData)}
                  placeholder="N/A"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-10 mx-6">
              <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(t('modal_reset'), formData.username)}
                className="px-4 py-2 text-white bg-[#E88B00] rounded hover:bg-[#FFA51E] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={onEdit}
              >
                {t('modal_reset_password')}
              </button>


                {formData.locked === 'NO' ? (
                  <button
                  onClick={() => handleOpenModal(t('modal_lock'), formData.username)}
                    className="px-4 py-2 text-white bg-[#C80202] rounded hover:bg-[#F71010] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={onEdit}
                  >
                    {t('modal_lock')}
                  </button>
                ) : (
                  <button
                  onClick={() => handleOpenModal(t('modal_unlock'), formData.username)}
                    className="px-4 py-2 text-white bg-[#0FBA00] rounded hover:bg-[#0C9500] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={onEdit}
                  >
                    {t('modal_unlock')}
                  </button>
                )}

                {formData.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleOpenModal(t('modal_deactivate'), formData.username)}
                    className="px-4 py-2 text-white bg-[#3F3F3F] rounded hover:bg-[#4D4D4D] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={onEdit}
                  >
                    {t('modal_deactivate')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenModal(t('modal_activate'), formData.username)}
                    className="px-4 py-2 text-white bg-[#CDC600] rounded hover:bg-[#F2EA06] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={onEdit}
                  >
                    {t('modal_activate')}
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {!onEdit ? (
                  <button
                    onClick={() => setOnEdit(true)}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400 font-bold"
                  >
                    {t('modal_edit')}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400 font-bold"
                  >
                    {t('modal_save')}
                  </button>
                )}

                  {onEdit ? (
                    <button
                      className="px-4 py-2 text-black bg-[#DCDCDC] rounded hover:bg-[#9D9D9D] font-bold"
                      onClick={() => setOnEdit(false)}
                    >
                      {t('modal_cancel')}
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 text-black bg-[#DCDCDC] rounded hover:bg-[#9D9D9D] font-bold"
                      onClick={handleClose}
                    >
                      {t('modal_cancel')}
                    </button>
                  )}

              </div>
            </div>

          </div>
          {openModal === 'confirmationModal' && (
            <ConfirmationModal
              openModal={Boolean(openModal)}
              modalMessage={modalMessage}
              modalUsername={modalUsername}
              locked={locked} 
              setLocked={setLocked} 
              deactivated={deactivated} 
              setDeactivated={setDeactivated}
              handleCloseModal={handleCloseModal}
              onProceed={handleUseStateToggle}
            />
          )}
            <StatusModal
              isOpen={modalState.isOpen}
              onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
              status={modalState.status}
              message={modalState.message}
            />
        </div>
  )
}