import axios from "axios";
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL;

const generateRequestId = () => {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const username = storedData?.username || "unknownUser";
  const d = new Date();
  
  const yyyy = d.getFullYear().toString();
  const m = ("0" + (d.getMonth() + 1)).slice(-2);
  const dd = ("0" + d.getDate()).slice(-2);
  const hh = ("0" + d.getHours()).slice(-2);
  const mm = ("0" + d.getMinutes()).slice(-2);
  const ss = ("0" + d.getSeconds()).slice(-2);
  
  return `${username}-${yyyy}${m}${dd}${hh}${mm}${ss}`;
};

export const allocateCash = async (formData) => {
    const reqid = generateRequestId();
    const lang = i18n.language.toUpperCase();
  
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const msisdn = storedData?.msisdn || "unknownUser";
  
    const requestData = {
      ...formData,
      requestId: reqid,
      sender : msisdn,
      auth: "123456",
      commandId: "100",
      extendedData: "",
      lang
    };
  
  
    try {
      const response = await axios.post(`${BASE_URL}/funds/allocateCash`, requestData);
      
      const res = response.data
      if(res.success){
      return {
        success: true,
        message: res.message || "Cash allocated successfully",
      };
    }else{
        return {
            success: false,
            message: res.message || "Cash allocated successfully",
          };
    }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Cash allocation failed",
      };
    }
  };
  

// Allocate OTP Request Function
export const allocateOtpRequest = async () => {
    try {
      const lang = i18n.language.toUpperCase();
      const data = { TRANSREFERENCE: "", MODULE: 'FUNDS.WALLETTOBANK' , Languange: lang};
      const response = await axios.post(`${BASE_URL}/auth/allocateOtpReq`, data);
  
      if (response?.data?.StatusCode === 0) {
        return {
          success: true,
          message: response.data.message || "OTP request successful",
        };
      } else {
        return {
          success: false,
          message: response?.data?.StatusMessage || "OTP request failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "An unexpected error occurred",
      };
    }
  };
  
