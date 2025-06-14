import React, { useState, useEffect } from 'react';
import AuthError from '../../components/AuthError.jsx';
import './ReportEntryPage.css';

const ReportEntryPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form data states
  const [trafficData, setTrafficData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalVisitors: '',
    newCustomers: '',
    returningCustomers: '',
    averageSessionDuration: '',
    conversionRate: '',
    bounceRate: ''
  });

  const [salesCategoryData, setSalesCategoryData] = useState({
    salesCategoryId: '',
    amount: '',
    quantity: '',
    description: ''
  });

  const [operationalCostData, setOperationalCostData] = useState({
    operationalCostTypeId: '',
    amount: '',
    description: ''
  });

  // Dropdown options
  const [salesCategories, setSalesCategories] = useState([]);
  const [operationalCostTypes, setOperationalCostTypes] = useState([]);

  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchSalesCategories();
    fetchOperationalCostTypes();
  }, []);

  const fetchSalesCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/sales-category`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSalesCategories(result.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sales categories:', err);
    }
  };

  const fetchOperationalCostTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/operational-cost-type`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOperationalCostTypes(result.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch operational cost types:', err);
    }
  };

  // Submit functions for each step
  const submitTrafficData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/traffic-and-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trafficData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit traffic data');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess('Traffic and Customer data saved successfully!');
        setCurrentStep(2);
      } else {
        throw new Error(result.message || 'Failed to submit traffic data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitSalesCategoryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/sales-by-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(salesCategoryData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit sales category data');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess('Sales Category data saved successfully!');
        setCurrentStep(3);
      } else {
        throw new Error(result.message || 'Failed to submit sales category data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitOperationalCostData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/daily-operational-cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(operationalCostData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit operational cost data');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess('All data submitted successfully! Report entry completed.');
        // Reset form after successful completion
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit operational cost data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setTrafficData({
      date: new Date().toISOString().split('T')[0],
      totalVisitors: '',
      newCustomers: '',
      returningCustomers: '',
      averageSessionDuration: '',
      conversionRate: '',
      bounceRate: ''
    });
    setSalesCategoryData({
      salesCategoryId: '',
      amount: '',
      quantity: '',
      description: ''
    });
    setOperationalCostData({
      operationalCostTypeId: '',
      amount: '',
      description: ''
    });
    setSuccess(null);
    setError(null);
  };

  const handleNext = () => {
    setError(null);
    setSuccess(null);
    
    if (currentStep === 1) {
      // Validate traffic data
      if (!trafficData.totalVisitors || !trafficData.newCustomers) {
        setError('Please fill in required fields');
        return;
      }
      submitTrafficData();
    } else if (currentStep === 2) {
      // Validate sales category data
      if (!salesCategoryData.salesCategoryId || !salesCategoryData.amount) {
        setError('Please fill in required fields');
        return;
      }
      submitSalesCategoryData();
    } else if (currentStep === 3) {
      // Validate operational cost data
      if (!operationalCostData.operationalCostTypeId || !operationalCostData.amount) {
        setError('Please fill in required fields');
        return;
      }
      submitOperationalCostData();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      setSuccess(null);
    }
  };

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Traffic & Customer</span>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Sales Category</span>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Operational Cost</span>
        </div>
      </div>
    </div>
  );

  const renderTrafficForm = () => (
    <div className="form-section">
      <h3>Traffic and Customer Data</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            value={trafficData.date}
            onChange={(e) => setTrafficData({...trafficData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="totalVisitors">Total Visitors *</label>
          <input
            type="number"
            id="totalVisitors"
            value={trafficData.totalVisitors}
            onChange={(e) => setTrafficData({...trafficData, totalVisitors: e.target.value})}
            placeholder="Enter total visitors"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newCustomers">New Customers *</label>
          <input
            type="number"
            id="newCustomers"
            value={trafficData.newCustomers}
            onChange={(e) => setTrafficData({...trafficData, newCustomers: e.target.value})}
            placeholder="Enter new customers count"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="returningCustomers">Returning Customers</label>
          <input
            type="number"
            id="returningCustomers"
            value={trafficData.returningCustomers}
            onChange={(e) => setTrafficData({...trafficData, returningCustomers: e.target.value})}
            placeholder="Enter returning customers count"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="averageSessionDuration">Avg Session Duration (minutes)</label>
          <input
            type="number"
            step="0.1"
            id="averageSessionDuration"
            value={trafficData.averageSessionDuration}
            onChange={(e) => setTrafficData({...trafficData, averageSessionDuration: e.target.value})}
            placeholder="Enter average session duration"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="conversionRate">Conversion Rate (%)</label>
          <input
            type="number"
            step="0.01"
            id="conversionRate"
            value={trafficData.conversionRate}
            onChange={(e) => setTrafficData({...trafficData, conversionRate: e.target.value})}
            placeholder="Enter conversion rate"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bounceRate">Bounce Rate (%)</label>
          <input
            type="number"
            step="0.01"
            id="bounceRate"
            value={trafficData.bounceRate}
            onChange={(e) => setTrafficData({...trafficData, bounceRate: e.target.value})}
            placeholder="Enter bounce rate"
          />
        </div>
      </div>
    </div>
  );

  const renderSalesCategoryForm = () => (
    <div className="form-section">
      <h3>Sales Category Data</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="salesCategoryId">Sales Category *</label>
          <select
            id="salesCategoryId"
            value={salesCategoryData.salesCategoryId}
            onChange={(e) => setSalesCategoryData({...salesCategoryData, salesCategoryId: e.target.value})}
            required
          >
            <option value="">Select a category</option>
            {salesCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            value={salesCategoryData.amount}
            onChange={(e) => setSalesCategoryData({...salesCategoryData, amount: e.target.value})}
            placeholder="Enter amount"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={salesCategoryData.quantity}
            onChange={(e) => setSalesCategoryData({...salesCategoryData, quantity: e.target.value})}
            placeholder="Enter quantity"
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="salesDescription">Description</label>
          <textarea
            id="salesDescription"
            value={salesCategoryData.description}
            onChange={(e) => setSalesCategoryData({...salesCategoryData, description: e.target.value})}
            placeholder="Enter description"
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderOperationalCostForm = () => (
    <div className="form-section">
      <h3>Operational Cost Data</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="operationalCostTypeId">Cost Type *</label>
          <select
            id="operationalCostTypeId"
            value={operationalCostData.operationalCostTypeId}
            onChange={(e) => setOperationalCostData({...operationalCostData, operationalCostTypeId: e.target.value})}
            required
          >
            <option value="">Select a cost type</option>
            {operationalCostTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.operationalCostName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="costAmount">Amount *</label>
          <input
            type="number"
            step="0.01"
            id="costAmount"
            value={operationalCostData.amount}
            onChange={(e) => setOperationalCostData({...operationalCostData, amount: e.target.value})}
            placeholder="Enter amount"
            required
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="costDescription">Description</label>
          <textarea
            id="costDescription"
            value={operationalCostData.description}
            onChange={(e) => setOperationalCostData({...operationalCostData, description: e.target.value})}
            placeholder="Enter description"
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const handleLoginRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-logout'));
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="report-entry-page">
      <div className="page-header">
        <h1 className="page-title">Report Entry</h1>
        <p className="page-subtitle">Enter daily operational data in sequential steps</p>
      </div>

      {renderProgressBar()}

      {error && (
        <AuthError 
          error={error}
          onRetry={handleRetry}
          onLoginRedirect={handleLoginRedirect}
        />
      )}

      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}

      <div className="form-container">
        {currentStep === 1 && renderTrafficForm()}
        {currentStep === 2 && renderSalesCategoryForm()}
        {currentStep === 3 && renderOperationalCostForm()}

        <div className="form-actions">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={loading}
            >
              Previous
            </button>
          )}
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? 'Submitting...' : currentStep === 3 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportEntryPage;
