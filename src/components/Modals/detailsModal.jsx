import React, { useState, useEffect } from "react";
import { X, Search, ChevronDown, ArrowDownUp } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from "react-toastify";
import { batchDetailsData } from "../../api/batch";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Loadingmodal from '../../components/Modals/Loadingmodal';

const DetailsModal = ({ batchDetails, fileId, handleClose = () => {} }) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "fileId", direction: "ascending" });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      setLoading(true);

      try {
        const { success, batchDataFile, message } = await batchDetailsData(fileId);
        if (success) {
          let parsedData = Array.isArray(batchDataFile) ? batchDataFile : [batchDataFile];
          setFiles(
            parsedData.map((file) => ({
              FILEID: file.fileId || '',
              REFERENCEID: file.referenceId || '',
              LOADEDTIMESTAMP: file.loadedTimeStamp || '',
              FRMSISDN: file.frMsisdn || '',
              TOMSISDN: file.toMsisdn || '',
              AMOUNT: file.amount || '',
              REFERENCE: file.reference || '',
              REFERENCETO: file.referenceTo || '',
              WALLETID: file.walletId || '',
              REMARKS: file.remarks || '',
              FIRSTNAME: file.firstName || '',
              LASTNAME: file.lastName || '',
              TYPE: file.type || '',
            }))
          );
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBatchDetails();
  }, [fileId]);

  const totalTransactions = files.length;

  const totalAmount = files.reduce((sum, item) => {
    const amount = parseFloat(item.AMOUNT.replace(/\s+/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const fileExtensions = ["CSV", "XLSX", "PDF"];

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  
  const handleDownload = (extension) => {
    const dataToDownload = files.map(item => ({
      FILEID: item.FILEID,
      REFERENCEID: item.REFERENCEID,
      LOADEDTIMESTAMP: item.LOADEDTIMESTAMP,
      FRMSISDN: item.FRMSISDN,
      TOMSISDN: item.TOMSISDN,
      FIRSTNAME: item.FIRSTNAME,
      LASTNAME: item.LASTNAME,
      AMOUNT: item.AMOUNT,
      REFERENCE: item.REFERENCE,
      REFERENCETO: item.REFERENCETO,
      WALLETID: item.WALLETID,
      TYPE: item.TYPE,
      REMARKS: item.REMARKS === '0' ? 'For Processing' : item.REMARKS, // Correctly mapped to show "For Processing"
    }));
  
    const tableColumns = ["FILE ID", "REFERENCE ID", "TIMESTAMP", "FROM MSISDN", "TO MSISDN", "FIRST NAME", "LAST NAME", "AMOUNT", "REFERENCE 1", "REFERENCE 2", "WALLET ID", "TOMSISDN TYPE", "REMARKS"];
  
    if (extension === "CSV") {
      const csvContent = [
        ["Total Transactions", totalTransactions],
        ["Total Amount", totalAmount.toLocaleString()],
        tableColumns,
        ...dataToDownload.map(Object.values)
      ];
      const csv = Papa.unparse(csvContent);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "batch_details.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (extension === "XLSX") {
      const worksheetData = [
        ["Total Transactions", totalTransactions],
        ["Total Amount", totalAmount.toLocaleString()],
        tableColumns,
        ...dataToDownload.map(Object.values)
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "batch_details.xlsx");
    } else if (extension === "PDF") {
      const doc = new jsPDF({ orientation: "landscape" });
      const tableRows = dataToDownload.map(Object.values);
  
      doc.setFontSize(7);
      doc.text("Total Transactions: " + totalTransactions, 14, 10);
      doc.text("Total Amount: " + totalAmount.toLocaleString(), 14, 15);
  
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 7 }
      });
  
      doc.save("batch_details.pdf");
    }
  
    toast.success(`${extension} is being downloaded`);
    setIsDropdownOpen(false);
  };  

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

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
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    <div className="fixed -inset-2 flex items-center justify-center z-50 bg-black bg-opacity-50 px-10">
      {loading && (<Loadingmodal />)}

      <div className="bg-white rounded-lg shadow-lg max-w-max w-full pb-6 border-2 border-blue-500">
        <div className="flex justify-between flex-row items-center bg-indigo-600 rounded-t-sx p-2">
          <div className="flex flex-row">
            <h2 className="text-xl font-semibold text-white">
              {t('modal_batch_details')}
            </h2>
          </div>
          <div>
            <X className="cursor-pointer text-white" onClick={handleClose} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 p-5">
          <div>
            <h3 className="text-sm">
              {t('modal_total_transactions')}
              <span className="font-bold">{totalTransactions}</span>
            </h3>
            <h3 className="text-sm">
              {t('modal_total_amount')}
              <span className="font-bold">{totalAmount.toLocaleString()}</span>
            </h3>
          </div>
          <div>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 items-center"
              >
                {t('modal_download_button')}
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                  {fileExtensions.map((ext) => (
                    <li
                      key={ext}
                      onClick={() => handleDownload(ext)}
                      className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                    >
                      {ext}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex justify-end gap-4 mb-4 mr-5">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder={t('search')}
            className="w-2/5 h-10 border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-bg-blue-400"
          />
          {!searchInput ? (
            <Search
              color="#BFBFBF"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            />
          ) : (
            <X
              color="#BFBFBF"
              onClick={() => setSearchInput('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            />
          )}
        </div>
        <div className="w-full overflow-x-auto">
        <table id="batchDetailsTable" className="min-w-content divide-y table-auto border-collapse rounded-lg overflow-visible shadow-md text-xs mx-4">
          <thead className="rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <tr className="divide-x divide-gray-200">
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("FILEID")}>
                <span className="flex items-center justify-between">
                  {t('file_id')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("REFERENCEID")}>
                <span className="flex items-center justify-between">
                  {t('reference_id')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("LOADEDTIMESTAMP")}>
                <span className="flex items-center justify-between">
                  {t('timestamp')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("FRMSISDN")}>
                <span className="flex items-center justify-between">
                  {t('from_msisdn')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("TOMSISDN")}>
                <span className="flex items-center justify-between">
                  {t('to_msisdn')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("FIRSTNAME")}>
                <span className="flex items-center justify-between">
                  {t('first_name')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("LASTNAME")}>
                <span className="flex items-center justify-between">
                  {t('last_name')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("AMOUNT")}>
                <span className="flex items-center justify-between">
                  {t('amount')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("REFERENCE")}>
                <span className="flex items-center justify-between">
                  {t('reference_one')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("REFERENCETO")}>
                <span className="flex items-center justify-between">
                  {t('reference_two')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("WALLETID")}>
                <span className="flex items-center justify-between">
                  {t('wallet_id')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
                </span>
              </th>
              <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("TYPE")}>
                <span className="flex items-center justify-between">
                  {t('tomsisdn_type')}
                  <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
              </span>
            </th>
            <th className="px-4 py-2 cursor-pointer group hover:blue-400" onClick={() => requestSort("REMARKS")}>
              <span className="flex items-center justify-between">
                {t('remarks')}
                <ArrowDownUp className="inline-block ml-1 w-4 h-4" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="text-center divide-y divide-gray-200">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index} className="cursor-pointer">
                <td className="px-4 py-2 whitespace-nowrap">{item.FILEID}</td>
                <td className="px-4 py-2">{item.REFERENCEID}</td>
                <td className="px-4 py-2">{item.LOADEDTIMESTAMP}</td>
                <td className="px-4 py-2">{item.FRMSISDN}</td>
                <td className="px-4 py-2">{item.TOMSISDN}</td>
                <td className="px-4 py-2">{item.FIRSTNAME}</td>
                <td className="px-4 py-2">{item.LASTNAME}</td>
                <td className="px-4 py-2">{item.AMOUNT}</td>
                <td className="px-4 py-2">{item.REFERENCE}</td>
                <td className="px-4 py-2">{item.REFERENCETO}</td>
                <td className="px-4 py-2">{item.WALLETID}</td>
                <td className="px-4 py-2">{item.TYPE}</td>
                <td className="px-4 py-2 max-w-xs">{item.REMARKS}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="px-4 py-2 border text-center">
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
        {renderPageNumbers()}
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

      <div className="flex justify-center gap-2 mt-6">
        <button
          type="submit"
          onClick={handleClose}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
        >
          {t('modal_ok')}
        </button>
      </div>
    </div>

    <ToastContainer />
  </div>
);
};

export default DetailsModal;