import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function StockMonitor() {
  const { darkMode } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds with Noise Cancellation',
      sku: 'WE-NC-001',
      image: 'https://via.placeholder.com/150',
      currentStock: 42,
      stockStatus: 'in_stock',
      supplier: 'TechSupplier Inc.',
      currentPrice: 45.99,
      competitorPrice: 49.99,
      lastUpdated: '2025-04-01T14:30:00Z',
      priceAlert: false,
      stockAlert: false
    },
    {
      id: 2,
      name: 'Smart Watch Fitness Tracker',
      sku: 'SW-FT-002',
      image: 'https://via.placeholder.com/150',
      currentStock: 8,
      stockStatus: 'low_stock',
      supplier: 'GadgetWorld',
      currentPrice: 59.99,
      competitorPrice: 54.99,
      lastUpdated: '2025-04-02T09:15:00Z',
      priceAlert: true,
      stockAlert: true
    },
    {
      id: 3,
      name: 'Bamboo Shower Caddy Organizer',
      sku: 'BS-CO-003',
      image: 'https://via.placeholder.com/150',
      currentStock: 0,
      stockStatus: 'out_of_stock',
      supplier: 'HomeEssentials',
      currentPrice: 29.99,
      competitorPrice: 32.99,
      lastUpdated: '2025-04-01T16:45:00Z',
      priceAlert: false,
      stockAlert: true
    },
    {
      id: 4,
      name: 'Portable Blender for Smoothies',
      sku: 'PB-SM-004',
      image: 'https://via.placeholder.com/150',
      currentStock: 25,
      stockStatus: 'in_stock',
      supplier: 'KitchenGadgets',
      currentPrice: 34.99,
      competitorPrice: 29.99,
      lastUpdated: '2025-03-30T11:20:00Z',
      priceAlert: true,
      stockAlert: false
    },
    {
      id: 5,
      name: 'LED Ring Light with Tripod Stand',
      sku: 'LR-TS-005',
      image: 'https://via.placeholder.com/150',
      currentStock: 15,
      stockStatus: 'in_stock',
      supplier: 'PhotoPro',
      currentPrice: 39.99,
      competitorPrice: 42.99,
      lastUpdated: '2025-03-29T08:10:00Z',
      priceAlert: false,
      stockAlert: false
    },
  ];
  
  // Mock data for price history
  const generatePriceHistory = (productId) => {
    const today = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Base price depends on product
      let basePrice = 0;
      let competitorPrice = 0;
      
      switch (productId) {
        case 1:
          basePrice = 45.99;
          competitorPrice = 49.99;
          break;
        case 2:
          basePrice = 59.99;
          competitorPrice = 54.99;
          break;
        case 3:
          basePrice = 29.99;
          competitorPrice = 32.99;
          break;
        case 4:
          basePrice = 34.99;
          competitorPrice = 29.99;
          break;
        case 5:
          basePrice = 39.99;
          competitorPrice = 42.99;
          break;
        default:
          basePrice = 39.99;
          competitorPrice = 42.99;
      }
      
      // Add some random fluctuation
      const yourPrice = basePrice + (Math.random() * 6 - 3);
      const compPrice = competitorPrice + (Math.random() * 6 - 3);
      
      data.push({
        date: date.toISOString(),
        yourPrice: parseFloat(yourPrice.toFixed(2)),
        competitorPrice: parseFloat(compPrice.toFixed(2))
      });
    }
    
    return data;
  };
  
  // Mock data for stock history
  const generateStockHistory = (productId) => {
    const today = new Date();
    const data = [];
    
    // Initial stock level depends on product
    let stock = 0;
    
    switch (productId) {
      case 1:
        stock = 50;
        break;
      case 2:
        stock = 30;
        break;
      case 3:
        stock = 25;
        break;
      case 4:
        stock = 40;
        break;
      case 5:
        stock = 35;
        break;
      default:
        stock = 30;
    }
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate some sales and restocks
      if (i % 7 === 0) {
        // Restock day
        stock += Math.floor(Math.random() * 20) + 5;
      } else {
        // Sales day
        stock -= Math.floor(Math.random() * 5);
      }
      
      // Ensure stock doesn't go negative
      stock = Math.max(0, stock);
      
      data.push({
        date: date.toISOString(),
        stock: stock
      });
    }
    
    return data;
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await api.getProducts();
        // setProducts(response);
        
        // Using mock data for now
        setProducts(mockProducts);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setPriceHistory(generatePriceHistory(product.id));
    setStockHistory(generateStockHistory(product.id));
  };
  
  // Filter products based on search query and status filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'in_stock' && product.stockStatus === 'in_stock') ||
                         (filterStatus === 'low_stock' && product.stockStatus === 'low_stock') ||
                         (filterStatus === 'out_of_stock' && product.stockStatus === 'out_of_stock') ||
                         (filterStatus === 'price_alert' && product.priceAlert) ||
                         (filterStatus === 'stock_alert' && product.stockAlert);
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format date for tooltip
  const formatTooltipDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded shadow-lg`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatTooltipDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for stock chart
  const StockTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded shadow-lg`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatTooltipDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Stock Monitor
        </h1>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Track inventory levels and competitor prices
        </p>
        
        {/* Filters */}
        <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search products</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className={`block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                  placeholder="Search by product name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="status-filter" className="sr-only">Filter by status</label>
              <select
                id="status-filter"
                name="status-filter"
                className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Products</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="price_alert">Price Alert</option>
                <option value="stock_alert">Stock Alert</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Products
                </h3>
                <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filteredProducts.length} products found
                </p>
              </div>
              <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} max-h-[600px] overflow-y-auto`}>
                {filteredProducts.map((product) => (
                  <li 
                    key={product.id} 
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                      selectedProduct?.id === product.id 
                        ? darkMode 
                          ? 'bg-gray-700' 
                          : 'bg-indigo-50' 
                        : ''
                    } ${
                      darkMode && selectedProduct?.id !== product.id 
                        ? 'hover:bg-gray-700' 
                        : darkMode 
                          ? '' 
                          : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt="" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {product.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          SKU: {product.sku}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(product.stockStatus)}`}>
                          {getStatusText(product.stockStatus)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Stock: {product.currentStock} units
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ${product.currentPrice.toFixed(2)}
                      </div>
                    </div>
                    {(product.priceAlert || product.stockAlert) && (
                      <div className="mt-2 flex space-x-2">
                        {product.priceAlert && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <svg className="mr-1 h-3 w-3 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Price Alert
                          </span>
                        )}
                        {product.stockAlert && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <svg className="mr-1 h-3 w-3 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Stock Alert
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
                {filteredProducts.length === 0 && (
                  <li className="px-4 py-6 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No products found matching your criteria
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Product Details and Charts */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <div className="space-y-6">
                {/* Product Details */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedProduct.name}
                      </h3>
                      <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        SKU: {selectedProduct.sku} | Supplier: {selectedProduct.supplier}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedProduct.stockStatus)}`}>
                      {getStatusText(selectedProduct.stockStatus)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Current Stock
                        </dt>
                        <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                          {selectedProduct.currentStock} units
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Your Price
                        </dt>
                        <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                          ${selectedProduct.currentPrice.toFixed(2)}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Competitor Price
                        </dt>
                        <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2 flex items-center`}>
                          ${selectedProduct.competitorPrice.toFixed(2)}
                          {selectedProduct.priceAlert && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              <svg className="mr-1 h-3 w-3 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {selectedProduct.currentPrice > selectedProduct.competitorPrice ? 'Your price is higher' : 'Your price is lower'}
                            </span>
                          )}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last Updated
                        </dt>
                        <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                          {formatTooltipDate(selectedProduct.lastUpdated)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Price
                    </button>
                    <button
                      type="button"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
                
                {/* Price History Chart */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Price History
                  </h2>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last 30 days price comparison
                  </p>
                  <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={priceHistory}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="date" 
                          stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                          tickFormatter={formatDate}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="yourPrice" 
                          name="Your Price"
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="competitorPrice" 
                          name="Competitor Price"
                          stroke="#82ca9d" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Stock History Chart */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Stock History
                  </h2>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last 30 days inventory levels
                  </p>
                  <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stockHistory}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="date" 
                          stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                          tickFormatter={formatDate}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip content={<StockTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="stock" 
                          name="Stock Level"
                          stroke="#f59e0b" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-12 text-center`}>
                <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No product selected</h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select a product from the list to view details and history
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
