
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
        <p className="text-center text-gray-300 mt-4 font-light">
          Loading cosmic data...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
