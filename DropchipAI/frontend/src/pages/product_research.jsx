import React, { useState } from 'react';
import { 
  SearchIcon, 
  TrendingUpIcon, 
  ChartBarIcon, 
  ShoppingCartIcon,
  FilterIcon,
  SortAscendingIcon,
  ExternalLinkIcon,
  PlusCircleIcon,
  StarIcon
} from '@heroicons/react/outline';

export default function ProductResearch() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'beauty', name: 'Beauty & Personal Care' },
    { id: 'sports', name: 'Sports & Outdoors' },
    { id: 'toys', name: 'Toys & Games' },
  ];
  
  // Mock search results
  const mockResults = [
    {
      id: 1,
      name: 'Wireless Earbuds with Noise Cancellation',
      category: 'electronics',
      price: 45.99,
      trendScore: 92,
      profitMargin: 38,
      competition: 'Medium',
      monthlySales: 1250,
      image: 'https://via.placeholder.com/150',
      supplier: 'TechSupplier Inc.',
      supplierRating: 4.8
    },
    {
      id: 2,
      name: 'Smart Watch Fitness Tracker',
      category: 'electronics',
      price: 59.99,
      trendScore: 88,
      profitMargin: 42,
      competition: 'High',
      monthlySales: 980,
      image: 'https://via.placeholder.com/150',
      supplier: 'GadgetWorld',
      supplierRating: 4.5
    },
    {
      id: 3,
      name: 'Bamboo Shower Caddy Organizer',
      category: 'home',
      price: 29.99,
      trendScore: 85,
      profitMargin: 45,
      competition: 'Low',
      monthlySales: 750,
      image: 'https://via.placeholder.com/150',
      supplier: 'HomeEssentials',
      supplierRating: 4.7
    },
    {
      id: 4,
      name: 'Portable Blender for Smoothies',
      category: 'home',
      price: 34.99,
      trendScore: 82,
      profitMargin: 40,
      competition: 'Medium',
      monthlySales: 820,
      image: 'https://via.placeholder.com/150',
      supplier: 'KitchenGadgets',
      supplierRating: 4.6
    },
    {
      id: 5,
      name: 'LED Ring Light with Tripod Stand',
      category: 'electronics',
      price: 39.99,
      trendScore: 80,
      profitMargin: 35,
      competition: 'Medium',
      monthlySales: 680,
      image: 'https://via.placeholder.com/150',
      supplier: 'PhotoPro',
      supplierRating: 4.4
    },
  ];
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      let results = mockResults;
      
      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        results = results.filter(item => item.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery) {
        results = results.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Product Research
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
        
        {/* Search and filters */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search products</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className={`block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  placeholder="Search for products, niches, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="relative inline-block text-left">
                <select
                  className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Advanced filters - collapsible */}
          <div className="mt-4">
            <div className="flex items-center">
              <FilterIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} aria-hidden="true" />
              <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Advanced Filters:</span>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="min-price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Min Price ($)
                </label>
                <input
                  type="number"
                  name="min-price"
                  id="min-price"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="max-price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Max Price ($)
                </label>
                <input
                  type="number"
                  name="max-price"
                  id="max-price"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  placeholder="1000"
                />
              </div>
              <div>
                <label htmlFor="min-profit" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Min Profit Margin (%)
                </label>
                <input
                  type="number"
                  name="min-profit"
                  id="min-profit"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  placeholder="20"
                />
              </div>
              <div>
                <label htmlFor="competition" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Competition
                </label>
                <select
                  id="competition"
                  name="competition"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                >
                  <option value="">Any</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {searchResults.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
            <div className={`px-4 py-5 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'} sm:px-6 flex justify-between items-center`}>
              <div>
                <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Search Results
                </h3>
                <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Found {searchResults.length} products matching your criteria
                </p>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sort by:</span>
                <select
                  className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                >
                  <option>Trend Score</option>
                  <option>Profit Margin</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Monthly Sales</option>
                </select>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {searchResults.map((product) => (
                <li key={product.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-20 w-20">
                          <img className="h-20 w-20 rounded-md object-cover" src={product.image} alt={product.name} />
                        </div>
                        <div className="ml-4">
                          <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {product.name}
                          </h4>
                          <div className="mt-1 flex items-center">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Category: {categories.find(c => c.id === product.category)?.name}
                            </span>
                            <span className="mx-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center">
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                              <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                              <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                              <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                              <StarIcon className="h-4 w-4 text-gray-300" aria-hidden="true" />
                            </div>
                            <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Supplier: {product.supplier} ({product.supplierRating})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.trendScore > 85 ? 'bg-green-100 text-green-800' : product.trendScore > 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            <TrendingUpIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                            Trend: {product.trendScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}