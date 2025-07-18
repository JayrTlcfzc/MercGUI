import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const transactionTypeCol = async () => {
    const data = JSON.stringify({ "": "" });
  
    try {
      const response = await axios.post(`${BASE_URL}/reports/transactionTypeCollection`, data);
  
      const responseData = response.data;
      
      if (responseData && responseData.StatusMessage === "Successfully fetch data") {
        return { success: true, transactType: responseData.Data };
      } else {
        return { success: false, message: responseData?.StatusMessage || "Unknown error" };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.StatusMessage || error.message };
    }
};

export const requestReport = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/reports/requestReport`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const generateReview = async () => {
  const data = JSON.stringify({ "": "" });

  try {
    const response = await axios.post(`${BASE_URL}/reports/generateReview`, data);

    const responseData = response.data;
    const param = JSON.parse(responseData.Data);
  
    // Extract all DATEFROM values into an array
    const dateFromArray = param.map((item) => {
      const parameters = JSON.parse(item.PARAMETERS);
      return parameters.DATEFROM;
    });

    // Extract all DATETO values into an array
    const dateToArray = param.map((item) => {
      const parameters = JSON.parse(item.PARAMETERS);
      return parameters.DATETO;
    });

    // Extract all DATETO values into an array
    const transTypeArray = param.map((item) => {
      const parameters = JSON.parse(item.PARAMETERS);
      return parameters.TRANSTYPE;
    });
    
    if (responseData && responseData.StatusMessage === "Successfully fetch data") {
      return { success: true, rowData: responseData.Data, dateFrom: dateFromArray, dateTo: dateToArray, transType: transTypeArray};
    } else {
      return { success: false, message: responseData?.StatusMessage || "Unknown error" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.StatusMessage || error.message };
  }
}

export const generateDataPDF = async (id) => {

  const payload = {
    ID: id,
  }

  try {
    const response = await axios.post(`${BASE_URL}/reports/generateDataPDF`, payload);

    const responseData = response.data;

    if (responseData && responseData.message === "Successfully fetch data") {
      return { success: true, data: responseData.Data, dataFile: responseData.data};
    } else {
      return { success: false, message: responseData?.StatusMessage || "Unknown error" };
    }

  } catch (error) {
    throw error;
  }
};

export const downloadPDF = async (pdfData, reportName) => {

  const payload = {
    data: pdfData,
    reportName: reportName,
  }

  try {
    const response = await axios.post(`${BASE_URL}/reports/downloadPDF`,
      payload,
      { responseType: 'blob' });

      // Create a URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfURL = URL.createObjectURL(pdfBlob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = pdfURL;
      link.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      throw error;
    }
};

export const downloadCSV = async (id) => {
  const payload = {
    ID: id.toString(),
  };

  try {
    const response = await axios.post(`${BASE_URL}/reports/downloadCSV`, payload);
    const responseData = response.data;

    if (responseData) {
      const parsedData = JSON.parse(responseData.data); // correctly parsing string
      // console.log("Parsed Data:", parsedData);

      return {
        success: true,
        message: responseData.message,
        dataFile: parsedData,
      };
    } else {
      return {
        success: false,
        message: responseData?.StatusMessage || "Unknown error",
      };
    }
  } catch (error) {
    throw error;
  }
};


