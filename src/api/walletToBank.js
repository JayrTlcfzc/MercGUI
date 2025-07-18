import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Function to generate a request ID in the specified format
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
    const reqidDate = `${yyyy}${m}${dd}${hh}${mm}${ss}`;
    return `${username}-W2B${reqidDate}`;
  };
  

export const walletToBank = async (formData) => {
    const reqid = generateRequestId();
  
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const msisdn = storedData?.msisdn || "unknownUser";
  
    const requestData = {
      ...formData,
      requestId: reqid,
      sender : msisdn,
      auth: "123456",
      commandId: "100",
    };
  
  
    try {
      const response = await axios.post(`${BASE_URL}/funds/walletToBank`, requestData);
      
      const res = response.data
      if (res.success) {
      return {
        success: true,
        message: res.message || "Cash allocated successfully",
      };
    } else {
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
      const data = { TRANSREFERENCE: "", MODULE: 'FUNDS.WALLETTOBANK' };
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

  export const bankCollection = async () => {
    const data = JSON.stringify({ "": "" });
  
    try {
      const response = await axios.post(`${BASE_URL}/funds/bankCollection`, data);
  
     
      const responseData = response.data;
  
      if (responseData && responseData.StatusMessage === "Success") {
        return { success: true, bank: responseData.Data };
      } else {
        return { success: false, message: responseData?.message || "Unknown error" };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.StatusMessage || error.message };
    }
  };