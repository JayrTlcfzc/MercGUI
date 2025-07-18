import React, { useState, useEffect, useRef } from "react";
import { Folders, Search, ArrowDownUp, X, EllipsisVertical } from "lucide-react";
import { FaCircleInfo, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import { batchUploadedFiles } from "../../api/batch";
import { toast, ToastContainer } from "react-toastify";
import DetailsModal from "../../components/Modals/detailsModal";
import LoadingModal from '../../components/Modals/loadingModal';

const BatchUploadedFiles = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "FILEID", direction: "descending" });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [fileId, setFileId] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchBatchUploadedFiles = async () => {
      setLoading(true);

      try {
        const result = await batchUploadedFiles();
        if (result.success) {
          const parsedFiles = JSON.parse(result.batchData);
          if (Array.isArray(parsedFiles)) {
            setFiles(
              parsedFiles.map((batchData) => ({
                FILEID: batchData.FILEID || '',
                CREATEDTIMESTAMP: batchData.CREATEDTIMESTAMP || '',
                LOADEDTIMESTAMP: batchData.LOADEDTIMESTAMP || '',
                FILENAME: batchData.FILENAME || '',
                STATUS: batchData.STATUS || '',
                CONFIRMEDBY: batchData.CONFIRMEDBY || '',
                DATECONFIRMED: batchData.DATECONFIRMED || '',
                APPROVEDBY: batchData.APPROVEDBY || '',
                DATEAPPROVED: batchData.DATEAPPROVED || '',
                UPLOADEDBY: batchData.UPLOADEDBY || '',
                MSISDN: batchData.MSISDN || '',
                IP: batchData.IP || '',
              }))
            );
          } else {
            setError("Invalid account data format");
          }
        } else {
          setError(result.message || "Invalid data format");
          toast.error(result.message || "Invalid data format");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBatchUploadedFiles();
  }, []);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  // For Ellipsis Dropdown
  const handleEllipsisClick = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => { 
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortedData = [...files].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
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
    let direction = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination Number Rendering Function
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 mx-1 hover:bg-[#F3EEEB] rounded-full text-sm ${currentPage === i ? 'bg-[#F4E6DC] text-black' : 'bg-none text-gray-700'}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="max-h-screen bg-gray-200 p-8">
      {loading && (<LoadingModal />)}
      
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">

        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-8">
          <FaFolder className="text-blue-500 mr-2" />
          {t('batch_uploaded_files')}
        </h2>

        {/* Search Area */}
        <div className="relative flex justify-end gap-4 mb-4">
          <input
            type='text'
            value={searchInput}
            onChange={handleSearch}
            placeholder={t('search')}
            className='w-1/5 h-10 border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400' 
          />

          {!searchInput ? (
            <Search 
                color='#BFBFBF'
                className='absolute right-2 top-1/2 -translate-y-1/2' 
            />) 
            : (
            <X 
                color='#BFBFBF'
                onClick={() => setSearchInput('')}
                className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' 
            />) 
          }
        </div>

        {/* Table Content */}
        <div className="overflow-visible">
          <table className="min-w-full divide-y table-auto border-collapse rounded-lg overflow-visible shadow-md text-xs">
            <thead className="rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <tr className="divide-x divide-gray-200">
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("FILEID")}>
                  <span className="flex items-center justify-between">
                  {t('file_id')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("CREATEDTIMESTAMP")}>
                  <span className="flex items-center justify-between">
                  {t('date_created')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("LOADEDTIMESTAMP")}>
                  <span className="flex items-center justify-between">
                  {t('date_uploaded')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("FILENAME")}>
                  <span className="flex items-center justify-between">
                  {t('file_name')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("STATUS")}>
                  <span className="flex items-center justify-between">
                  {t('status')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("CONFIRMEDBY")}>
                  <span className="flex items-center justify-between">
                  {t('confirmed_by')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("DATECONFIRMED")}>
                  <span className="flex items-center justify-between">
                  {t('date_confirmed')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("APPROVEDBY")}>
                  <span className="flex items-center justify-between">
                  {t('approved_by')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
                <th className="px-4 py-2 cursor-pointer group hover:bg-blue-400" onClick={() => requestSort("DATEAPPROVED")}>
                  <span className="flex items-center justify-between">
                  {t('date_approved')}
                    <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-center divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index} className="cursor-default">
                      <td className="px-4 py-2 whitespace-nowrap">{item.FILEID}</td>
                      <td className="px-4 py-2">{item.CREATEDTIMESTAMP}</td>
                      <td className="px-4 py-2">{item.LOADEDTIMESTAMP}</td>
                      <td className="px-4 py-2">{item.FILENAME}</td>
                      <td className="px-4 py-2">{item.STATUS}</td>
                      <td className="px-4 py-2">{item.CONFIRMEDBY}</td>
                      <td className="px-4 py-2">{item.DATECONFIRMED}</td>
                      <td className="px-4 py-2">{item.APPROVEDBY}</td>
                      <td className="px-4 py-2 flex justify-between items-center">
                        <div className="text-right w-full"> 
                            {item.DATEAPPROVED} 
                        </div>
                        <div className="relative">
                          <EllipsisVertical 
                          className="ml-2 cursor-pointer hover:text-blue-400" 
                          onClick={() => {
                            handleEllipsisClick(index);
                            setFileId(item.FILEID);
                          }}
                          />
                          {dropdownVisible === index && (
                          <div ref={dropdownRef} className="absolute right-0 mt-2 w-max bg-white border border-gray-200 rounded shadow-lg z-50 text-left">
                              <ul className="flex flex-row gap-1">
                                  <div>
                                      <li className="px-4 py-2">{t('uploaded_by')}:</li>
                                      <li className="px-4 py-2">{t('msisdn')}:</li>
                                      <li className="px-4 py-2">{t('ip')}:</li>
                                      <li className="px-4 py-2">{t('action')}: </li>
                                  </div>
                                  <div>
                                      <li className="px-4 py-2 font-medium">{item.UPLOADEDBY} </li>
                                      <li className="px-4 py-2 font-medium">{item.MSISDN} </li>
                                      <li className="px-4 py-2 font-medium">{item.IP} </li>
                                      <li className="px-4 py-2 flex flex-row gap-2">
                                          <div className="relative group">
                                              <FaCircleInfo 
                                              onClick={() => setDetailsModalOpen(true)}
                                              className="w-5 h-5 cursor-pointer text-[#19405A] hover:text-[#317CB0]" />
                                              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 mb-1 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                              {t('details')}
                                              </span>
                                          </div>
                                      </li>

                                  </div>
                                  
                              </ul>
                          </div>
                          )}
                      </div>
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-2 border text-center">
                    {t('td_no_results_found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-4 space-x-1">
          <button
            onClick={() => paginate(1)}
            className="px-3 py-1 bg-none text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="px-3 py-1 bg-none text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {renderPageNumbers()} {/* PAGE NUMBERS */}
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-3 py-1 bg-none text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            onClick={() => paginate(totalPages)}
            className="px-3 py-1 bg-none text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
      <ToastContainer />

      {isDetailsModalOpen && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          handleClose={() => setDetailsModalOpen(false)}
          batchDetails={'UploadedFiles'}
          fileId={fileId}
        />
      )}

    </div>
  );

  // return (
  //   <div className="max-h-screen bg-gray-200 p-4 sm:p-6 md:p-8">
  //     {loading && (<LoadingModal />)}
  
  //     <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg">
  
  //       {/* Page Title */}
  //       <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center mb-6 sm:mb-8">
  //         <FaFolder className="text-[#D95F08] mr-2" />
  //         {t('batch_uploaded_files')}
  //       </h2>
  
  //       {/* Search Area */}
  //       <div className="relative flex justify-end gap-2 sm:gap-4 mb-4">
  //         <input
  //           type='text'
  //           value={searchInput}
  //           onChange={handleSearch}
  //           placeholder={t('search')}
  //           className='w-1/2 sm:w-1/5 h-10 border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400' 
  //         />
  //         {!searchInput ? (
  //           <Search 
  //               color='#BFBFBF'
  //               className='absolute right-2 top-1/2 -translate-y-1/2' 
  //           />) 
  //           : (
  //           <X 
  //               color='#BFBFBF'
  //               onClick={() => setSearchInput('')}
  //               className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' 
  //           />) 
  //         }
  //       </div>
  
  //       {/* Table Content */}
  //       <div className="overflow-x-auto">
  //         <table className="min-w-full divide-y table-auto border-collapse rounded-lg overflow-visible shadow-md text-xs sm:text-sm">
  //           <thead className="bg-[#D95F08] text-white">
  //             <tr className="divide-x divide-gray-200">
  //               {["file_id", "date_created", "date_uploaded", "file_name", "status", "confirmed_by", "date_confirmed", "approved_by", "date_approved"].map((key, idx) => (
  //                 <th
  //                   key={idx}
  //                   className="px-2 py-2 sm:px-4 cursor-pointer group hover:bg-blue-400"
  //                   onClick={() => requestSort(key.toUpperCase())}
  //                 >
  //                   <span className="flex items-center justify-between">
  //                     {t(key)}
  //                     <ArrowDownUp className="inline-block ml-1 w-4 h-4"/>
  //                   </span>
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody className="text-center divide-y divide-gray-200">
  //             {currentItems.length > 0 ? (
  //               currentItems.map((item, index) => (
  //                 <tr key={index} className="cursor-default">
  //                   <td className="px-2 py-2 sm:px-4 whitespace-nowrap">{item.FILEID}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.CREATEDTIMESTAMP}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.LOADEDTIMESTAMP}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.FILENAME}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.STATUS}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.CONFIRMEDBY}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.DATECONFIRMED}</td>
  //                   <td className="px-2 py-2 sm:px-4">{item.APPROVEDBY}</td>
  //                   <td className="px-2 py-2 sm:px-4 relative group">
  //                     <div className="flex items-center justify-between w-full">
  //                       <span>{item.DATEAPPROVED}</span>
  //                       <EllipsisVertical 
  //                         className="ml-2 cursor-pointer hover:text-[#D95F08]" 
  //                         onClick={() => {
  //                           handleEllipsisClick(index);
  //                           setFileId(item.FILEID);
  //                         }}
  //                       />
  //                     </div>
  //                     {dropdownVisible === index && (
  //                       <div
  //                         ref={dropdownRef}
  //                         className="absolute right-0 mt-2 w-max bg-white border border-gray-200 rounded shadow-lg z-50 text-left"
  //                       >
  //                         <ul className="flex flex-row gap-1 text-xs sm:text-sm">
  //                           <div>
  //                             <li className="px-4 py-2">{t('uploaded_by')}:</li>
  //                             <li className="px-4 py-2">{t('msisdn')}:</li>
  //                             <li className="px-4 py-2">{t('ip')}:</li>
  //                             <li className="px-4 py-2">{t('action')}:</li>
  //                           </div>
  //                           <div>
  //                             <li className="px-4 py-2 font-medium">{item.UPLOADEDBY}</li>
  //                             <li className="px-4 py-2 font-medium">{item.MSISDN}</li>
  //                             <li className="px-4 py-2 font-medium">{item.IP}</li>
  //                             <li className="px-4 py-2 flex flex-row gap-2">
  //                               <div className="relative group">
  //                                 <FaCircleInfo 
  //                                   onClick={() => setDetailsModalOpen(true)}
  //                                   className="w-5 h-5 cursor-pointer text-[#19405A] hover:text-[#317CB0]" 
  //                                 />
  //                                 <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 mb-1 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
  //                                   {t('details')}
  //                                 </span>
  //                               </div>
  //                             </li>
  //                           </div>
  //                         </ul>
  //                       </div>
  //                     )}
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td colSpan="9" className="px-4 py-2 border text-center">
  //                   {t('td_no_results_found')}
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  
  //       {/* PAGINATION */}
  //       <div className="flex justify-center mt-4 flex-wrap gap-1">
  //         <button
  //           onClick={() => paginate(1)}
  //           className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
  //           disabled={currentPage === 1}
  //         >«</button>
  //         <button
  //           onClick={() => paginate(currentPage - 1)}
  //           className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
  //           disabled={currentPage === 1}
  //         >‹</button>
  //         {renderPageNumbers()}
  //         <button
  //           onClick={() => paginate(currentPage + 1)}
  //           className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
  //           disabled={currentPage === totalPages}
  //         >›</button>
  //         <button
  //           onClick={() => paginate(totalPages)}
  //           className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
  //           disabled={currentPage === totalPages}
  //         >»</button>
  //       </div>
  //     </div>
  
  //     <ToastContainer />
  
  //     {isDetailsModalOpen && (
  //       <DetailsModal
  //         isOpen={isDetailsModalOpen}
  //         onClose={() => setDetailsModalOpen(false)}
  //         handleClose={() => setDetailsModalOpen(false)}
  //         batchDetails={'UploadedFiles'}
  //         fileId={fileId}
  //       />
  //     )}
  //   </div>
  // );


};

export default BatchUploadedFiles;
