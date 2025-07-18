import React from 'react';
import loadingSpin from '../../assets/loadingSpin.svg';
import nufinlogo from '../../assets/nufinlogo.png';

const LoadingModal = () => {
  return (
    <div className="fixed -inset-2 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative w-32 h-32">
        <img
          src={loadingSpin}
          alt="Loading Spinner"
          className="absolute inset-0 w-full h-full z-10"
        />
        <img
          src={nufinlogo}
          alt="Logo"
          className="absolute inset-0 w-12 h-12 m-auto z-0 rounded-full"
        />
      </div>
    </div>
  );
};

export default LoadingModal;
