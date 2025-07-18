import axios from "axios";
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL;

export const batchUploadedFiles = async () => {
  const data = JSON.stringify({ "": "" });

  try {
    const response = await axios.post(`${BASE_URL}/funds/batchUploadedFiles`, data);

    const responseData = response.data;
    
    if (responseData && responseData.StatusMessage === "Successfully fetch data") {
      return { success: true, batchData: responseData.Data };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }

};

export const batchDetailsData = async (data) => {

  try {
    const response = await axios.post(`${BASE_URL}/funds/batchDetails`, { fileId: data });

    const responseData = response.data;

    if (responseData.message === "Successfully fetch data") {
      return { success: true, batchDataFile: responseData.batchData, message : '' };
    } else {
      return { success: false, message: responseData?.StatusMessage || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }

}

export const batchFilesRequest = async () => {
  const data = JSON.stringify({ "": "" });

  try {
    const response = await axios.post(`${BASE_URL}/funds/batchFilesRequest`, data);

    const responseData = response.data;
    
    if (responseData && responseData.StatusMessage === "Successfully fetch data") {
      return { success: true, batchData: responseData.Data };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }

};

export const batchFilesTracking = async () => {
  const data = JSON.stringify({ "": "" });

  try {
    const response = await axios.post(`${BASE_URL}/funds/batchFilesTracking`, data);

    const responseData = response.data;
    
    if (responseData && responseData.StatusMessage === "Successfully fetch data") {
      return { success: true, batchData: responseData.Data };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }

};

export const batchFilesOtpRequest = async (module) => {

  try {

    const data = { TRANSREFERENCE: "", MODULE: module };
    const response = await axios.post(`${BASE_URL}/auth/batchFilesOtpRequest`, data);

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
}

export const batchFilesAction = async (fileId, otp, remarks, module) => {
  try {
    const response = await axios.post(`${BASE_URL}/funds/batchFilesAction`, {
      fileId,
      otp,
      remarks,
      module
    });
    const resData = response.data;

    if (resData.success){ 
      return {
        success: true,
        message: resData.message || "Batch File Action successfully",
      };
    } else{
      return {
          success: false,
          message: resData.message || "Batch File Action successfully",
        };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Batch File Action failed",
    };
  }
}

export const batchPaymentUpload = async (filename, filePath) => {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const msisdn = storedData?.msisdn || "unknownUser";
  const lang = i18n.language.toUpperCase();

  const payload = {
    FILENAME: filename,
    FILEPATH: filePath,
    MSISDN: msisdn,
    LANG: lang,
  }

  try {
    const response = await axios.post(`${BASE_URL}/funds/batchPaymentUpload`, payload);
    
    const res = response.data
    if (res.success) {
    return {
      success: true,
      message: res.message || "Batch payment uploaded successfully",
    };
  } else {
      return {
          success: false,
          message: res.message || "Batch payment uploaded successfully",
        };
  }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Batch payment uploaded failed",
    };
  }

}

export const fileUpload = async (formData) => {
  const res = await axios.post(`${BASE_URL}/funds/fileUpload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (res.success) {
    return {
      success: true,
      message: res.message || "File uploaded successfully",
    };
  } else {
      return {
          success: false,
          message: res.message || "File uploaded unsuccessfully",
        };
  }
}