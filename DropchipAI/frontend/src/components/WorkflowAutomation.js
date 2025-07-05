import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function WorkflowAutomation() {
  const { darkMode } = useTheme();
  const { checkFeatureAccess, useTokens } = useSubscription();
  
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for creating/editing workflows
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'schedule',
    triggerConfig: {
      schedule: '0 0 * * *', // Daily at midnight
      event: 'new_order',
      condition: ''
    },
    actions: [
      {
        type: 'update_price',
        config: {
          target: 'all',
          adjustment: 'percentage',
          value: 5
        }
      }
    ],
    isActive: true
  });
  
  // Mock data for workflows
  const mockWorkflows = [
    {
      id: 1,
      name: 'Daily Price Optimization',
      description: 'Automatically adjusts prices based on competitor data every day',
      trigger: 'schedule',
      triggerConfig: {
        schedule: '0 0 * * *', // Daily at midnight
        event: '',
        condition: ''
      },
      actions: [
        {
          type: 'update_price',
          config: {
            target: 'all',
            adjustment: 'percentage',
            value: 5
          }
        }
      ],
      lastRun: '2025-04-01T00:00:00Z',
      nextRun: '2025-04-02T00:00:00Z',
      status: 'active',
      stats: {
        totalRuns: 30,
        successfulRuns: 28,
        failedRuns: 2,
        itemsProcessed: 142
      }
    },
    {
      id: 2,
      name: 'Low Stock Alert',
      description: 'Sends notification when product stock falls below threshold',
      trigger: 'event',
      triggerConfig: {
        schedule: '',
        event: 'stock_update',
        condition: 'stock < 10'
      },
      actions: [
        {
          type: 'send_notification',
          config: {
            channel: 'email',
            template: 'low_stock_alert'
          }
        },
        {
          type: 'create_task',
          config: {
            title: 'Restock {{product.name}}',
            priority: 'high'
          }
        }
      ],
      lastRun: '2025-03-30T14:23:15Z',
      nextRun: null,
      status: 'active',
      stats: {
        totalRuns: 15,
        successfulRuns: 15,
        failedRuns: 0,
        itemsProcessed: 15
      }
    },
    {
      id: 3,
      name: 'New Order Processing',
      description: 'Automatically processes new orders and updates inventory',
      trigger: 'event',
      triggerConfig: {
        schedule: '',
        event: 'new_order',
        condition: ''
      },
      actions: [
        {
          type: 'update_stock',
          config: {
            operation: 'decrease'
          }
        },
        {
          type: 'send_notification',
          config: {
            channel: 'email',
            template: 'order_confirmation'
          }
        }
      ],
      lastRun: '2025-04-01T09:45:22Z',
      nextRun: null,
      status: 'active',
      stats: {
        totalRuns: 48,
        successfulRuns: 45,
        failedRuns: 3,
        itemsProcessed: 48
      }
    },
    {
      id: 4,
      name: 'Weekly Performance Report',
      description: 'Generates and sends weekly sales and performance report',
      trigger: 'schedule',
      triggerConfig: {
        schedule: '0 9 * * 1', // Every Monday at 9 AM
        event: '',
        condition: ''
      },
      actions: [
        {
          type: 'generate_report',
          config: {
            reportType: 'weekly_performance',
            format: 'pdf'
          }
        },
        {
          type: 'send_notification',
          config: {
            channel: 'email',
            template: 'weekly_report',
            attachReport: true
          }
        }
      ],
      lastRun: '2025-03-25T09:00:00Z',
      nextRun: '2025-04-01T09:00:00Z',
      status: 'active',
      stats: {
        totalRuns: 12,
        successfulRuns: 12,
        failedRuns: 0,
        itemsProcessed: 12
      }
    },
    {
      id: 5,
      name: 'Competitor Price Monitoring',
      description: 'Monitors competitor prices and alerts on significant changes',
      trigger: 'schedule',
      triggerConfig: {
        schedule: '0 */6 * * *', // Every 6 hours
        event: '',
        condition: ''
      },
      actions: [
        {
          type: 'check_competitor_prices',
          config: {
            threshold: 10, // Percentage change
            stores: ['amazon', 'ebay', 'walmart']
          }
        },
        {
          type: 'send_notification',
          config: {
            channel: 'email',
            template: 'price_alert',
            condition: 'price_change > 10'
          }
        }
      ],
      lastRun: '2025-04-01T06:00:00Z',
      nextRun: '2025-04-01T12:00:00Z',
      status: 'paused',
      stats: {
        totalRuns: 120,
        successfulRuns: 118,
        failedRuns: 2,
        itemsProcessed: 2400
      }
    }
  ];
  
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await api.getWorkflows();
        // setWorkflows(response);
        
        // Using mock data for now
        setWorkflows(mockWorkflows);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch workflows:', err);
        setError('Failed to load workflows. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchWorkflows();
  }, []);
  
  const handleSelectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setIsCreating(false);
    setIsEditing(false);
  };
  
  const handleCreateWorkflow = () => {
    // Check if user has access to this feature
    if (!checkFeatureAccess('workflow_automation')) {
      // Show upgrade modal or message
      alert('This feature requires a higher subscription plan. Please upgrade to access workflow automation.');
      return;
    }
    
    setSelectedWorkflow(null);
    setIsCreating(true);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      trigger: 'schedule',
      triggerConfig: {
        schedule: '0 0 * * *', // Daily at midnight
        event: 'new_order',
        condition: ''
      },
      actions: [
        {
          type: 'update_price',
          config: {
            target: 'all',
            adjustment: 'percentage',
            value: 5
          }
        }
      ],
      isActive: true
    });
  };
  
  const handleEditWorkflow = () => {
    if (!selectedWorkflow) return;
    
    setIsEditing(true);
    setIsCreating(false);
    setFormData({
      name: selectedWorkflow.name,
      description: selectedWorkflow.description,
      trigger: selectedWorkflow.trigger,
      triggerConfig: { ...selectedWorkflow.triggerConfig },
      actions: [...selectedWorkflow.actions],
      isActive: selectedWorkflow.status === 'active'
    });
  };
  
  const handleDeleteWorkflow = async () => {
    if (!selectedWorkflow) return;
    
    if (window.confirm(`Are you sure you want to delete the workflow "${selectedWorkflow.name}"?`)) {
      try {
        // In a real app, this would be an API call
        // await api.deleteWorkflow(selectedWorkflow.id);
        
        // Update local state
        setWorkflows(workflows.filter(w => w.id !== selectedWorkflow.id));
        setSelectedWorkflow(null);
      } catch (err) {
        console.error('Failed to delete workflow:', err);
        setError('Failed to delete workflow. Please try again later.');
      }
    }
  };
  
  const handleToggleWorkflowStatus = async () => {
    if (!selectedWorkflow) return;
    
    try {
      const newStatus = selectedWorkflow.status === 'active' ? 'paused' : 'active';
      
      // In a real app, this would be an API call
      // await api.updateWorkflowStatus(selectedWorkflow.id, newStatus);
      
      // Update local state
      const updatedWorkflows = workflows.map(w => 
        w.id === selectedWorkflow.id ? { ...w, status: newStatus } : w
      );
      setWorkflows(updatedWorkflows);
      setSelectedWorkflow({ ...selectedWorkflow, status: newStatus });
    } catch (err) {
      console.error('Failed to update workflow status:', err);
      setError('Failed to update workflow status. Please try again later.');
    }
  };
  
  const handleRunWorkflowNow = async () => {
    if (!selectedWorkflow) return;
    
    try {
      // Check if user has tokens for this operation
      const hasTokens = await useTokens(1, 'workflow_execution');
      if (!hasTokens) {
        alert('You do not have enough tokens to run this workflow. Please purchase more tokens or upgrade your plan.');
        return;
      }
      
      // In a real app, this would be an API call
      // await api.runWorkflow(selectedWorkflow.id);
      
      alert(`Workflow "${selectedWorkflow.name}" has been triggered manually. Check execution logs for results.`);
    } catch (err) {
      console.error('Failed to run workflow:', err);
      setError('Failed to run workflow. Please try again later.');
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleTriggerConfigChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      triggerConfig: {
        ...formData.triggerConfig,
        [name]: value
      }
    });
  };
  
  const handleActionChange = (index, field, value) => {
    const updatedActions = [...formData.actions];
    if (field === 'type') {
      // Reset config when action type changes
      updatedActions[index] = {
        type: value,
        config: getDefaultConfigForActionType(value)
      };
    } else {
      // Update specific config field
      updatedActions[index] = {
        ...updatedActions[index],
        config: {
          ...updatedActions[index].config,
          [field]: value
        }
      };
    }
    
    setFormData({
      ...formData,
      actions: updatedActions
    });
  };
  
  const getDefaultConfigForActionType = (type) => {
    switch (type) {
      case 'update_price':
        return {
          target: 'all',
          adjustment: 'percentage',
          value: 5
        };
      case 'send_notification':
        return {
          channel: 'email',
          template: 'default'
        };
      case 'update_stock':
        return {
          operation: 'decrease'
        };
      case 'generate_report':
        return {
          reportType: 'performance',
          format: 'pdf'
        };
      case 'check_competitor_prices':
        return {
          threshold: 10,
          stores: ['amazon', 'ebay']
        };
      case 'create_task':
        return {
          title: 'New Task',
          priority: 'medium'
        };
      default:
        return {};
    }
  };
  
  const addAction = () => {
    setFormData({
      ...formData,
      actions: [
        ...formData.actions,
        {
          type: 'update_price',
          config: getDefaultConfigForActionType('update_price')
        }
      ]
    });
  };
  
  const removeAction = (index) => {
    const updatedActions = [...formData.actions];
    updatedActions.splice(index, 1);
    setFormData({
      ...formData,
      actions: updatedActions
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isCreating) {
        // In a real app, this would be an API call
        // const newWorkflow = await api.createWorkflow(formData);
        
        // Mock response
        const newWorkflow = {
          id: Math.max(...workflows.map(w => w.id)) + 1,
          ...formData,
          status: formData.isActive ? 'active' : 'paused',
          lastRun: null,
          nextRun: formData.trigger === 'schedule' ? new Date(Date.now() + 86400000).toISOString() : null,
          stats: {
            totalRuns: 0,
            successfulRuns: 0,
            failedRuns: 0,
            itemsProcessed: 0
          }
        };
        
        setWorkflows([...workflows, newWorkflow]);
        setSelectedWorkflow(newWorkflow);
      } else if (isEditing && selectedWorkflow) {
        // In a real app, this would be an API call
        // const updatedWorkflow = await api.updateWorkflow(selectedWorkflow.id, formData);
        
        // Mock response
        const updatedWorkflow = {
          ...selectedWorkflow,
          name: formData.name,
          description: formData.description,
          trigger: formData.trigger,
          triggerConfig: formData.triggerConfig,
          actions: formData.actions,
          status: formData.isActive ? 'active' : 'paused'
        };
        
        setWorkflows(workflows.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
        setSelectedWorkflow(updatedWorkflow);
      }
      
      setIsCreating(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save workflow:', err);
      setError('Failed to save workflow. Please try again later.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderTriggerDescription = (workflow) => {
    if (workflow.trigger === 'schedule') {
      return `Scheduled: ${formatCronExpression(workflow.triggerConfig.schedule)}`;
    } else if (workflow.trigger === 'event') {
      let desc = `Event: ${formatEventName(workflow.triggerConfig.event)}`;
      if (workflow.triggerConfig.condition) {
        desc += ` when ${workflow.triggerConfig.condition}`;
      }
      return desc;
    }
    return 'Unknown trigger';
  };
  
  const formatCronExpression = (cron) => {
    // This is a simplified interpretation of common cron patterns
    const parts = cron.split(' ');
    
    if (parts.length !== 5) return cron;
    
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Daily at midnight';
    }
    
    if (minute === '0' && hour === '9' && dayOfMonth === '*' && month === '*' && dayOfWeek === '1') {
      return 'Every Monday at 9 AM';
    }
    
    if (minute === '0' && hour.startsWith('*/')) {
      const interval = hour.split('/')[1];
      return `Every ${interval} hours`;
    }
    
    return cron;
  };
  
  const formatEventName = (event) => {
    switch (event) {
      case 'new_order':
        return 'New Order Received';
      case 'stock_update':
        return 'Stock Level Changed';
      case 'price_change':
        return 'Price Changed';
      default:
        return event;
    }
  };
  
  const renderActionsList = (actions) => {
    return actions.map((action, index) => {
      let actionDesc = '';
      
      switch (action.type) {
        case 'update_price':
          actionDesc = `Update prices ${action.config.target === 'all' ? 'for all products' : 'for selected products'} by ${action.config.value}${action.config.adjustment === 'percentage' ? '%' : ' EUR'}`;
          break;
        case 'send_notification':
          actionDesc = `Send ${action.config.channel} notification using ${action.config.template} template`;
          break;
        case 'update_stock':
          actionDesc = `${action.config.operation === 'decrease' ? 'Decrease' : 'Increase'} stock levels`;
          break;
        case 'generate_report':
          actionDesc = `Generate ${action.config.reportType} report in ${action.config.format} format`;
          break;
        case 'check_competitor_prices':
          actionDesc = `Check competitor prices on ${action.config.stores.join(', ')} with ${action.config.threshold}% threshold`;
          break;
        case 'create_task':
          actionDesc = `Create ${action.config.priority} priority task: ${action.config.title}`;
          break;
        default:
          actionDesc = action.type;
      }
      
      return (
        <li key={index} className={`py-2 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">{index + 1}.</span>
            <span>{actionDesc}</span>
          </div>
        </li>
      );
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Workflow Automation
        </h1>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Create and manage automated workflows to streamline your dropshipping operations
        </p>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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
        )}
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Workflows
              </h2>
              <button
                type="button"
                onClick={handleCreateWorkflow}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Workflow
              </button>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              {workflows.length > 0 ? (
                <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} max-h-[600px] overflow-y-auto`}>
                  {workflows.map((workflow) => (
                    <li 
                      key={workflow.id} 
                      className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                        selectedWorkflow?.id === workflow.id 
                          ? darkMode 
                            ? 'bg-gray-700' 
                            : 'bg-indigo-50' 
                          : ''
                      } ${
                        darkMode && selectedWorkflow?.id !== workflow.id 
                          ? 'hover:bg-gray-700' 
                          : darkMode 
                            ? '' 
                            : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectWorkflow(workflow)}
                    >
                      <div className="flex justify-between">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {workflow.name}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(workflow.status)}`}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </span>
                      </div>
                      <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {renderTriggerDescription(workflow)}
                      </div>
                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Last run: {formatDate(workflow.lastRun)}
                        {workflow.nextRun && (
                          <span className="ml-2">
                            | Next run: {formatDate(workflow.nextRun)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No workflows found. Create your first workflow to automate your dropshipping operations.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Workflow Details or Form */}
          <div className="lg:col-span-2">
            {isCreating || isEditing ? (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isCreating ? 'Create New Workflow' : 'Edit Workflow'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Workflow Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                          value={formData.name}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                          value={formData.description}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="trigger" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Trigger Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="trigger"
                          name="trigger"
                          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                          value={formData.trigger}
                          onChange={handleFormChange}
                        >
                          <option value="schedule">Schedule</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                    </div>
                    
                    {formData.trigger === 'schedule' ? (
                      <div className="sm:col-span-3">
                        <label htmlFor="schedule" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Schedule (Cron Expression)
                        </label>
                        <div className="mt-1">
                          <select
                            id="schedule"
                            name="schedule"
                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                            value={formData.triggerConfig.schedule}
                            onChange={handleTriggerConfigChange}
                          >
                            <option value="0 0 * * *">Daily at midnight</option>
                            <option value="0 9 * * 1">Weekly on Monday at 9 AM</option>
                            <option value="0 */6 * * *">Every 6 hours</option>
                            <option value="0 */12 * * *">Every 12 hours</option>
                            <option value="0 0 1 * *">Monthly on the 1st at midnight</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="sm:col-span-3">
                          <label htmlFor="event" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Event Type
                          </label>
                          <div className="mt-1">
                            <select
                              id="event"
                              name="event"
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                              value={formData.triggerConfig.event}
                              onChange={handleTriggerConfigChange}
                            >
                              <option value="new_order">New Order Received</option>
                              <option value="stock_update">Stock Level Changed</option>
                              <option value="price_change">Price Changed</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="sm:col-span-6">
                          <label htmlFor="condition" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Condition (Optional)
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="condition"
                              id="condition"
                              placeholder="e.g., stock < 10"
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                              value={formData.triggerConfig.condition}
                              onChange={handleTriggerConfigChange}
                            />
                          </div>
                          <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Enter a condition that must be met for the workflow to trigger. Leave blank to trigger on any event.
                          </p>
                        </div>
                      </>
                    )}
                    
                    <div className="sm:col-span-6">
                      <div className="flex justify-between items-center">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Actions
                        </label>
                        <button
                          type="button"
                          onClick={addAction}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add Action
                        </button>
                      </div>
                      
                      <div className="mt-2 space-y-4">
                        {formData.actions.map((action, index) => (
                          <div key={index} className={`p-4 border rounded-md ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Action {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeAction(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Action Type
                                </label>
                                <div className="mt-1">
                                  <select
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                    value={action.type}
                                    onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                                  >
                                    <option value="update_price">Update Price</option>
                                    <option value="send_notification">Send Notification</option>
                                    <option value="update_stock">Update Stock</option>
                                    <option value="generate_report">Generate Report</option>
                                    <option value="check_competitor_prices">Check Competitor Prices</option>
                                    <option value="create_task">Create Task</option>
                                  </select>
                                </div>
                              </div>
                              
                              {/* Render different config options based on action type */}
                              {action.type === 'update_price' && (
                                <>
                                  <div className="sm:col-span-3">
                                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Target
                                    </label>
                                    <div className="mt-1">
                                      <select
                                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                        value={action.config.target}
                                        onChange={(e) => handleActionChange(index, 'target', e.target.value)}
                                      >
                                        <option value="all">All Products</option>
                                        <option value="selected">Selected Products</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div className="sm:col-span-3">
                                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Adjustment Type
                                    </label>
                                    <div className="mt-1">
                                      <select
                                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                        value={action.config.adjustment}
                                        onChange={(e) => handleActionChange(index, 'adjustment', e.target.value)}
                                      >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div className="sm:col-span-3">
                                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Value
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="number"
                                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                        value={action.config.value}
                                        onChange={(e) => handleActionChange(index, 'value', parseFloat(e.target.value))}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {action.type === 'send_notification' && (
                                <>
                                  <div className="sm:col-span-3">
                                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Channel
                                    </label>
                                    <div className="mt-1">
                                      <select
                                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                        value={action.config.channel}
                                        onChange={(e) => handleActionChange(index, 'channel', e.target.value)}
                                      >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="push">Push Notification</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div className="sm:col-span-3">
                                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Template
                                    </label>
                                    <div className="mt-1">
                                      <select
                                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                        value={action.config.template}
                                        onChange={(e) => handleActionChange(index, 'template', e.target.value)}
                                      >
                                        <option value="default">Default</option>
                                        <option value="low_stock_alert">Low Stock Alert</option>
                                        <option value="price_alert">Price Alert</option>
                                        <option value="order_confirmation">Order Confirmation</option>
                                        <option value="weekly_report">Weekly Report</option>
                                      </select>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {/* Similar config sections for other action types would go here */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <label htmlFor="isActive" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          Activate workflow immediately
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                      }}
                      className={`py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isCreating ? 'Create Workflow' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            ) : selectedWorkflow ? (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start border-b border-gray-200">
                  <div>
                    <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedWorkflow.name}
                    </h3>
                    <p className={`mt-1 max-w-2xl text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedWorkflow.description}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedWorkflow.status)}`}>
                    {selectedWorkflow.status.charAt(0).toUpperCase() + selectedWorkflow.status.slice(1)}
                  </span>
                </div>
                
                <div className="border-b border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Trigger
                      </dt>
                      <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        {renderTriggerDescription(selectedWorkflow)}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last Run
                      </dt>
                      <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        {formatDate(selectedWorkflow.lastRun)}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Next Run
                      </dt>
                      <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        {selectedWorkflow.nextRun ? formatDate(selectedWorkflow.nextRun) : 'N/A'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Statistics
                      </dt>
                      <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Runs</span>
                            <span className={`block mt-1 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedWorkflow.stats.totalRuns}</span>
                          </div>
                          <div>
                            <span className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</span>
                            <span className={`block mt-1 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedWorkflow.stats.totalRuns > 0 
                                ? `${Math.round((selectedWorkflow.stats.successfulRuns / selectedWorkflow.stats.totalRuns) * 100)}%` 
                                : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Items Processed</span>
                            <span className={`block mt-1 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedWorkflow.stats.itemsProcessed}</span>
                          </div>
                          <div>
                            <span className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Failed Runs</span>
                            <span className={`block mt-1 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedWorkflow.stats.failedRuns}</span>
                          </div>
                        </div>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Actions
                      </dt>
                      <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        <ul className={`border border-gray-200 rounded-md divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          {renderActionsList(selectedWorkflow.actions)}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleRunWorkflowNow}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Run Now
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWorkflowStatus}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      selectedWorkflow.status === 'active' 
                        ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {selectedWorkflow.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditWorkflow}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteWorkflow}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-12 text-center`}>
                <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No workflow selected</h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select a workflow from the list to view details or create a new workflow to automate your dropshipping operations.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCreateWorkflow}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Workflow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
