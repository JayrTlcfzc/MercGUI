import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { ClipboardPlus, Search, ArrowDownUp, X, Download} from "lucide-react";
import RequestReportModal from "../../components/Modals/requestReportModal";
import { useTranslation } from "react-i18next";
import { generateReview, generateDataPDF, downloadPDF, downloadCSV } from '../../api/reports';
import LoadingModal from '../../components/Modals/LoadingModal';

const RequestReports = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: "ID", direction: "descending" });
    const [openModal, setOpenModal] = useState('');
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const [genReviewData, setGenReviewData] = useState([]);
    const [dateFromArray, setDateFromArray] = useState([]);
    const [dateToArray, setDateToArray] = useState([]);
    const [transTypeArray, setTransTypeArray] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pdfData, setPdfData] = useState([]);
    const downloadLinkRef = useRef(null);

    useEffect(() => {
        const fetchGenerateReview = async () => {
            setLoading(true);
            try {
    
            const { success, rowData, dateFrom, dateTo, transType, message } = await generateReview();
    
                if (success) {
                    let parsedData;
                    if (Array.isArray(rowData)) {
                        parsedData = rowData[0];
                    } else {
                        parsedData = rowData; 
                    }
    
                    if (parsedData) {
                        parsedData = Array.isArray(rowData) ? rowData : [rowData];
    
                        setGenReviewData(JSON.parse(parsedData));
                        setDateFromArray(dateFrom);
                        setDateToArray(dateTo);
                        setTransTypeArray(transType);
    
                    }
                    else {
                        toast.error("Something went wrong!");
                    }
                } else {
                    setError(result.message || 'Invalid data format');
                    toast.error("Something went wrong!");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchGenerateReview();
    }, [isViewModalOpen]);

    const handleViewModal = () => setViewModalOpen(true);

    const handleProceedStatus = () => {
        setViewModalOpen(false)
        setModalState({ isOpen: true, status: 'success', message: 'Action Successful!' });
    }

    const handleSearch = (event) => {
        setSearchInput(event.target.value);
    };

    const sortedData = [...genReviewData].sort((a, b) => {
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

    const getReportStatus = (status) => {
        if (status == 0) {
            return (
            <div className="p-1 bg-[#4CBB17] text-sm text-white rounded-lg">
                Reports has been generated
            </div> 
            )
        } if (status == 1) {
            return (
                <div className="p-1 bg-[#FF5733] text-sm text-white rounded-lg">
                    Pending
                </div> 
            )
        } if (status == 2) {
            return (
                <div className="p-1 bg-sky-600 text-sm text-white rounded-lg">
                    Processing
                </div> 
            )
        } if (status == 100) {
            return (
                <div className="p-1 bg-[#727272] text-sm text-white rounded-lg">
                    No Records Found
                </div> 
            )
        }
    }

    const getDownloadButton = (status, id, reportname) => {
        if (status == 0) {
            return (
                <div className="flex">
                     <a ref={downloadLinkRef} >
                        <button
                            onClick={() => {
                                generateCVS(id)
                            }}
                            className="flex p-2 m-1 bg-[#408a1e] text-xs text-white rounded-md shadow-lg hover:bg-[#67c73a]">
                            <Download className="inline-block mr-1 w-4 h-4"/>
                            CSV
                        </button>
                    </a>
                    <button
                        onClick={() => {
                            fetchGenerateDataPDF(id, reportname)
                        }}
                        className=" flex p-2 m-1 bg-red-500 text-xs text-white rounded-md shadow-lg hover:bg-[#f66e6e]">
                        <Download className="inline-block mr-1 w-4 h-4"/>
                        PDF
                    </button>
                </div>
            )
        } else {
            return ('---')
        }
    }

    const fetchGenerateDataPDF = async (itemId, reportName) => {

        try {
            setLoading(true);
            const {success, message, dataFile} = await generateDataPDF(itemId);
                if (success) {
                    let parsedData;
                    if (Array.isArray(dataFile)) {
                        parsedData = dataFile[0];
                    } else {
                        parsedData = dataFile; 
                    }
    
                    if (parsedData) {
                        const pdfData = JSON.parse(parsedData);
                        setPdfData(pdfData);

                        const res = await downloadPDF(pdfData, reportName);
                    }
                    else {
                        toast.error(result.message || "Something went wrong!");
                    }
                } else {
                    setError(result.message || 'Invalid data format');
                    toast.error(result.message || "Something went wrong!");
                }
            } catch (err) {
                setError(err.message);
                toast.error(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
    }

    const generateCVS = async (itemId) => {
      try {
        setLoading(true);
    
        const { success, message, dataFile } = await downloadCSV(itemId);    
        if (success && dataFile?.REPORTFILENAME) {
          const fullServerPath = dataFile.REPORTFILENAME;
    
          // Extract sub-path after "/reports/"
          const relativePath = fullServerPath.split("/reports/")[1]; // e.g. SUBSCRIBER_ACCOUNT_SUMMARY/filename.zip
    
          const fileUrl = `https://demo.tlc-fzc.com/demoapp-merchant/reports/${relativePath}`;
          const fileName = fileUrl.split("/").pop();
    
          const link = downloadLinkRef.current;
          link.href = fileUrl;
          link.download = fileName;
          link.click();
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    

    return (
        <div className="min-h-screen bg-gray-200 p-4 sm:p-6 md:p-8">
          {loading && (<LoadingModal />)}
      
          <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      
            {/* Page Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center mb-6 sm:mb-10 text-center">
              <ClipboardPlus className="mr-2 text-blue-500" />
              {t('request_reports')}
            </h2>
      
            {/* Request Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-end">
              <button
                 className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
                onClick={handleViewModal}
              >
                {t('request')}
              </button>
            </div>
      
            {/* Search Area */}
            <div className="relative flex justify-end gap-2 mb-4">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearch}
                placeholder={t('search')}
                className="w-full sm:w-1/2 md:w-1/4 h-10 border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {!searchInput ? (
                <Search color="#BFBFBF" className="absolute right-3 top-1/2 -translate-y-1/2" />
              ) : (
                <X color="#BFBFBF" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
              )}
            </div>
      
            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y table-auto border-collapse rounded-lg overflow-hidden shadow-md text-xs sm:text-sm">
                <thead className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <tr className="divide-x divide-gray-200">
                    {/* Table headers */}
                    {[
                      { key: 'ID', label: 'report_id' },
                      { key: 'REPORTEDDATE', label: 'date_requested' },
                      { key: 'REPORTNAME', label: 'report_name' },
                      { key: 'REPORTTYPE', label: 'report_type' },
                      { key: '', label: 'date_from' },
                      { key: '', label: 'date_to' },
                      { key: '', label: 'transaction_type' },
                      { key: 'REPORTSTATUS', label: 'report_status' },
                      { key: '', label: 'action' },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        className={`px-2 sm:px-4 py-2 ${key ? 'cursor-pointer hover:bg-blue-400' : 'cursor-default'} group`}
                        onClick={key ? () => requestSort(key) : undefined}
                      >
                        <span className="flex items-center justify-between">
                          {t(label)}
                          {key && <ArrowDownUp className="inline-block ml-1 w-4 h-4" />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-center divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index} className="cursor-default">
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{item.ID}</td>
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{item.REPORTEDDATE}</td>
                        <td className="px-2 sm:px-4 py-2">{item.REPORTNAME}</td>
                        <td className="px-2 sm:px-4 py-2">{item.REPORTTYPE}</td>
                        <td className="px-2 sm:px-4 py-2">{dateFromArray[indexOfFirstItem + index]}</td>
                        <td className="px-2 sm:px-4 py-2">{dateToArray[indexOfFirstItem + index]}</td>
                        <td className="px-2 sm:px-4 py-2">{transTypeArray[indexOfFirstItem + index]}</td>
                        <td className="px-2 sm:px-4 py-2">{getReportStatus(item.REPORTSTATUS)}</td>
                        <td className="px-2 sm:px-4 py-2">{getDownloadButton(item.REPORTSTATUS, item.ID, item.REPORTNAME)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-2 border text-center">{t('td_no_results_found')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
      
            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-1">
              {['«', '‹'].map((symbol, i) => (
                <button
                  key={symbol}
                  onClick={() => paginate(i === 0 ? 1 : currentPage - 1)}
                  className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
                  disabled={currentPage === 1}
                >
                  {symbol}
                </button>
              ))}
              {renderPageNumbers()}
              {['›', '»'].map((symbol, i) => (
                <button
                  key={symbol}
                  onClick={() => paginate(i === 0 ? currentPage + 1 : totalPages)}
                  className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
                  disabled={currentPage === totalPages}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
      
          {/* Modal */}
          {isViewModalOpen && (
            <RequestReportModal
              isOpen={isViewModalOpen}
              handleClose={() => setViewModalOpen(false)}
              onProceed={handleProceedStatus}
            />
          )}
      
          <ToastContainer />
        </div>
      );
      
};

export default RequestReports;