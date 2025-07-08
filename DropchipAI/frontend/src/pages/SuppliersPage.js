import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { FaSpinner, FaSort, FaSortUp, FaSortDown, FaStar } from 'react-icons/fa';

const SortableHeader = ({ children, sortKey, sortConfig, requestSort }) => {
  const getSortIcon = () => {
    if (sortConfig.key !== sortKey) {
      return <FaSort className="inline-block ml-2 text-gray-500" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="inline-block ml-2" /> : 
      <FaSortDown className="inline-block ml-2" />;
  };

  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
      onClick={() => requestSort(sortKey)}
    >
      {children} {getSortIcon()}
    </th>
  );
};

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'rating', direction: 'descending' });

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setError("Could not load supplier data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const sortedSuppliers = useMemo(() => {
    let sortableItems = [...suppliers];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [suppliers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-400" />
        <span className="ml-4 text-lg text-gray-300">Finding best suppliers...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 p-6 bg-gray-800 rounded-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Supplier Directory</h1>
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <SortableHeader sortKey="name" sortConfig={sortConfig} requestSort={requestSort}>Supplier</SortableHeader>
                <SortableHeader sortKey="rating" sortConfig={sortConfig} requestSort={requestSort}>Rating</SortableHeader>
                <SortableHeader sortKey="responseTime" sortConfig={sortConfig} requestSort={requestSort}>Response Time (hrs)</SortableHeader>
                <SortableHeader sortKey="on_time_delivery" sortConfig={sortConfig} requestSort={requestSort}>On-Time Delivery</SortableHeader>
                <SortableHeader sortKey="products" sortConfig={sortConfig} requestSort={requestSort}>Products</SortableHeader>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={supplier.image} alt={supplier.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{supplier.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center"><FaStar className="text-yellow-400 mr-1" /> {supplier.rating.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{supplier.responseTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{(supplier.on_time_delivery * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{supplier.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;