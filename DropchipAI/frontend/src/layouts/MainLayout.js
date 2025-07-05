// src/layouts/MainLayout.js
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ShoppingCartIcon, 
  CogIcon, 
  UserGroupIcon, 
  SearchIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  LightningBoltIcon,
  PhotographIcon,
  ClipboardCheckIcon,
  UserCircleIcon,
  LogoutIcon,
  CreditCardIcon
} from '@heroicons/react/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useTheme } from '../contexts/ThemeContext';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, logout } = useAuth();
  const { currentPlan, tokenUsage, getTokenUsagePercentage } = useSubscription();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: ChartBarIcon },
    { name: 'Product Research', href: '/product-research', icon: SearchIcon },
    { name: 'Supplier Scorer', href: '/supplier-scorer', icon: UserGroupIcon },
    { name: 'Bulk Lister', href: '/bulk-lister', icon: ShoppingCartIcon },
    { name: 'Stock Monitor', href: '/stock-monitor', icon: ClipboardCheckIcon },
    { name: 'Image Editor', href: '/image-editor', icon: PhotographIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Mobile sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:hidden`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-4">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="DropchipAi"
            />
            <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'}`}>DropchipAi</span>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-indigo-100 text-indigo-900'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      location.pathname === item.href
                        ? 'text-indigo-500'
                        : darkMode
                        ? 'text-gray-400 group-hover:text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentPlan?.name || 'Free'} Plan
              </span>
              <Link to="/subscription" className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                {currentPlan?.isFree ? 'Upgrade' : 'Active'}
              </Link>
            </div>
            {tokenUsage.total > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Tokens</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {tokenUsage.used} / {tokenUsage.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${getTokenUsagePercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className={`flex flex-col w-64 ${darkMode ? 'bg-gray-800' : 'bg-white border-r border-gray-200'}`}>
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="DropchipAi"
              />
              <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'}`}>DropchipAi</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-indigo-100 text-indigo-900'
                        : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        location.pathname === item.href
                          ? 'text-indigo-500'
                          : darkMode
                          ? 'text-gray-400 group-hover:text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentPlan?.name || 'Free'} Plan
                </span>
                <Link to="/subscription" className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                  {currentPlan?.isFree ? 'Upgrade' : 'Active'}
                </Link>
              </div>
              {tokenUsage.total > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Tokens</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tokenUsage.used} / {tokenUsage.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${getTokenUsagePercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className={`relative z-10 flex-shrink-0 flex h-16 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white shadow'}`}>
          <button
            type="button"
            className={`px-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden`}
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className={`block w-full h-full pl-8 pr-3 py-2 border-transparent ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm`}
                    placeholder="Search products, suppliers..."
                    type="search"
                    name="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
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
              
              <button
                type="button"
                className={`ml-3 p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="relative">
                  <div className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                
                {/* Dropdown menu */}
                <div className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link to="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Subscription
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className={`flex-1 relative overflow-y-auto focus:outline-none ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
