"use client";

import React from 'react';

interface HeaderProps {
  isDarkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode = true }) => {
  return (
    <header className="relative z-10 px-6 pt-4 sm:pt-6 pb-2 flex flex-col items-center">
      <div className="w-full flex justify-end items-center mb-0">
        <div className="relative">
          <img 
            src="https://i.ibb.co/ns0t1D5p/aqui.png" 
            alt="Avatar" 
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 shadow-xl ${isDarkMode ? 'border-white/20' : 'border-black/10'}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-inherit rounded-full"></div>
        </div>
      </div>
    </header>
  );
};