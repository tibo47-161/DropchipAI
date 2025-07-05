import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import api from '../services/api';

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { currentPlan, tokenUsage, getTokenUsagePercentage, getRemainingTokens } = useSubscription();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    averageMargin: 0,
    activeListings: 0,
    pendingOrders: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const dashboardStats = await api.getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch revenue data
        const revenueStats = await api.getRevenueStats('month');
        setRevenueData(revenueStats.data);
        
        // Fetch category distribution
        setCategoryData([
          { name: 'Electronics', value: 35 },
          { name: 'Home & Kitchen', value: 25 },
          { name: 'Fashion', value: 15 },
          { name: 'Beauty', value: 10 },
          { name: 'Sports', value: 8 },
          { name: 'Toys', value: 7 }
        ]);
        
        // Fetch platform distribution
        setPlatformData([
          { name: 'Shopify', value: 65 },
          { name: 'eBay', value: 35 }
        ]);
        
        // Fetch trending products
        const trending = await api.getTrendingProducts('all', 5);
        setTrendingProducts(trending);
        
        // Mock top suppliers
        setTopSuppliers([
          { id: 1, name: 'TechSupplier Inc.', score: 92, orders: 48 },
          { id: 2, name: 'GlobalGoods Ltd.', score: 88, orders: 36 },
          { id: 3, name: 'PremiumProducts Co.', score: 95, orders: 29 },
          { id: 4, name: 'EcoFriendly Supplies', score: 86, orders: 22 }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Format date for tooltip
  const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded shadow-lg`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          Dashboard
        </h1>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Overview of your dropshipping business performance
        </p>
        
        {/* Subscription Info */}
        <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentPlan?.name || 'Free'} Plan
              </h2>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentPlan?.price ? `€${currentPlan.price}/month` : 'Free'}
              </p>
            </div>
            {tokenUsage.total > 0 && (
              <div className="mt-4 md:mt-0 md:ml-6 flex-1 max-w-md">
                <div className="flex justify-between text-sm">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Tokens</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {tokenUsage.used} / {tokenUsage.total} ({getRemainingTokens()} remaining)
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
        
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Revenue
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(stats.totalRevenue)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Profit
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(stats.totalProfit)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Average Margin
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatPercentage(stats.averageMargin)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Sales
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.totalSales}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Listings
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.activeListings}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Pending Orders
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.pendingOrders}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Revenue & Profit
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last 30 days performance
          </p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
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
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Distribution Charts */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sales by Category
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Distribution of sales across product categories
            </p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sales by Platform
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Distribution of sales across selling platforms
            </p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip />
                  <Bar dataKey="value" name="Sales %" fill="#8884d8">
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Trending Products & Top Suppliers */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Trending Products
              </h3>
              <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Top performing products based on sales and trends
              </p>
            </div>
            <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {trendingProducts.map((product) => (
                <li key={product.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img className="h-12 w-12 rounded-md object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatCurrency(product.price)} · {product.sales} sales
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.trendScore > 85 ? 'bg-green-100 text-green-800' : 
                        product.trendScore > 75 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.trendScore}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Suppliers
              </h3>
              <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your best performing suppliers
              </p>
            </div>
            <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {topSuppliers.map((supplier) => (
                <li key={supplier.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                      <svg className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {supplier.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {supplier.orders} orders
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        supplier.score >= 90 ? 'bg-green-100 text-green-800' : 
                        supplier.score >= 80 ? 'bg-green-100 text-green-800' : 
                        supplier.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        Score: {supplier.score}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
