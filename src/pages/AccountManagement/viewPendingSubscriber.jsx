import React, { useState, useEffect } from "react";
import { Search, ArrowDownUp, X } from "lucide-react";
import { FaEye } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import { viewPendingSubs } from "../../api/subscriber";
import LoadingModal from '../../components/Modals/loadingModal';

const ViewPendingSubscriber = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "firstname", direction: "ascending" });

   const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingSubs = async () => {
      setLoading(true);
      try {
        const result = await viewPendingSubs();
        if (result.success) {
          const parsedAccounts = JSON.parse(result.account);
          if (Array.isArray(parsedAccounts)) {
            setAccounts(
              parsedAccounts.map((account) => ({
                FIRSTNAME: account.FIRSTNAME || '',
                LASTNAME: account.LASTNAME || '',
                MSISDN: account.MSISDN || '',
                STATUS: account.STATUS || '',
              }))
            );
          } else {
            setError("Invalid account data format");
          }
        } else {
          setError(result.message || "Invalid data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPendingSubs();
  }, []);

  const { t, i18n } = useTranslation();

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const sortedData = [...accounts].sort((a, b) => {
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
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 mx-1 hover:bg-[#F3EEEB] rounded-full text-sm ${currentPage === i ? 'bg-[#F4E6DC] text-black' : ' text-gray-700'}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-200 px-4 py-6 sm:px-6 lg:px-8">
      {loading && <LoadingModal />}
  
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        
        {/* Page Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center mb-6 sm:mb-10 text-center">
          <FaEye className="text-blue-500 mr-2" />
          {t('view_pending_subscriber')}
        </h2>
  
        {/* Search Area */}
        <div className="relative flex justify-end mb-4">
          <div className="w-full sm:w-1/3 relative">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearch}
              placeholder={t('search')}
              className="w-full h-10 border border-gray-400 rounded pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
        </div>
  
        {/* Table Content */}
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y table-auto border-collapse rounded-lg overflow-hidden shadow-md">
        <thead className="rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm sm:text-base">
              <tr className="divide-x divide-gray-200">
                <th
                  className="px-4 py-2 cursor-pointer hover:bg-blue-400"
                  onClick={() => requestSort("FIRSTNAME")}
                >
                  <span className="flex items-center justify-between">
                    {t('first_name')}
                    <ArrowDownUp className="ml-1 w-4 h-4" />
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer hover:bg-blue-400"
                  onClick={() => requestSort("LASTNAME")}
                >
                  <span className="flex items-center justify-between">
                    {t('last_name')}
                    <ArrowDownUp className="ml-1 w-4 h-4" />
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer hover:bg-blue-400"
                  onClick={() => requestSort("MSISDN")}
                >
                  <span className="flex items-center justify-between">
                    {t('msisdn')}
                    <ArrowDownUp className="ml-1 w-4 h-4" />
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer hover:bg-blue-400"
                  onClick={() => requestSort("STATUS")}
                >
                  <span className="flex items-center justify-between">
                    {t('status')}
                    <ArrowDownUp className="ml-1 w-4 h-4" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-center divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.FIRSTNAME}
                    </td>
                    <td className="px-4 py-2">{item.LASTNAME}</td>
                    <td className="px-4 py-2">{item.MSISDN}</td>
                    <td className="px-4 py-2">{item.STATUS}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 border text-center">
                    {t('td_no_results_found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          <button
            onClick={() => paginate(1)}
            className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            onClick={() => paginate(totalPages)}
            className="px-3 py-1 text-xl text-[#19405A] font-bold rounded-full hover:bg-[#F3EEEB]"
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
  
  
};

export default ViewPendingSubscriber;
