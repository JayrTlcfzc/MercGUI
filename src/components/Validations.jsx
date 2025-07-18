// General handler function to update form data
export const HandleChange = (setFormData) => (e) => {
    const { name, value } = e.target;
  
    let formattedValue = value;
  
    // Check if the input is a date field and format it to DD/MM/YYYY
    if (e.target.type === 'date' && value) {
      const [year, month, day] = value.split('-');
      formattedValue = `${day}/${month}/${year}`;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

export const HandleChangeReg = (setFormData) => (e) => {
  const { name, value, type } = e.target;

  let formattedValue = value;

  // Format date input to DD/MM/YYYY
  if (type === 'date' && value) {
    const [year, month, day] = value.split('-');
    formattedValue = `${day}/${month}/${year}`;
  }

  // Convert to uppercase
  formattedValue = formattedValue.toUpperCase();

  setFormData((prevData) => ({
    ...prevData,
    [name]: formattedValue,
  }));
};

  
// Text only restriction
export const HandleChangeTextOnly = (setFormData) => (e) => {
  const { name, value } = e.target;
  const cleanedValue = value.replace(/[^A-Za-z\s]/g, ''); // allow only letters and spaces
  setFormData((prevData) => ({ ...prevData, [name]: cleanedValue.toUpperCase() }));
};




// Numbers only restriction
export const HandleChangeDigitsOnly = (setFormData) => (e) => {
const { name, value } = e.target;
if (/^\d*$/.test(value) && value.length <= 15) { // Max of 15 numbers as of now
    setFormData((prevData) => ({ ...prevData, [name]: value }));
}
};

// Numbers only restriction
export const HandleChangeDigitsOnly2 = (setUserLevelData) => (e) => {
  const { name, value } = e.target;
  if (/^\d*$/.test(value) && value.length <= 15) {
    setUserLevelData((prevData) =>
      prevData.map((item) =>
        item.nameID === name ? { ...item, value } : item
      )
    );
  }
};

// Dynamic reset function
export const ResetFormData = (setFormData, initialData) => () => {
const resetData = Object.keys(initialData).reduce((acc, key) => {
    acc[key] = ''; // Set each key to empty string
    return acc;
}, {});
setFormData(resetData);
};