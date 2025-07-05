// src/contexts/SubscriptionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const SubscriptionContext = createContext();

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokenUsage, setTokenUsage] = useState({ used: 0, total: 0 });
  const [billingHistory, setBillingHistory] = useState([]);

  // Available subscription plans
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Limited product research (5 products/month)',
        'Basic supplier scoring',
        'Manual listing creation',
        'Community support'
      ],
      tokens: 0,
      isFree: true
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      features: [
        'Extended product research (50 products/month)',
        'Advanced supplier scoring',
        'Basic automated listing generation',
        'Email support',
        '500 AI tokens per month'
      ],
      tokens: 500,
      isFree: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      features: [
        'Comprehensive product research (unlimited)',
        'Advanced supplier scoring with detailed analytics',
        'Bulk listing generation',
        'Stock monitoring (up to 1000 products)',
        'Priority email support',
        '2000 AI tokens per month'
      ],
      tokens: 2000,
      isFree: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      features: [
        'All Professional features',
        'Custom API access',
        'Advanced analytics dashboard',
        'Dedicated account manager',
        'White-label options',
        '5000 AI tokens per month',
        'Custom integrations'
      ],
      tokens: 5000,
      isFree: false
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionData();
    } else {
      setLoading(false);
      setCurrentPlan(null);
    }
  }, [isAuthenticated, currentUser]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscription/status');
      setCurrentPlan(response.data.plan);
      setTokenUsage({
        used: response.data.tokensUsed,
        total: response.data.tokensTotal
      });
      setBillingHistory(response.data.billingHistory || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
      setError('Failed to load subscription information');
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId) => {
    try {
      setError('');
      const response = await api.post('/subscription/subscribe', { planId });
      setCurrentPlan(response.data.plan);
      setTokenUsage({
        used: response.data.tokensUsed,
        total: response.data.tokensTotal
      });
      return response.data;
    } catch (error) {
      console.error('Subscription failed:', error);
      setError(error.response?.data?.message || 'Failed to subscribe to plan');
      throw error;
    }
  };

  const cancelSubscription = async () => {
    try {
      setError('');
      await api.post('/subscription/cancel');
      // Update to free plan
      const freePlan = plans.find(plan => plan.id === 'free');
      setCurrentPlan(freePlan);
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      setError(error.response?.data?.message || 'Failed to cancel subscription');
      throw error;
    }
  };

  const upgradePlan = async (newPlanId) => {
    try {
      setError('');
      const response = await api.post('/subscription/upgrade', { planId: newPlanId });
      setCurrentPlan(response.data.plan);
      setTokenUsage({
        used: response.data.tokensUsed,
        total: response.data.tokensTotal
      });
      return response.data;
    } catch (error) {
      console.error('Upgrade failed:', error);
      setError(error.response?.data?.message || 'Failed to upgrade subscription');
      throw error;
    }
  };

  const purchaseTokens = async (amount) => {
    try {
      setError('');
      const response = await api.post('/subscription/purchase-tokens', { amount });
      setTokenUsage({
        used: tokenUsage.used,
        total: response.data.tokensTotal
      });
      return response.data;
    } catch (error) {
      console.error('Token purchase failed:', error);
      setError(error.response?.data?.message || 'Failed to purchase tokens');
      throw error;
    }
  };

  const useTokens = async (amount, feature) => {
    try {
      setError('');
      const response = await api.post('/subscription/use-tokens', { amount, feature });
      setTokenUsage({
        used: response.data.tokensUsed,
        total: response.data.tokensTotal
      });
      return response.data.success;
    } catch (error) {
      console.error('Token usage failed:', error);
      setError(error.response?.data?.message || 'Failed to use tokens');
      throw error;
    }
  };

  const checkFeatureAccess = (featureId) => {
    if (!currentPlan) return false;
    
    // Map features to plan levels
    const featureMap = {
      'product_research_basic': ['free', 'starter', 'professional', 'enterprise'],
      'product_research_extended': ['starter', 'professional', 'enterprise'],
      'product_research_unlimited': ['professional', 'enterprise'],
      'supplier_scoring_basic': ['free', 'starter', 'professional', 'enterprise'],
      'supplier_scoring_advanced': ['starter', 'professional', 'enterprise'],
      'supplier_scoring_detailed': ['professional', 'enterprise'],
      'listing_manual': ['free', 'starter', 'professional', 'enterprise'],
      'listing_automated': ['starter', 'professional', 'enterprise'],
      'listing_bulk': ['professional', 'enterprise'],
      'stock_monitor': ['professional', 'enterprise'],
      'api_access': ['enterprise'],
      'white_label': ['enterprise'],
      'custom_integrations': ['enterprise']
    };
    
    return featureMap[featureId]?.includes(currentPlan.id) || false;
  };

  const getTokenUsagePercentage = () => {
    if (tokenUsage.total === 0) return 0;
    return Math.round((tokenUsage.used / tokenUsage.total) * 100);
  };

  const getRemainingTokens = () => {
    return tokenUsage.total - tokenUsage.used;
  };

  const value = {
    currentPlan,
    plans,
    loading,
    error,
    tokenUsage,
    billingHistory,
    subscribeToPlan,
    cancelSubscription,
    upgradePlan,
    purchaseTokens,
    useTokens,
    checkFeatureAccess,
    getTokenUsagePercentage,
    getRemainingTokens,
    refreshSubscription: fetchSubscriptionData
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
