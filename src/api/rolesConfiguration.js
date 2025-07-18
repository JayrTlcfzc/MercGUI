import axios from "axios";
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getRolesConfigTable = async (data) => {

  try {
    const response = await axios.post(`${BASE_URL}/webuser/rolesConfiguration`, { userLevel: data });

    const responseData = response.data;

    if (responseData.message === "Success") {
      return { success: true, roles: responseData.roles };
    } else {
      return { success: false, message: responseData?.StatusMessage || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }

}

export const updateRoles = async (userlevel, id, module, actionStatus) => {
  const lang = i18n.language.toUpperCase();
  try {
    const response = await axios.post(`${BASE_URL}/webuser/updateRoles`, {
      userlevel,
      id,
      module,
      actionStatus,
      lang
    });

    const responseData = response.data;

    if (responseData.success) {
      return { success: true,message: responseData?.message, newRole: responseData.newRole };
    } else {
      return { success: false, message: responseData?.message || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }

}