import React, { useState } from 'react';
import { 
  ShoppingCartIcon, 
  PhotographIcon,
  PencilAltIcon,
  DuplicateIcon,
  TrashIcon,
  PlusCircleIcon,
  ExternalLinkIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/outline';

export default function BulkLister() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Mock listings data
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Wireless Earbuds with Noise Cancellation',
      image: 'https://via.placeholder.com/150',
      platform: 'ebay',
      status: 'active',
      price: 79.99,
      cost: 45.99,
      profit: 34.00,
      margin: 42.5,
      views: 342,
      sales: 18,
      lastUpdated: '2025-03-28T14:30:00Z',
      selected: false
    },
    {
      id: 2,
      title: 'Smart Watch Fitness Tracker with Heart Rate Monitor',
      image: 'https://via.placeholder.com/150',
      platform: 'shopify',
      status: 'active',
      price: 89.99,
      cost: 52.99,
      profit: 37.00,
      margin: 41.1,
      views: 256,
      sales: 12,
      lastUpdated: '2025-03-30T09:15:00Z',
      selected: false
    },
    {
      id: 3,
      title: 'Bamboo Shower Caddy Organizer',
      image: 'https://via.placeholder.com/150',
      platform: 'ebay',
      status: 'draft',
      price: 49.99,
      cost: 29.99,
      profit: 20.00,
      margin: 40.0,
      views: 0,
      sales: 0,
      lastUpdated: '2025-04-01T16:45:00Z',
      selected: false
    },
    {
      id: 4,
      title: 'Portable Blender for Smoothies',
      image: 'https://via.placeholder.com/150',
      platform: 'shopify',
      status: 'active',
      price: 59.99,
      cost: 34.99,
      profit: 25.00,
      margin: 41.7,
      views: 189,
      sales: 8,
      lastUpdated: '2025-03-25T11:20:00Z',
      selected: false
    },
    {
      id: 5,
      title: 'LED Ring Light with Tripod Stand',
      image: 'https://via.placeholder.com/150',
      platform: 'ebay',
      status: 'out_of_stock',
      price: 69.99,
      cost: 39.99,
      profit: 30.00,
      margin: 42.9,
      views: 278,
      sales: 15,
      lastUpdated: '2025-03-20T08:10:00Z',
      selected: false
    },
  ]);
  
  // Toggle select all listings
  const toggleSelectAll = () => {
    const newSelected = !listings.every(listing => listing.selected);
    setListings(listings.map(listing => ({
      ...listing,
      selected: newSelected
    })));
  };
  
  // Toggle select individual listing
  const toggleSelectListing = (listingId) => {
    setListings(listings.map(listing => 
      listing.id === listingId 
        ? { ...listing, selected: !listing.selected } 
        : listing
    ));
  };
  
  // Filter listings based on platform and status
  const filteredListings = listings.filter(listing => {
    const platformMatch = selectedPlatform === 'all' || listing.platform === selectedPlatform;
    const statusMatch = selectedStatus === 'all' || listing.status === selectedStatus;
    return platformMatch && statusMatch;
  });
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get platform badge color and icon
  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'ebay':
        return {
          color: 'bg-blue-100 text-blue-800',
          name: 'eBay'
        };
      case 'shopify':
        return {
          color: 'bg-green-100 text-green-800',
          name: 'Shopify'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          name: platform
        };
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Bulk Lister
          </h1>
          <button
            type="button"
            className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => setDarkMode(!darkMode)}
          >
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
        
        {/* Action buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create New Listing
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Import Products
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChartBarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Bulk Price Optimizer
          </button>
        </div>
        
        {/* Filters */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="platform-filter" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Platform
              </label>
              <select
                id="platform-filter"
                name="platform-filter"
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="ebay">eBay</option>
                <option value="shopify">Shopify</option>
              </select>
            </div>
            <div>
              <label htmlFor="status-filter" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                id="status-filter"
                name="status-filter"
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="search" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className={`block w-full pl-3 pr-10 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  placeholder="Search listings..."
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Listings table */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-md`}>
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <div className="flex items-center h-5">
              <input
                id="select-all"
                name="select-all"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={listings.length > 0 && listings.every(listing => listing.selected)}
                onChange={toggleSelectAll}
              />
              <label htmlFor="select-all" className="sr-only">
                Select All
              </label>
            </div>
            <div className="ml-3">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {listings.filter(l => l.selected).length} selected
              </span>
            </div>
            <div className="ml-auto flex space-x-2">
              <button
                type="button"
                className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${listings.filter(l => l.selected).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={listings.filter(l => l.selected).length === 0}
              >
                <PencilAltIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${listings.filter(l => l.selected).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={listings.filter(l => l.selected).length === 0}
              >
                <DuplicateIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                Duplicate
              </button>
              <button
                type="button"
                className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${listings.filter(l => l.selected).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={listings.filter(l => l.selected).length === 0}
              >
                <TrashIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="sr-only">Select</span>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
              {filteredListings.map((listing) => (
                <tr key={listing.id} className={listing.selected ? (darkMode ? 'bg-gray-700' : 'bg-indigo-50') : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        id={`select-${listing.id}`}
                        name={`select-${listing.id}`}
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={listing.selected}
                        onChange={() => toggleSelectListing(listing.id)}
                      />
                      <label htmlFor={`select-${listing.id}`} className="sr-only">
                        Select
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={listing.image} alt="" />
                      </div>
                      <div className="ml-4">
                        {/* ...vermutlich weitere Inhalte... */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getPlatformBadge(listing.platform).name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getStatusBadgeColor(listing.status)}`}>{listing.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${listing.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${listing.profit.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${listing.margin.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(listing.lastUpdated)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}