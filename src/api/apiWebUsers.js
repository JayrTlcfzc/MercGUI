import axios from "axios";
import i18n from '../i18n';
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 
 * @param {string} endpoint 
 * @param {object} payload 
 * @returns {Promise<object>} 
 */
const makeApiRequest = async (endpoint, payload) => {
  const lang = i18n.language.toUpperCase();
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, payload,
      {
        headers: {
          Language: lang, // 👈 Set the language header
        }
      });
    const responseData = response.data;
    console.log("API Response:", responseData);
    if (responseData && (responseData.StatusMessage === "Success" || responseData.success) ) {
      return { success: true, webusers: responseData.Accounts || null, message: responseData?.message || null };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    throw error;
  }
};

// Define API functions
export const viewWebUser = (params) => makeApiRequest("/webuser/viewWebUser", params);
export const searchWebUser = (username) => makeApiRequest("/webuser/searchWebUser", { username });
export const lockWebUser = (username) => makeApiRequest("/webuser/lockWebUser", { username });
export const unlockWebUser = (username) => makeApiRequest("/webuser/unlockWebUser", { username });
export const activeWebUser = (username) => makeApiRequest("/webuser/activeWebUser", { username });
export const deactiveWebUser = (username) => makeApiRequest("/webuser/deactiveWebUser", { username });
export const resetWebUser = (username) => makeApiRequest("/webuser/resetWebUser", { username });
export const updateWebUser = (formData) => makeApiRequest("/webuser/updateWebUser", { formData });