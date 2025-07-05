import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ShoppingCartIcon, 
  CogIcon, 
  UserGroupIcon, 
  SearchIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  LightningBoltIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  PhotographIcon,
  ClipboardCheckIcon
} from '@heroicons/react/outline';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Mock data for charts and metrics
  const recentProducts = [
    { id: 1, name: 'Smart Watch Pro', trend: 85, profit: 42, competition: 'Medium' },
    { id: 2, name: 'Wireless Earbuds', trend: 92, profit: 38, competition: 'High' },
    { id: 3, name: 'Fitness Tracker', trend: 78, profit: 45, competition: 'Low' },
    { id: 4, name: 'Bluetooth Speaker', trend: 65, profit: 32, competition: 'Medium' },
  ];
  
  const metrics = [
    { name: 'Active Listings', value: '124', change: '+12%', icon: <ShoppingCartIcon className="h-6 w-6" /> },
    { name: 'Monthly Revenue', value: '€4,385', change: '+8.2%', icon: <CurrencyDollarIcon className="h-6 w-6" /> },
    { name: 'Profit Margin', value: '32%', change: '+2.4%', icon: <TrendingUpIcon className="h-6 w-6" /> },
    { name: 'AI Tokens', value: '1,450', change: '-350', icon: <LightningBoltIcon className="h-6 w-6" /> },
  ];
  
  const supplierScores = [
    { name: 'Supplier A', score: 92, delivery: 4.8, price: 4.2, quality: 4.7 },
    { name: 'Supplier B', score: 86, delivery: 4.5, price: 4.6, quality: 4.0 },
    { name: 'Supplier C', score: 78, delivery: 4.2, price: 4.8, quality: 3.5 },
  ];
  
  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:hidden`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
        
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
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              alt="DropchipAi"
            />
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-900'}`}>
                <ChartBarIcon className="mr-4 h-6 w-6 text-indigo-500" aria-hidden="true" />
                Dashboard
              </a>
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <SearchIcon className="mr-4 h-6 w-6 text-indigo-400" aria-hidden="true" />
                Product Research
              </a>
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <UserGroupIcon className="mr-4 h-6 w-6 text-indigo-400" aria-hidden="true" />
                Supplier Scoring
              </a>
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <ShoppingCartIcon className="mr-4 h-6 w-6 text-indigo-400" aria-hidden="true" />
                Listings
              </a>
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <PhotographIcon className="mr-4 h-6 w-6 text-indigo-400" aria-hidden="true" />
                Image Editor
              </a>
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <ClipboardCheckIcon className="mr-4 h-6 w-6 text-indigo-400" aria-hidden="true" />
                Stock Monitor
              </a>
              <a href="#" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <CogIcon className="mr-4 h-6 w-6 text-indigo-400" aria-hidden="true" />
                Settings
              </a>
            </nav>
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
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="DropchipAi"
              />
              <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'}`}>DropchipAi</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-900'}`}>
                  <ChartBarIcon className="mr-3 h-6 w-6 text-indigo-500" aria-hidden="true" />
                  Dashboard
                </a>
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <SearchIcon className="mr-3 h-6 w-6 text-indigo-400" aria-hidden="true" />
                  Product Research
                </a>
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <UserGroupIcon className="mr-3 h-6 w-6 text-indigo-400" aria-hidden="true" />
                  Supplier Scoring
                </a>
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <ShoppingCartIcon className="mr-3 h-6 w-6 text-indigo-400" aria-hidden="true" />
                  Listings
                </a>
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <PhotographIcon className="mr-3 h-6 w-6 text-indigo-400" aria-hidden="true" />
                  Image Editor
                </a>
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <ClipboardCheckIcon className="mr-3 h-6 w-6 text-indigo-400" aria-hidden="true" />
                  Stock Monitor
                </a>
                <a href="#" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <CogIcon className="mr-3 h-6 w-6 text-indigo-400" aria-hidden="true" />
                  Settings
                </a>
              </nav>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Professional Plan</span>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">Active</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Tokens</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>1,450 / 2,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '72.5%' }}></div>
                </div>
              </div>
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
                onClick={() => setDarkMode(!darkMode)}
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
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                      JD
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className={`flex-1 relative overflow-y-auto focus:outline-none ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Metrics */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {metrics.map((metric) => (
                    <div key={metric.name} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
                            {metric.icon}
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {metric.name}
                              </dt>
                              <dd>
                                <div className={`text-lg font-m
(Content truncated due to size limit. Use line ranges to read in chunks)