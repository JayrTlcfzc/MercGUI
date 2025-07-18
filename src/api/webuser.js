import axios from "axios";
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL;

export const userLevelCol = async () => {
    const data = JSON.stringify({ "": "" });
  
    try {
      const response = await axios.post(`${BASE_URL}/webuser/userLevel`, data);
  
      const responseData = response.data;
     
      if (responseData && responseData.StatusMessage === "Success") {
        return { success: true, level: responseData.Data };
      } else {
        return { success: false, message: responseData?.StatusMessage || "Unknown error" };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.StatusMessage || error.message };
    }
};

export const registerWebUser = async (formData) => {
   const lang = i18n.language.toUpperCase();
    try {
      const response = await axios.post(`${BASE_URL}/webuser/registerWebUser`, formData,
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

 