import React, { useState, useEffect  } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaMagnifyingGlass, FaAddressCard } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { searchSubs } from "../../api/subscriber";
import { toast, ToastContainer } from "react-toastify";

const SearchSubscriber = () => {
  const { t, i18n} = useTranslation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [msisdn, setMsisdn] = useState("");
  const [optINP, setOptINP] = useState("2");
  const [accountDetails, setAccountDetails] = useState([]);
  const [personalDetails, setPersonalDetails] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!msisdn) {
      toast.error(t('msisdn_required'));
      return;
    }
    

    try {
      const { success, account, message } = await searchSubs(msisdn, optINP);

      if (success) {
        setAccountDetails([
          { label: t('account_id'), value: account.id },
          { label: t('nickname'), value: account.nickname },
          { label: t('msisdn'), value: account.msisdn },
          { label: t('main_account'), value: account.currentAmount },
          { label: t('commission_amount'), value: account.commissionAmount },
          { label: t('account_type'), value: account.accountType },
          { label: t('date_registered'), value: account.dateRegistered },
          { label: t('date_modified'), value: account.dateModified },
          { label: t('kyc'), value: account.kyc },
          { label: t('reference_account'), value: account.referenceAccount },
          { label: t('account_status'), value: account.status },
          { label: t('user_id'), value: account.userId },
          { label: t('locked'), value: account.locked },
          { label: t('control_reference'), value: account.controlReference },
        ]);

        setPersonalDetails([
          { label: t('first_name'), value: account.firstName },
          { label: t('second_name'), value: account.secondName },
          { label: t('last_name'), value: account.lastName },
          { label: t('id_number'), value: account.idNumber },
          { label: t('id_description'), value: account.idDescription },
          { label: t('id_expiry_date'), value: account.idExpiry },
          { label: t('nationality'), value: account.nationality },
          { label: t('gender'), value: account.gender },
          { label: t('date_of_birth'), value: account.dateOfBirth },
          { label: t('place_of_birth'), value: account.placeOfBirth },
          { label: t('company'), value: account.company },
          { label: t('profession'), value: account.profession },
          { label: t('city_village'), value: account.cityVillage },
          { label: t('street_name'), value: account.streetName },
          { label: t('building_number'), value: account.bldgNumber },
          { label: t('region'), value: account.region },
          { label: t('country'), value: account.country },
          { label: t('email'), value: account.email },
          { label: t('alt_number'), value: account.altNumber },
        ]);
      } else {
        setAccountDetails([]);
        setPersonalDetails([]);
        toast.error(message || t('search_failed'));
      }
    } catch (error) {
      toast.error(error.message || t('search_failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <ToastContainer />

      {/* Search Bar */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-8">
          <FaMagnifyingGlass className="text-[#D95F08] mr-2" />
          {t('search_subscriber')}
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            className="md:w-1/3 px-4 py-2 border rounded-md shadow-md text-gray-600 focus:outline-none"
            defaultValue="MSISDN"
            value={optINP}
            onChange={(e) => setOptINP(e.target.value)}
          >
            <option value="2">{t('msisdn')}</option>
          </select>

          <input
            type="text"
            value={msisdn}
            onChange={(e) => setMsisdn(e.target.value)}
            placeholder={t('msisdn')}
            className="md:w-1/3 px-4 py-2 border rounded-md shadow-md text-gray-600 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="md:w-1/3 px-6 py-2 tracking-wide shadow-md rounded font-bold bg-[#D95F08] text-white hover:bg-[#FC8937]"
          >
            {t('search')}
          </button>
        </div>

         <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="md:w-1/3 relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText={t('date_from')}
                      className="w-full px-4 py-2 border rounded-md shadow-md text-gray-600 focus:outline-none"
                      wrapperClassName="w-full"
                      popperClassName="react-datepicker-left"
                    />
                  </div>
        
                  <div className="md:w-1/3 relative">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText={t('date_to')}
                      className="w-full px-4 py-2 border rounded-md shadow-md text-gray-600 focus:outline-none"
                      wrapperClassName="w-full"
                      popperClassName="react-datepicker-right"
                    />
                  </div>
        
                  <button className="md:w-1/3 px-6 tracking-wide shadow-md rounded font-bold py-2 bg-[#D95F08] text-white hover:bg-[#FC8937]">
                    {t('download_list')}
                  </button>
                </div>
      </div>

      {/* Subscriber Details */}
      {accountDetails.length > 0 && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-center">
            <FaAddressCard className="text-[#D95F08] mr-2" />
            {t('view_subscriber_details')}
          </h2>

          <h3 className="text-lg font-semibold mb-4 text-[#23587C]">
            {t('account_details')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {accountDetails.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-md text-center shadow-sm bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-lg font-semibold text-gray-800">{item.value || '-'}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4 text-[#23587C]">
            {t('personal_details')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {personalDetails.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-md text-center shadow-sm bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-lg font-semibold text-gray-800">{item.value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSubscriber;