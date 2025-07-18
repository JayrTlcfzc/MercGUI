import axios from "axios";
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL;

export const searchSubs = async (msisdn, optINP) => {
  const params = { msisdn, optINP };
  const storedData = JSON.parse(localStorage.getItem('userData'));

  try {
    const response = await axios.post(`${BASE_URL}/subscriber/searchSubscriber`, params);
    const data = response.data;

    if (data.StatusMessage === "Success") {
      return { success: true, account: data.Account };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }
};


export const validateMsisdn = async (MSISDN) => {
  const params = { MSISDN };
  const storedData = JSON.parse(localStorage.getItem('userData'));
  const lang = i18n.language.toUpperCase();
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/validateMsisdn`, params,{headers: { 'Language': lang }});
    const data = response.data;

    if (data.StatusCode === 0) {
      return { success: true, message: data.StatusMessage};
    } else {
      return { success: false, message:  data.StatusMessage };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }
};



export const accountTypeCol = async () => {
  const data = JSON.stringify({ "": "" });

  try {
    const response = await axios.post(`${BASE_URL}/subscriber/accountTypeCollection`, data);
   
    const responseData = response.data;

    if (responseData && responseData.StatusMessage === "Success") {
      return { success: true, account: responseData.Data };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }
};

export const registerSubscriber = async (formData) => {

   const lang = i18n.language.toUpperCase();
  try {
    const response = await axios.post(`${BASE_URL}/subscriber/registerSubscriber`, formData,
      {
        headers: {
          'Language': lang  
        }
      });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewPendingSubs = async () => {
  const data = JSON.stringify({ "": "" });

  try {
    const response = await axios.post(`${BASE_URL}/subscriber/viewPendingSubsCollection`, data);

    const responseData = response.data;

    if (responseData && responseData.StatusMessage === "Success") {
      return { success: true, account: responseData.Data };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }
};