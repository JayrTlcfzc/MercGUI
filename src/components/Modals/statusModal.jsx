
import { Dialog, DialogContent } from "../ui/dialog";
import { FaCircleCheck, FaTriangleExclamation } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";
import i18n from 'i18next';

const StatusModal = ({ isOpen, onClose, status, message }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
    const lang = i18n.language; 
    localStorage.setItem('i18nextLng', lang); 
    logout();
    window.location.href = '/demoapp-merchant/login'; 
  };

  const handleSuccessul = () => {
  const lang = i18n.language; 
  localStorage.setItem('i18nextLng', lang); 
  window.location.href = '/demoapp-merchant/web-users/view-web-users';
};

  const handleError = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      onConfirm={status === "successcp" ? handleSuccess : status === "successul" ? handleSuccessul : handleError}

    >
      <DialogContent className="modal-animation glass-effect sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center p-6">
          {status === "success" || status === "successcp" || status === "successul"
          ? (
            <FaCircleCheck className="w-20 h-20 text-blue-500 mb-4" />
          ) : (
            <FaTriangleExclamation className="w-20 h-20 text-[#C60000] mb-4" />
          )}
          <h2 className="text-2xl font-semibold mb-2">
            {status === "success" || status === "successcp" || status === "successul"
              ? `${t("modal_success")}`
              : `${t("modal_error")}`}
          </h2>
          <p className="text-center text-gray-600">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
