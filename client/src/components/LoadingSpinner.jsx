import React from 'react';
import { FiLoader } from 'react-icons/fi';

export const LoadingSpinner = ({ fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <FiLoader className="animate-spin text-brandIndigo text-4xl shadow-neonIndigo" />
      <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Syncing Portal...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkBg/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
};

export default LoadingSpinner;
