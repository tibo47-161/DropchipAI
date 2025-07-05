// src/layouts/AuthLayout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function AuthLayout() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <button
          type="button"
          className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          onClick={toggleDarkMode}
        >
          <span className="sr-only">Toggle dark mode</span>
          {darkMode ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/logo.svg"
            alt="DropchipAi"
          />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          DropchipAi
        </h2>
        <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          AI-Powered Dropshipping Automation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          <Outlet />
        </div>
        
        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; {new Date().getFullYear()} DropchipAi. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
