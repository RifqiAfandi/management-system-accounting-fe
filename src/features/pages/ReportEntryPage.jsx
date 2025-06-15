import React, { useState, useEffect } from 'react';
import AuthError from '../../components/AuthError.jsx';
import './ReportEntryPage.css';

const ReportEntryPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);  // Form data states
  const [trafficData, setTrafficData] = useState({
    shift1: {
      customerCount: '',
      transaction: '',
      description: ''
    },
    shift2: {
      customerCount: '',
      transaction: '',
      description: ''
    }
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
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Prepare data for both shifts
      const shift1Data = {
        timeShift: "Shift 1 (07:00-15:00)",
        customerCount: parseInt(trafficData.shift1.customerCount),
        transaction: parseInt(trafficData.shift1.transaction),
        description: trafficData.shift1.description,
        date: currentDate,
        conversionRate: trafficData.shift1.customerCount && trafficData.shift1.transaction 
          ? ((parseFloat(trafficData.shift1.transaction) / parseFloat(trafficData.shift1.customerCount)) * 100).toFixed(2)
          : 0
      };

      const shift2Data = {
        timeShift: "Shift 2 (15:00-23:00)",
        customerCount: parseInt(trafficData.shift2.customerCount),
        transaction: parseInt(trafficData.shift2.transaction),
        description: trafficData.shift2.description,
        date: currentDate,
        conversionRate: trafficData.shift2.customerCount && trafficData.shift2.transaction 
          ? ((parseFloat(trafficData.shift2.transaction) / parseFloat(trafficData.shift2.customerCount)) * 100).toFixed(2)
          : 0
      };
      
      // Submit both shifts
      const response1 = await fetch(`${API_BASE_URL}/traffic-and-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shift1Data)
      });

      const response2 = await fetch(`${API_BASE_URL}/traffic-and-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shift2Data)
      });

      if (!response1.ok || !response2.ok) {
        throw new Error('Failed to submit traffic data');
      }

      const result1 = await response1.json();
      const result2 = await response2.json();
      
      if (result1.success && result2.success) {
        setSuccess('Both shifts traffic and customer data saved successfully!');
        setCurrentStep(2);
      } else {
        throw new Error('Failed to submit traffic data for one or both shifts');
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
  };  const resetForm = () => {
    setCurrentStep(1);
    setTrafficData({
      shift1: {
        customerCount: '',
        transaction: '',
        description: ''
      },
      shift2: {
        customerCount: '',
        transaction: '',
        description: ''
      }
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
  };const handleNext = () => {
    setError(null);
    setSuccess(null);
    
    if (currentStep === 1) {
      // Validate traffic data for both shifts
      if (!trafficData.shift1.customerCount || !trafficData.shift1.transaction ||
          !trafficData.shift2.customerCount || !trafficData.shift2.transaction) {
        setError('Please fill in required fields for both Shift 1 and Shift 2 (Customer Count and Transaction)');
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
  );  const renderTrafficForm = () => {
    // Calculate conversion rates automatically for both shifts
    const shift1ConversionRate = trafficData.shift1.customerCount && trafficData.shift1.transaction 
      ? ((parseFloat(trafficData.shift1.transaction) / parseFloat(trafficData.shift1.customerCount)) * 100).toFixed(2)
      : 0;

    const shift2ConversionRate = trafficData.shift2.customerCount && trafficData.shift2.transaction 
      ? ((parseFloat(trafficData.shift2.transaction) / parseFloat(trafficData.shift2.customerCount)) * 100).toFixed(2)
      : 0;

    return (
      <div className="form-section">
        <h3>Traffic and Customer Data</h3>
        <div className="current-date-info">
          <p><strong>Date:</strong> {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p className="shift-note"><strong>Note:</strong> Please fill data for both shifts</p>
        </div>
        
        {/* Shift 1 Form */}
        <div className="shift-section">
          <h4 className="shift-title">🌅 Shift 1 (07:00-15:00)</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="shift1CustomerCount">Customer Count *</label>
              <input
                type="number"
                id="shift1CustomerCount"
                value={trafficData.shift1.customerCount}
                onChange={(e) => setTrafficData({
                  ...trafficData, 
                  shift1: {...trafficData.shift1, customerCount: e.target.value}
                })}
                placeholder="Enter number of customers"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shift1Transaction">Transaction *</label>
              <input
                type="number"
                id="shift1Transaction"
                value={trafficData.shift1.transaction}
                onChange={(e) => setTrafficData({
                  ...trafficData, 
                  shift1: {...trafficData.shift1, transaction: e.target.value}
                })}
                placeholder="Enter number of transactions"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shift1ConversionRate">Conversion Rate (Auto-calculated)</label>
              <input
                type="text"
                id="shift1ConversionRate"
                value={`${shift1ConversionRate}%`}
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="shift1Description">Note (Shift 1)</label>
              <textarea
                id="shift1Description"
                value={trafficData.shift1.description}
                onChange={(e) => setTrafficData({
                  ...trafficData, 
                  shift1: {...trafficData.shift1, description: e.target.value}
                })}
                placeholder="Enter notes for Shift 1"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Shift 2 Form */}
        <div className="shift-section">
          <h4 className="shift-title">🌙 Shift 2 (15:00-23:00)</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="shift2CustomerCount">Customer Count *</label>
              <input
                type="number"
                id="shift2CustomerCount"
                value={trafficData.shift2.customerCount}
                onChange={(e) => setTrafficData({
                  ...trafficData, 
                  shift2: {...trafficData.shift2, customerCount: e.target.value}
                })}
                placeholder="Enter number of customers"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shift2Transaction">Transaction *</label>
              <input
                type="number"
                id="shift2Transaction"
                value={trafficData.shift2.transaction}
                onChange={(e) => setTrafficData({
                  ...trafficData, 
                  shift2: {...trafficData.shift2, transaction: e.target.value}
                })}
                placeholder="Enter number of transactions"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shift2ConversionRate">Conversion Rate (Auto-calculated)</label>
              <input
                type="text"
                id="shift2ConversionRate"
                value={`${shift2ConversionRate}%`}
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="shift2Description">Note (Shift 2)</label>
              <textarea
                id="shift2Description"
                value={trafficData.shift2.description}
                onChange={(e) => setTrafficData({
                  ...trafficData, 
                  shift2: {...trafficData.shift2, description: e.target.value}
                })}
                placeholder="Enter notes for Shift 2"
                rows="2"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
