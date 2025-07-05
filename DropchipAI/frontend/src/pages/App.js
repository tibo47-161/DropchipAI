// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout components
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Dashboard from '../components/Dashboard';
import ProductResearch from './product_research.jsx';
// import SupplierScorer from './SupplierScorer';
import BulkLister from './bulk_lister.jsx';
import StockMonitor from '../components/StockMonitor';
// import ImageEditor from './ImageEditor'; // ggf. auskommentieren, wenn nicht vorhanden
// import Settings from './Settings';
// import Profile from './Profile';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Subscription from './Subscription.js';
// import NotFound from './NotFound'; // ggf. auskommentieren, wenn nicht vorhanden

// Auth context
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/product-research" element={<ProductResearch />} />
                {/* <Route path="/supplier-scorer" element={<SupplierScorer />} /> */}
                <Route path="/bulk-lister" element={<BulkLister />} />
                <Route path="/stock-monitor" element={<StockMonitor />} />
                {/* <Route path="/image-editor" element={<ImageEditor />} /> */}
                {/* <Route path="/settings" element={<Settings />} /> */}
                {/* <Route path="/profile" element={<Profile />} /> */}
                <Route path="/subscription" element={<Subscription />} />
              </Route>
              
              {/* 404 route */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
