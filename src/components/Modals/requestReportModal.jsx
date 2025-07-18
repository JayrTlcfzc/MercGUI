import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import ConfirmationModal from './confirmationModal';
import StatusModal from './statusModal';
import { toast, ToastContainer } from "react-toastify";
import { HandleChange, HandleChangeDigitsOnly, HandleChangeTextOnly, ResetFormData } from '../Validations';
import { useTranslation } from 'react-i18next';
import { transactionTypeCol, requestReport, generateReview } from '../../api/reports';
import { parse } from 'postcss';
import LoadingModal from '../../components/Modals/LoadingModal';

export default function RequestReportsModal({ handleClose = () => {} }) {

    const [transTypes, setTransTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [typeOfReport, setTypeOfReport] = useState('');

    useEffect(() => {
    const fetchTransactionTypes = async () => {
        setLoading(true);
        try {

        const { success, transactType, message } = await transactionTypeCol();

            if (success) {
                let parsedData;
                if (Array.isArray(transactType)) {
                    parsedData = transactType[0];
                } else {
                    parsedData = transactType; 
                }

                if (parsedData) {
                    parsedData = Array.isArray(transactType) ? transactType : [transactType];

                    setTransTypes(JSON.parse(parsedData));
                }
                else {
                    toast.error("Something went wrong!");
                }
            } else {
                setError(result.message || 'Invalid data format');
                toast.error("Something went wrong!");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    fetchTransactionTypes();
    }, []);

    const { t, i18n } = useTranslation();


    const initialFormData = {
        reportType: '',
        msisdn: 'ALL',
        dateFrom: '',
        dateTo: '',
        transType: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    // State to manage modals and messages
    const [openModal, setOpenModal] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalState, setModalState] = useState({
        isOpen: false,
        status: '',
        message: ''
    });

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

        const isFormValid = 
        formData.reportType && 
        formData.dateFrom && 
        formData.dateTo 

         if (isFormValid) {
            try {
                const response = await requestReport(formData);
                // console.log("Response from requestReport:", response);
                if (response.success) {
                    setModalState({
                    isOpen: true,
                    status: "success",
                    message: t('request_report_success'),
                    });
                    ResetFormData(setFormData, initialFormData)();
                } else {
                    setModalState({
                    isOpen: true,
                    status: "error",
                    message: t('request_report_failed'),
                    });
                }
            } catch {
                setModalState({
                    isOpen: true,
                    status: "error",
                    message: t('request_report_failed') ,
                });
            } finally {
                setLoading(false);
            }
        } else {
            setModalState({
                isOpen: true,
                status: "error",
                message: t('request_report_failed'),
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            {loading && (<LoadingModal />)}

            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full pb-6 border-2 border-blue-500">
            <div className='flex justify-between flex-row items-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-sx p-2'>
                    <div className='flex flex-row'>
                        <h2 className="text-xl font-semibold text-white">
                        {t('request_reports')}
                        </h2>
                    </div>
                    <div>
                        <X className='cursor-pointer text-white' onClick={handleClose} />
                    </div>
                </div>

                {/* Input fields */}
                <form className="flex flex-col gap-6 mb-8 mt-6 mx-6">
                    <div>
                        <label className="w-auto text-sm font-medium text-gray-700" htmlFor="reportType">{t('modal_types_of_report')}</label>
                        <select
                            name="reportType"
                            id="reportType"
                            value={formData.reportType}
                            onChange={(e) => {
                                HandleChange(setFormData)(e);
                                setTypeOfReport(e.target.value);
                            }}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                        >
                            <option value="">{t('select_type_of_report')}</option>
                            <option value="SUBSCRIBER TRANSACTION SUMMARY">Transaction Summary</option>
                            <option value="SUBSCRIBER TRANSACTION REPORTS">Transaction Reports</option>
                            <option value="SUBSCRIBER ACCOUNT SUMMARY">Account Summary</option>
                            <option value="SUBSCRIBER TRANSACTION STATEMENT">Statement Reports</option>
                            <option value="SUBSCRIBER BONUS COMMISSION">Bonus Commission</option>
                        </select>
                    </div>

                    {typeOfReport !== '' && (
                        <>
                            <div>
                                <label className="w-auto text-sm font-medium text-gray-700" htmlFor="msisdn">{t('msisdn')}</label>
                                <input
                                    name="msisdn"
                                    id="msisdn"
                                    value={formData.msisdn}
                                    onChange={HandleChange(setFormData)}
                                    placeholder="MSISDN"
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                                />
                            </div>
                            <div>
                                <label className="w-auto text-sm font-medium text-gray-700" htmlFor="dateFrom">{t('date_from')}</label>
                                <input
                                    type="date"
                                    name="dateFrom"
                                    id="dateFrom"
                                    value={formData.dateFrom}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 cus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                                />
                            </div>
                            <div>
                                <label className="w-auto text-sm font-medium text-gray-700" htmlFor="dateTo">{t('date_to')}</label>
                                <input
                                    type="date"
                                    name="dateTo"
                                    id="dateTo"
                                    value={formData.dateTo}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                                />
                            </div>
                            {typeOfReport === 'SUBSCRIBER TRANSACTION REPORTS' && (
                                <div>
                                    <label className="w-auto text-sm font-medium text-gray-700" htmlFor="transType">{t('modal_transaction_type')}</label>
                                    <select
                                        name="transType"
                                        id="transType"
                                        value={formData.transType}
                                        onChange={HandleChange(setFormData)}
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-blue-400"
                                    >
                                        <option value="">Please Select Transaction Type</option>
                                        {transTypes.map((item) => (
                                            <option key={item.ID} value={item.KEY}>
                                                {item.DESCRIPTION}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
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
                onClose={() => {
                    setModalState((prev) => ({ ...prev, isOpen: false }));
                    if (modalState.status === 'success') {
                        handleClose();
                    }
                }}
                status={modalState.status}
                message={modalState.message}
            />
            
            <ToastContainer />

        </div>
    );
}
