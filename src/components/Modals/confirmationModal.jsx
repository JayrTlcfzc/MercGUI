import React, { useEffect, useState, useRef } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { lockWebUser, unlockWebUser , activeWebUser, deactiveWebUser, resetWebUser } from "../../api/apiWebUsers";
import LoadingModal from '../../components/Modals/loadingModal';
import { useNavigate } from 'react-router-dom';

export default function ConfirmationModal({
  handleCloseModal,
  modalMessage,
  modalUsername,
  locked,
  setLocked,
  deactivated,
  setDeactivated,
  setModalData,
  onProceed = () => {},
}) {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  // Focus on the modal container when it opens
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const closeAllModals = () => {
    handleCloseModal();
  };
  
  
  const handleSubmit = async () => {
  
    if (modalMessage === t('modal_change_the_role_of')) {
      onProceed();
      handleCloseModal();
      return;
    } if (modalMessage === "APPROVE" || modalMessage === "REJECT" || modalMessage === "CONFIRM") {
      onProceed();
      handleCloseModal();
      return;
    }
  
    const lockActions = {
      [t('modal_lock')]:{
        action: lockWebUser,
        lockState: true,
        successMessage: t('user_locked'),
        failureMessage: t('lock_failed'),
      },
      [t('modal_unlock')]:{
        action: unlockWebUser,
        lockState: false,
        successMessage: t('user_unlocked'),
        failureMessage: t('unlock_failed'),
      },
      [t('modal_activate')]:{
        action: activeWebUser,
        lockState: false,
        successMessage: t('user_active'),
        failureMessage: t('active_failed'),
      },
      [t('modal_deactivate')]:{
        action: deactiveWebUser,
        lockState: false,
        successMessage: t('user_deactive'),
        failureMessage: t('deactive_failed'),
      },
      [t('modal_reset')]:{
        action: resetWebUser,
        lockState: false,
        successMessage: t('user_reset'),
        failureMessage: t('reset_failed'),
      },
    };
  
    const currentAction = lockActions[modalMessage];
  
    if (currentAction) {
      setLoading(true);
      try {
        const result = await currentAction.action(modalUsername);
  
        if (result.logout) {
          toast.error(result.message);
          navigate('/login');
        } else if (result.success) {
          setLocked(currentAction.lockState);
          onProceed(result.message);
          setTimeout(() => {
            closeAllModals();
          }, 1000);
        } else {
          toast.error(result.message || currentAction.failureMessage);
        }
      } catch (error) {
        toast.error(currentAction.failureMessage);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div
      tabIndex={-1} // Makes the div focusable
      ref={modalRef} // Ref for focusing
      onKeyDown={handleEnterPress}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      {loading && (<LoadingModal />)}
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <div className="flex flex-row justify-center items-center">
          <FaExclamationCircle className="text-5xl" />
          <h2 className="text-3xl font-semibold text-gray-800 ml-2">
            {t('modal_confirmation')}
          </h2>
        </div>

        <p className="text-gray-600 mt-4 mb-6">
          {`${t('modal_are_you_sure_you_want_to')} `}
          <span className="font-bold">{modalMessage}</span> {t('modal_this_user')}
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400"
            onClick={handleSubmit}
          >
            {t('modal_yes')}
          </button>
          <button
            className="px-4 py-2 text-white bg-[#C60000] rounded hover:bg-[#F71010]"
            onClick={handleCloseModal}
          >
            {t('modal_no')}
          </button>
        </div>
      </div>
    </div>
  );
}
