import React from 'react';

const Logo = ({ className = "", size = 'default' }) => {
  // Determine size based on the prop
  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-12 h-12';
      default: return 'w-10 h-10';
    }
  };

  return (
    <div className={`relative ${getSizeClass()} ${className}`}>
      {/* Main plate circle with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border-2 border-white opacity-70"></div>
      </div>
      
      {/* Food items on plate */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Fork icon stylized */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-5/8 h-5/8 text-white" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14M12 19c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z" />
          <path d="M12 8l3.5 3.5M12 8l-3.5 3.5" />
        </svg>
      </div>
      
      {/* Steam effect */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <div className="w-1 h-3 bg-white rounded-full opacity-70 animate-pulse-slow"></div>
        <div className="w-1 h-4 bg-white rounded-full opacity-70 animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
        <div className="w-1 h-2 bg-white rounded-full opacity-70 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Drop element */}
      <div className="absolute -bottom-1 right-0 w-3 h-3 bg-blue-400 rounded-full opacity-80 shadow-lg"></div>
    </div>
  );
};

export default Logo;