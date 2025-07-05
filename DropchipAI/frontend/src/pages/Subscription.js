// src/pages/Subscription.js
import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useTheme } from '../contexts/ThemeContext';
import { CheckIcon, XIcon } from '@heroicons/react/outline';

export default function Subscription() {
  const { darkMode } = useTheme();
  const { 
    currentPlan, 
    plans, 
    tokenUsage, 
    billingHistory,
    subscribeToPlan,
    cancelSubscription,
    upgradePlan,
    purchaseTokens,
    getTokenUsagePercentage,
    getRemainingTokens
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [additionalTokens, setAdditionalTokens] = useState(100);
  
  const handleSubscribe = async (planId) => {
    if (!planId) return;
    
    try {
      setIsProcessing(true);
      await subscribeToPlan(planId);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await cancelSubscription();
    } catch (error) {
      console.error('Cancellation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleUpgrade = async (planId) => {
    try {
      setIsProcessing(true);
      await upgradePlan(planId);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePurchaseTokens = async () => {
    try {
      setIsProcessing(true);
      await purchaseTokens(additionalTokens);
    } catch (error) {
      console.error('Token purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Subscription Management
        </h1>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage your subscription plan and AI token usage
        </p>
        
        {/* Current Plan */}
        <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Current Plan
              </h3>
              <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your active subscription details
              </p>
            </div>
            {currentPlan && !currentPlan.isFree && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isProcessing ? 'Processing...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className={`sm:divide-y ${darkMode ? 'sm:divide-gray-700' : 'sm:divide-gray-200'}`}>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Plan Name
                </dt>
                <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                  {currentPlan?.name || 'Free'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Price
                </dt>
                <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                  {currentPlan?.price ? `€${currentPlan.price}/month` : 'Free'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  AI Tokens
                </dt>
                <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                  {tokenUsage.total > 0 ? (
                    <div>
                      <div className="flex items-center">
                        <span>{tokenUsage.used} used of {tokenUsage.total} total ({getRemainingTokens()} remaining)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${getTokenUsagePercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    'No tokens available'
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Features
                </dt>
                <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {currentPlan?.features?.map((feature, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                          <span className="ml-2 flex-1 w-0 truncate">{feature}</span>
                        </div>
                      </li>
                    )) || (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                          <span className="ml-2 flex-1 w-0 truncate">Basic features</span>
                        </div>
                      </li>
                    )}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Purchase Additional Tokens */}
        {currentPlan && !currentPlan.isFree && (
          <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
            <div className="px-4 py-5 sm:px-6">
              <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Purchase Additional Tokens
              </h3>
              <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Need more AI tokens? Purchase additional tokens here.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="token-amount" className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Token Amount
                  </label>
                  <div className="mt-1">
                    <select
                      id="token-amount"
                      name="token-amount"
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                      value={additionalTokens}
                      onChange={(e) => setAdditionalTokens(Number(e.target.value))}
                    >
                      <option value="100">100 Tokens - €5</option>
                      <option value="500">500 Tokens - €20</option>
                      <option value="1000">1000 Tokens - €35</option>
                      <option value="2000">2000 Tokens - €60</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3 flex items-end">
                  <button
                    type="button"
                    onClick={handlePurchaseTokens}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isProcessing ? 'Processing...' : 'Purchase Tokens'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Available Plans */}
        <div className="mt-10">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Available Plans
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Choose the plan that best fits your needs
          </p>
          
          <div className="mt-6 grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id;
              const canUpgrade = currentPlan && !currentPlan.isFree && plan.price > currentPlan.price;
              const canDowngrade = currentPlan && !currentPlan.isFree && plan.price < currentPlan.price && !plan.isFree;
              
              return (
                <div
                  key={plan.id}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden ${isCurrentPlan ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div className={`px-6 py-8 ${isCurrentPlan ? 'bg-indigo-50 dark:bg-indigo-900' : ''}`}>
                    <h3 className={`text-center text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-4 flex justify-center">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isCurrentPlan ? 'bg-indigo-100 text-indigo-800' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                        {isCurrentPlan ? 'Current Plan' : ''}
                      </span>
                    </div>
                    <p className="mt-6 text-center">
                      <span className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{plan.price}
                      </span>
                      <span className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        /month
                      </span>
                    </p>
                    <p className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {plan.tokens > 0 ? `Includes ${plan.tokens} AI tokens per month` : 'No AI tokens included'}
                    </p>
                  </div>
                  <div className="px-6 pt-6 pb-8">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                      What's included:
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                          </div>
                          <p className={`ml-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      {isCurrentPlan ? (
                        <button
                          type="button"
                          disabled
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-400 cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : currentPlan?.isFree ? (
                        <button
                          type="button"
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={isProcessing || plan.isFree}
                          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${plan.isFree ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                          {isProcessing ? 'Processing...' : plan.isFree ? 'Current Plan' : 'Subscribe'}
                        </button>
                      ) : canUpgrade ? (
                        <button
                          type="button"
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          {isProcessing ? 'Processing...' : 'Upgrade'}
                        </button>
                      ) : canDowngrade ? (
                        <button
                          type="button"
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          {isProcessing ? 'Processing...' : 'Downgrade'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCancel()}
                          disabled={isProcessing || plan.isFree}
                          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${plan.isFree ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                          {isProcessing ? 'Processing...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}