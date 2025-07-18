import { useState } from 'react';
import { X } from "lucide-react";
import ConfirmationModal from './confirmationModal';
import StatusModal from './statusModal';
import { useTranslation } from 'react-i18next';
import changePassword  from '../../api/changepassword';
import Loadingmodal from '../../components/Modals/Loadingmodal';

export default function ChangePasswordModal({ handleClose = () => {} }) {

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    
    // State to manage form data
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // State to manage modals and messages
    const [openModal, setOpenModal] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalState, setModalState] = useState({
        isOpen: false,
        status: '',
        message: ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Open confirmation modal with a specific message
    const handleOpenModal = (modalMessage) => {
        setModalMessage(modalMessage);
        setOpenModal('confirmationModal');
    };

    // Close confirmation modal
    const handleCloseModal = () => {
        setOpenModal('');
        setModalMessage('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = formData;
    
        if (!oldPassword || !newPassword || !confirmPassword) {
            setModalState({
                isOpen: true,
                status: 'error',
                message: `${t('modal_fill_all_fields')}`,
            });
            return;
        }
    
        if (newPassword !== confirmPassword) {
            setModalState({
                isOpen: true,
                status: 'error',
                message: `${t('modal_passwords_do_not_match')}`,
            });
            return;
        }
    
        try {
            setLoading(true);
            const { success, message } = await changePassword(oldPassword, newPassword);
    
            if (success) {
                setModalState({
                    isOpen: true,
                    status: 'successcp',
                    message: message || `${t('modal_password_changed_successfully')}`,
                });
            } else {
                setModalState({
                    isOpen: true,
                    status: 'error',
                    message: message || `${t('modal_changing_password_failed')}`,
                });
            }
        } catch (error) {
            setModalState({
                isOpen: true,
                status: 'error',
                message: error.message || `${t('modal_changing_password_failed')}`,
            });
        } finally {
            setLoading(false);
        }
    };
    

    const handleEnterPress = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSubmit(event);
        }
    };

    return (
        <div className="fixed -inset-2 flex items-center justify-center z-50 bg-black bg-opacity-50">
            {loading && (<Loadingmodal />)}

            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full pb-6 border-2 border-blue-500">
                <div className='flex justify-between flex-row items-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-sx p-2'>
                    <div className='flex flex-row'>
                        <h2 className="text-xl font-semibold text-white">
                        {t('modal_change_password')}
                        </h2>
                    </div>
                    <div>
                        <X className='cursor-pointer text-white' onClick={handleClose} />
                    </div>
                </div>

                {/* Input fields */}
                <form className="flex flex-col gap-6 mb-8 mt-6 mx-6">
                    <div>
                        <label className="w-auto text-sm font-medium text-gray-700" htmlFor="oldPassword">{t('modal_old_password')}</label>
                        <input
                            type='password'
                            name="oldPassword"
                            id="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            onKeyDown={handleEnterPress}
                            placeholder="Enter old password"
                            className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                        />
                    </div>
                    <div>
                        <label className="w-auto text-sm font-medium text-gray-700" htmlFor="newPassword">{t('modal_new_password')}</label>
                        <input
                            type='password'
                            name="newPassword"
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            onKeyDown={handleEnterPress}
                            placeholder="Enter new password"
                            className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                        />
                    </div>
                    <div>
                        <label className="w-auto text-sm font-medium text-gray-700" htmlFor="confirmPassword">{t('modal_confirm_password')}</label>
                        <input
                            type='password'
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onKeyDown={handleEnterPress}
                            placeholder="Re-enter new password"
                            className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                        />
                    </div>
                    <div className='flex justify-center gap-2'>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
                        >
                            {t('submit')}
                        </button>
                        <button
                            type="button"
                            className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
                            onClick={handleClose}
                        >
                            {t('modal_cancel')}
                        </button>
                    </div>
                </form>
            </div>
            
            {openModal === 'confirmationModal' && (
                <ConfirmationModal
                    openModal={Boolean(openModal)}
                    modalMessage={modalMessage}
                    handleCloseModal={handleCloseModal}
                    onClose={() => {
                        handleSubmit()
                    }}
                />
            )}
            <StatusModal
                isOpen={modalState.isOpen}
                onClose={() => {
                    setModalState((prev) => ({ ...prev, isOpen: false }));
                    if (modalState.status === 'success') {
                        handleClose();
                    }
                }}
                status={modalState.status}
                message={modalState.message}
            />
        </div>
    );
}
