import React, { useState, useEffect } from 'react';
import { FaUsersGear } from 'react-icons/fa6';
import { Search, ArrowDownUp, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { HandleChange, HandleChangeDigitsOnly, HandleChangeTextOnly, ResetFormData } from '../../components/Validations';
import { userLevelCol } from "../../api/webuser";
import { getRolesConfigTable, updateRoles } from '../../api/rolesConfiguration';
import { toast, ToastContainer } from "react-toastify";
import ConfirmationModal from '../../components/Modals/confirmationModal';
import StatusModal from '../../components/Modals/statusModal';
import LoadingModal from '../../components/Modals/LoadingModal';

const rolesConfiguration = () => {
  const { t, i18n} = useTranslation();
  const [error, setError] = useState(null);
  const [userLevel, setUserLevel] = useState("");
  const [newRole, setNewRole] = useState("")
  const [openModal, setOpenModal] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, status: '', message: '' });
  const [rolesDetails, setRolesDetails] = useState([])
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });

  useEffect(() => {
    const fetchUserLevels = async () => {
      setLoading(true);
      try {
        const result = await userLevelCol();
        if (result.success) {
          const parsedLevels = JSON.parse(result.level);

          if (Array.isArray(parsedLevels)) {
            setLevels(parsedLevels); 

          } else {
            setError('Invalid user level data format');
          }
        } else {
          setError(result.message || 'Invalid data format');
        }
      } catch (err) {
        setError(err.message); // Handle fetch errors
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserLevels();
  }, []);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const sortedData = [...rolesDetails].sort((a, b) => {
    if (a[sortConfig.key]?.toLowerCase() < b[sortConfig.key]?.toLowerCase()) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key]?.toLowerCase() > b[sortConfig.key]?.toLowerCase()) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination Number Rendering Function
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
       
        startPage = 1;
        endPage = totalPages;
    } else {
        
        if (currentPage <= 3) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    if (startPage > 1) {
        pageNumbers.push(
            <button
                key="prev-ellipsis"
                className="px-3 py-1 mx-1 text-sm text-gray-700 bg-transparent"
                disabled
            >
                &#8230;
            </button>
        );
    }

    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button
                key={i}
                onClick={() => paginate(i)}
                className={`px-3 py-1 mx-1 hover:bg-[#F3EEEB] rounded-full text-sm ${currentPage === i ? 'bg-[#F4E6DC] text-black' : 'bg-transparent text-gray-700'}`}
            >
                {i}
            </button>
        );
    }

  
    if (endPage < totalPages) {
        pageNumbers.push(
            <button
                key="next-ellipsis"
                className="px-3 py-1 mx-1 text-sm text-gray-700 bg-transparent"
                disabled
            >
                &#8230;
            </button>
        );
    }

    return pageNumbers;
};

  const handleSubmit = async (userlevel) => {
    if (!userLevel) {
      toast.error('User Level Required');
      return;
    }

    setLoading(true);
    try {
      const result = await getRolesConfigTable(userLevel);

      if (result.success) {
        const parsedRoles = JSON.parse(result.roles);
        setRolesDetails(parsedRoles);
      } else {
        toast.error(result.message || "Failed to fetch roles");
        setRolesDetails([]);
      }

    } catch (error) {
      toast.error("ERROR!");
      setRolesDetails([]);

    } finally {
      setLoading(false);
    } 
  }

 const changeRole = async (userlevel, id, module, actionStatus) => {
  try {
    setLoading(true);
    const result = await updateRoles(userlevel, id, module, actionStatus);

    setLoading(false);

    if (result.success) {
      return result; 
    } else {
      toast.error(result.message || "Failed to update role.");
      return result;
    }
  } catch (error) {
    setLoading(false);
    toast.error("An error occurred while updating the role.");
    return null;
  }
};


  const handleOpenModal = (modalMessage, data) => {
    setModalMessage(modalMessage);
    setModalData(data);
    setOpenModal('confirmationModal');
  };

  const handleCloseModal = () => {
    setOpenModal('');
    setModalMessage('');
  };

  // const handleUseStateToggle = () => {
  //   if (modalData) {
  //     const { userLevel, id, module, actionStatus } = modalData;
  
  //     // Call the functions with the modal data
  //     setNewRole((prev) => ({
  //       ...prev,
  //       [id]: actionStatus,
  //     }));
  //     console.log(result)
  //     setModalState({
  //       isOpen: true,
  //         status: 'success',
  //         message: `The role has been updated successfully!`
  //     });

  //     changeRole(userLevel, id, module, actionStatus);
  //   }
  // };
  
  const handleUseStateToggle = async () => {
  if (modalData) {
    const { userLevel, id, module, actionStatus } = modalData;

    // Update local UI state
    setNewRole((prev) => ({
      ...prev,
      [id]: actionStatus,
    }));

    // Call the async role update
    const result = await changeRole(userLevel, id, module, actionStatus);

    console.log(result)
  
    if (result && result.success) {
      setModalState({
        isOpen: true,
        status: 'success',
        message: result.message,
      });
    }else {
      setModalState({
        isOpen: true,
        status: 'error',
        message: result.message || 'Failed to update the role.',
      });
    } 
  }
};



  return (
    <div className="min-h-screen bg-gray-200 p-4 sm:p-6 lg:p-8">
      {loading && <LoadingModal />}
      <ToastContainer />
  
      <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center mb-6 sm:mb-8">
          <FaUsersGear className="text-blue-500 mr-2" />
          {t('roles_configuration')}
        </h2>
  
        {/* Selection + Button Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center text-center">
          <p className="text-md font-medium">{t('user_level')}</p>
  
          <select
            value={userLevel}
            onChange={(e) => setUserLevel(e.target.value)}
            className="w-full md:w-2/5 px-4 py-2 border rounded-md shadow-md text-gray-600 focus:outline-none"
          >
            <option value="">{t('select_user_level')}</option>
            {levels.map((level) => (
              <option key={level.USERSLEVEL} value={level.USERSLEVEL.toUpperCase()}>
                {level.USERSLEVEL === 'TEMP1' ? 'TEMPORARY_NEW' : level.USERSLEVEL}
              </option>
            ))}
          </select>
  
          <button
            type="button"
            onClick={() => handleSubmit(userLevel)}
            className="w-full sm:w-1/3 px-6 py-2 tracking-wide shadow-md rounded font-bold bg-blue-500 text-white hover:bg-indigo-600"
            disabled={loading}
          >
            {t('get_roles')}
          </button>
        </div>
  
        {/* ROLES TABLE SECTION */}
        {rolesDetails.length >= 0 && (
          <div className="mt-8 bg-white shadow-md rounded-lg p-4 sm:p-6">
            {/* Search Input */}
            <div className="relative flex justify-end mb-4 w-full sm:w-1/2 ml-auto">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearch}
                placeholder={t('search')}
                className="w-full border border-gray-400 rounded p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              {!searchInput ? (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              ) : (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setSearchInput('')}
                />
              )}
            </div>
  
            {/* Table Scroll Wrapper */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y table-auto border-collapse rounded-lg shadow-md text-sm sm:text-base">
                <thead className="rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <tr className="divide-x divide-gray-200">
                    {[
                      ['ID', 'ID'],
                      ['MODULE', 'module'],
                      ['INTERFACE', 'interface'],
                      ['DESCRIPTION', 'description'],
                      ['USERSLEVEL', 'user_level'],
                      ['RIGHTSINDICATOR', 'rights_indicator'],
                      ['ACTIONSTATUS', 'action'],
                    ].map(([key, label]) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        className="px-4 py-2 cursor-pointer group hover:bg-blue-400"
                      >
                        <span className="flex items-center justify-between whitespace-nowrap">
                          {t(label)}
                          <ArrowDownUp className="ml-1 w-4 h-4" />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-center divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index} className="cursor-default">
                        <td className="px-4 py-2">{item.ID}</td>
                        <td className="px-4 py-2">{item.MODULE}</td>
                        <td className="px-4 py-2">{item.INTERFACE}</td>
                        <td className="px-4 py-2">{item.DESCRIPTION}</td>
                        <td className="px-4 py-2">{item.USERSLEVEL}</td>
                        <td className="px-4 py-2">{item.RIGHTSINDICATOR}</td>
                        <td className="px-4 py-2">
                          <select
                            className="cursor-pointer"
                            value={newRole[item.ID] || item.ACTIONSTATUS}
                            onChange={(e) =>
                              handleOpenModal(t('modal_change_the_role_of'), {
                                userLevel: item.USERSLEVEL,
                                id: item.ID,
                                module: item.MODULE,
                                actionStatus: e.target.value,
                              })
                            }
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-2 text-center">
                        {t('td_no_results_found')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
  
            {/* Pagination */}
            <div className="flex justify-center mt-4 flex-wrap gap-1 text-[#19405A]">
              <button
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 font-bold rounded-full hover:bg-[#F3EEEB]"
              >
                «
              </button>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 font-bold rounded-full hover:bg-[#F3EEEB]"
              >
                ‹
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 font-bold rounded-full hover:bg-[#F3EEEB]"
              >
                ›
              </button>
              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 font-bold rounded-full hover:bg-[#F3EEEB]"
              >
                »
              </button>
            </div>
          </div>
        )}
  
      </div>
  
      {/* Confirmation & Status Modals */}
      {openModal === 'confirmationModal' && (
        <ConfirmationModal
          openModal={Boolean(openModal)}
          modalMessage={modalMessage}
          setModalData={modalData}
          setNewRole={newRole}
          handleCloseModal={handleCloseModal}
          onProceed={handleUseStateToggle}
        />
      )}
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        status={modalState.status}
        message={modalState.message}
      />
    </div>
  );
  
}

export default rolesConfiguration