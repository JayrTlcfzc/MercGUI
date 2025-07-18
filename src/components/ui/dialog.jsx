import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

export const Dialog = ({ open, onOpenChange, onConfirm, children }) => {
  if (!open) return null;

  const modalRef = useRef(null);

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(); // Close the modal after confirmation
  };

  // Focus on the modal container when it opens
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  return (
    <div
      tabIndex={-1} // Makes the div focusable
      ref={modalRef} // Ref for focusing
      onKeyDown={handleEnterPress}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onOpenChange}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-max p-6 relative flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        {/* OK Button at the bottom */}
        <button
          onClick={handleConfirm}
           className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export const DialogContent = ({ className, children }) => {
  return (
    <div
      className={clsx('p-6 flex flex-col items-center justify-center space-y-4', className)}
    >
      {children}
    </div>
  );
};
