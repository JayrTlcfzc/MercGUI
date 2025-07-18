import { useState } from 'react';
import StatusModal from '../../components/Modals/statusModal';
import { toast, ToastContainer } from 'react-toastify';
import { FaUpload } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { batchPaymentUpload, fileUpload } from '../../api/batch';
import LoadingModal from '../../components/Modals/loadingModal';
import { useNavigate } from 'react-router-dom';
import templateXlsx from '../../assets/Batch-Payment-Template.xlsx?url';


function BatchPaymentUpload() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setLoading(true);
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFilePath(`/var/www/html/demoapp-merchant/uploads/${selectedFile.name}`);
    } else {
      setFile(null);
      setFilePath('');
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        setLoading(true);
        const res = await batchPaymentUpload(file.name, filePath);

        if (res.success) {
          setStatusMessage({ type: 'success', text: t('file_upload_success') });

          const result = await fileUpload(formData);
          toast.success(res.message);

          if (result.success) {
            navigate('/demoapp-merchant/funds/batch-uploaded-files');
          } else {
            navigate('/funds/batch-uploaded-files');
          }
        } else {
          setStatusMessage({ type: 'error', text: res.message });
          toast.error(res.message);
        }
      } catch (error) {
        setStatusMessage({ type: 'error', text: 'Error in batch payment upload.' });
        toast.error('Error in batch payment upload.');
      } finally {
        setLoading(false);
      }
    } else {
      setStatusMessage({ type: 'error', text: t('no_file_uploaded') });
      toast.error(t('no_file_uploaded'));
    }
  };

  return (
    <div className="flex flex-col items-center p-4 cursor-default">
      {loading && <LoadingModal />}

      {/* Header */}
      <div className="flex flex-row text-center mb-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center text-center">
          <FaUpload className="text-blue-500 mr-2 text-xl md:text-2xl" />
          {t('batch_payment_upload')}
        </h2>
      </div>

      {/* File Upload Container */}
      <div className="relative w-full border-dashed border-2 border-blue-500 rounded-2xl p-6 md:p-10 mb-8 bg-white min-h-[20rem] flex flex-col justify-center items-center text-center">
        {/* Download Link */}
        <a
          href={templateXlsx}
          download
          className="absolute -top-8 right-0 text-blue-500 hover:underline"
        >
          {t('download_template_file')} (.xlsx)
        </a>

        <label
          htmlFor="file-upload"
          className="block w-1/6 bg-blue-500 hover:bg-indigo-600 tracking-wide shadow-md font-bold text-white py-2 px-4 rounded mt-16 mb-8 text-center cursor-pointer mx-auto"
        >
          {t('upload_file')}
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />

        <p className="text-gray-600 text-center">
          {t('upload_batch_excel')} (.xlsx, .xls)
        </p>

        {/* Filename (auto-reactive to i18n) */}
        <p className="text-gray-400 text-center">
          {file ? file.name : t('no_file_chosen')}
        </p>
      </div>

      {/* Submit Button */}
      <button
        className="bg-[#BFC3D2] hover:bg-[#9D9D9D] text-gray-800 font-bold py-2 px-6 rounded shadow-md tracking-wide focus:outline-none focus:ring-2 focus:ring-[#9D9D9D]/50 focus:ring-offset-2 transition"
        onClick={handleSubmit}
      >
        {t('submit')}
      </button>

      {/* Status Modal */}
      <StatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={statusMessage.type}
        message={statusMessage.text}
      />

      <ToastContainer />
    </div>
  );
}

export default BatchPaymentUpload;
