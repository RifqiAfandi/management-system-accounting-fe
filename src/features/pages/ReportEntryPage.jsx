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
  });  const [salesCategoryData, setSalesCategoryData] = useState({
    categories: [] // Will be populated with available categories and their data
  });

  const [paymentMethodData, setPaymentMethodData] = useState({
    cash: {
      jumlahTransaksi: '',
      revenue: ''
    },
    qris: {
      jumlahTransaksi: '',
      revenue: ''
    }
  });
  const [operationalCostData, setOperationalCostData] = useState({
    costs: [] // Will be populated with all operational cost types
  });

  // Dropdown options
  const [salesCategories, setSalesCategories] = useState([]);
  const [operationalCostTypes, setOperationalCostTypes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const API_BASE_URL = 'http://localhost:3000/api';
  // Fetch dropdown data on component mount
  useEffect(() => {    fetchSalesCategories();
    fetchOperationalCostTypes();
    fetchPaymentTypes();
    
    // Re-initialize operational cost data when types are fetched
    if (operationalCostTypes.length > 0) {
      setOperationalCostData({
        costs: operationalCostTypes.map(type => ({
          operationalCostTypeId: type.id,
          operationalCostName: type.operationalCostName,
          amount: '',
          description: ''
        }))
      });
    }
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
          const categories = result.data || [];
          setSalesCategories(categories);
          
          // Initialize sales category data with empty values for each category
          setSalesCategoryData({
            categories: categories.map(category => ({
              id: category.id,
              nameCategory: category.nameCategory,
              qtyTerjual: '',
              revenue: '',
              hpp: '',
              margin: 0
            }))
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch sales categories:', err);
    }
  };  const fetchOperationalCostTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/operational-cost-type`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const types = result.data || [];
          setOperationalCostTypes(types);
          
          // Initialize operational cost data with empty values for each type
          setOperationalCostData({
            costs: types.map(type => ({
              operationalCostTypeId: type.id,
              operationalCostName: type.operationalCostName,
              amount: '',
              description: ''
            }))
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch operational cost types:', err);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/payment-type`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.isSuccess) {
          setPaymentTypes(result.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch payment types:', err);
    }
  };  const submitTrafficData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for both shifts with correct timeShift format
      const shift1Data = {
        timeShift: "07.00-15.00", // Backend expects this format
        customerCount: parseInt(trafficData.shift1.customerCount) || 0,
        transaction: parseInt(trafficData.shift1.transaction) || 0,
        description: trafficData.shift1.description || null
      };

      const shift2Data = {
        timeShift: "15.00-23.00", // Backend expects this format
        customerCount: parseInt(trafficData.shift2.customerCount) || 0,
        transaction: parseInt(trafficData.shift2.transaction) || 0,
        description: trafficData.shift2.description || null
      };

      // Only submit data for shifts that have values
      const submissionPromises = [];
      
      if (shift1Data.customerCount > 0 || shift1Data.transaction > 0) {
        submissionPromises.push(
          fetch(`${API_BASE_URL}/traffic-and-customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(shift1Data)
          })
        );
      }

      if (shift2Data.customerCount > 0 || shift2Data.transaction > 0) {
        submissionPromises.push(
          fetch(`${API_BASE_URL}/traffic-and-customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(shift2Data)
          })
        );
      }

      if (submissionPromises.length === 0) {
        throw new Error('Please enter data for at least one shift');
      }

      // Wait for all submissions to complete
      const responses = await Promise.all(submissionPromises);
      
      // Check if all responses are OK
      for (const response of responses) {
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || 'Failed to submit traffic data');
        }
      }

      // Parse all results
      const results = await Promise.all(responses.map(response => response.json()));
      
      // Check if all results are successful
      const allSuccessful = results.every(result => result.success);
        if (allSuccessful) {
        setSuccess('Traffic and Customer data saved successfully!');
        // Don't change step here - let handleNext control it
      } else {
        throw new Error('Failed to submit traffic data for one or more shifts');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  const submitSalesCategoryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Filter categories that have data and prepare submissions
      const categoriesWithData = salesCategoryData.categories.filter(category => 
        category.qtyTerjual && category.revenue && category.hpp
      );
      
      if (categoriesWithData.length === 0) {
        throw new Error('Please enter data for at least one category');
      }
      
      // Calculate margin for each category and prepare data
      const submissionPromises = categoriesWithData.map(category => {
        const revenue = parseFloat(category.revenue) || 0;
        const hpp = parseFloat(category.hpp) || 0;
        const margin = revenue > 0 ? ((revenue - hpp) / revenue) * 100 : 0;
        
        const submissionData = {
          salesCategoryId: category.id,
          qtyTerjual: parseFloat(category.qtyTerjual) || 0,
          revenue: revenue,
          hpp: hpp,
          margin: margin
        };
        
        return fetch(`${API_BASE_URL}/sales-by-category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(submissionData)
        });
      });

      // Wait for all submissions to complete
      const responses = await Promise.all(submissionPromises);
      
      // Check if all responses are OK
      for (const response of responses) {
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || 'Failed to submit sales category data');
        }
      }

      // Parse all results
      const results = await Promise.all(responses.map(response => response.json()));
      
      // Check if all results are successful
      const allSuccessful = results.every(result => result.isSuccess);        if (allSuccessful) {
        setSuccess('Sales Category data saved successfully!');
        // Don't change step here - let handleNext control it
      } else {
        throw new Error('Failed to submit sales category data for one or more categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const submitPaymentMethodData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Calculate totals for percentage calculation
      const totalTransactions = (parseInt(paymentMethodData.cash.jumlahTransaksi) || 0) + 
                               (parseInt(paymentMethodData.qris.jumlahTransaksi) || 0);
      
      if (totalTransactions === 0) {
        throw new Error('Please enter transaction data for at least one payment method');
      }
      
      const submissionPromises = [];
      
      // Find payment type IDs
      const cashPaymentType = paymentTypes.find(type => type.paymentName.toLowerCase() === 'cash');
      const qrisPaymentType = paymentTypes.find(type => type.paymentName.toLowerCase() === 'qris');
      
      // Submit Cash data if available
      if (paymentMethodData.cash.jumlahTransaksi && paymentMethodData.cash.revenue) {
        const cashPercentage = ((parseInt(paymentMethodData.cash.jumlahTransaksi) / totalTransactions) * 100).toFixed(2);
        const cashRevenue = parseFloat(paymentMethodData.cash.revenue);
        
        const cashData = {
          paymentTypeId: cashPaymentType?.id || 1, // Default to 1 if not found
          jumlahTransaksi: parseInt(paymentMethodData.cash.jumlahTransaksi),
          persenDariTotal: parseFloat(cashPercentage),
          revenue: cashRevenue,
          fee: 0 // Cash has no fee
        };
        
        submissionPromises.push(
          fetch(`${API_BASE_URL}/payment-method-breakdown`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cashData)
          })
        );
      }
      
      // Submit QRIS data if available
      if (paymentMethodData.qris.jumlahTransaksi && paymentMethodData.qris.revenue) {
        const qrisPercentage = ((parseInt(paymentMethodData.qris.jumlahTransaksi) / totalTransactions) * 100).toFixed(2);
        const qrisRevenue = parseFloat(paymentMethodData.qris.revenue);
        const qrisFee = qrisRevenue * 0.007; // 0.7% fee
        
        const qrisData = {
          paymentTypeId: qrisPaymentType?.id || 2, // Default to 2 if not found
          jumlahTransaksi: parseInt(paymentMethodData.qris.jumlahTransaksi),
          persenDariTotal: parseFloat(qrisPercentage),
          revenue: qrisRevenue,
          fee: qrisFee
        };
        
        submissionPromises.push(
          fetch(`${API_BASE_URL}/payment-method-breakdown`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(qrisData)
          })
        );
      }
      
      // Wait for all submissions to complete
      const responses = await Promise.all(submissionPromises);
      
      // Check if all responses are OK
      for (const response of responses) {
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || 'Failed to submit payment method data');
        }
      }
      
      // Parse all results
      const results = await Promise.all(responses.map(response => response.json()));
      
      // Check if all results are successful
      const allSuccessful = results.every(result => result.isSuccess);
        if (allSuccessful) {
        setSuccess('Payment Method data saved successfully!');
        // Don't change step here - let handleNext control it
      } else {
        throw new Error('Failed to submit payment method data');
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
      
      // Filter costs that have amount data
      const costsWithData = operationalCostData.costs.filter(cost => 
        cost.amount && parseFloat(cost.amount) > 0
      );
      
      if (costsWithData.length === 0) {
        throw new Error('Please enter amount for at least one operational cost type');
      }
      
      // Submit each operational cost
      const submissionPromises = costsWithData.map(cost => {
        const submissionData = {
          operationalCostTypeId: cost.operationalCostTypeId,
          amount: parseFloat(cost.amount),
          description: cost.description || null
        };
        
        return fetch(`${API_BASE_URL}/daily-operational-cost`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(submissionData)
        });
      });

      // Wait for all submissions to complete
      const responses = await Promise.all(submissionPromises);
      
      // Check if all responses are OK
      for (const response of responses) {
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || 'Failed to submit operational cost data');
        }
      }

      // Parse all results
      const results = await Promise.all(responses.map(response => response.json()));
      
      // Check if all results are successful
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        setSuccess('All data submitted successfully! Report entry completed.');
        // Reset form after successful completion
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        throw new Error('Failed to submit operational cost data for one or more types');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }  };

  // Submit all data at once in the final step
  const submitAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Submit all data sequentially
      await submitTrafficData();
      await submitSalesCategoryData();
      await submitPaymentMethodData();
      await submitOperationalCostData();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  // Helper function to update operational cost data
  const updateOperationalCostData = (costId, field, value) => {
    setOperationalCostData(prevData => {
      const updatedCosts = prevData.costs.map(cost => {
        if (cost.operationalCostTypeId === costId) {
          return { ...cost, [field]: value };
        }
        return cost;
      });
      
      return { ...prevData, costs: updatedCosts };
    });
  };

  // Helper function to update sales category data and calculate margin
  const updateSalesCategoryData = (categoryId, field, value) => {
    setSalesCategoryData(prevData => {
      const updatedCategories = prevData.categories.map(category => {
        if (category.id === categoryId) {
          const updatedCategory = { ...category, [field]: value };
          
          // Auto-calculate margin when revenue or hpp changes
          if (field === 'revenue' || field === 'hpp') {
            const revenue = parseFloat(field === 'revenue' ? value : updatedCategory.revenue) || 0;
            const hpp = parseFloat(field === 'hpp' ? value : updatedCategory.hpp) || 0;
            updatedCategory.margin = revenue > 0 ? ((revenue - hpp) / revenue) * 100 : 0;
          }
          
          return updatedCategory;
        }
        return category;
      });
      
      return { ...prevData, categories: updatedCategories };
    });
  };
  const resetForm = () => {
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
    });    setSalesCategoryData({
      categories: [] // Will be re-populated when sales categories are fetched
    });
    setPaymentMethodData({
      cash: {
        jumlahTransaksi: '',
        revenue: ''
      },
      qris: {
        jumlahTransaksi: '',
        revenue: ''
      }
    });
    setOperationalCostData({
      costs: [] // Will be re-populated when operational cost types are fetched
    });
    setSuccess(null);
    setError(null);
  };const handleNext = () => {
    setError(null);
    setSuccess(null);
    
    if (currentStep === 1) {
      // Validate traffic data - at least one shift must have data
      const shift1HasData = (trafficData.shift1.customerCount && trafficData.shift1.transaction);
      const shift2HasData = (trafficData.shift2.customerCount && trafficData.shift2.transaction);
      
      if (!shift1HasData && !shift2HasData) {
        setError('Please fill in Customer Count and Transaction for at least one shift');
        return;
      }
      
      // Check for incomplete data in filled shifts
      if (trafficData.shift1.customerCount && !trafficData.shift1.transaction) {
        setError('Please fill in Transaction for Shift 1');
        return;
      }
      if (trafficData.shift1.transaction && !trafficData.shift1.customerCount) {
        setError('Please fill in Customer Count for Shift 1');
        return;
      }
      if (trafficData.shift2.customerCount && !trafficData.shift2.transaction) {
        setError('Please fill in Transaction for Shift 2');
        return;
      }
      if (trafficData.shift2.transaction && !trafficData.shift2.customerCount) {
        setError('Please fill in Customer Count for Shift 2');
        return;
      }
      
      // Just move to next step without submitting
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate sales category data - at least one category must have complete data
      const categoriesWithData = salesCategoryData.categories.filter(category => 
        category.qtyTerjual && category.revenue && category.hpp
      );
      
      if (categoriesWithData.length === 0) {
        setError('Please fill in Qty Terjual, Revenue, and HPP for at least one category');
        return;
      }
      
      // Check for incomplete data in partially filled categories
      const hasIncompleteData = salesCategoryData.categories.some(category => {
        const hasAnyData = category.qtyTerjual || category.revenue || category.hpp;
        const hasCompleteData = category.qtyTerjual && category.revenue && category.hpp;
        return hasAnyData && !hasCompleteData;
      });
      
      if (hasIncompleteData) {
        setError('Please complete all fields (Qty Terjual, Revenue, HPP) for categories that have data');
        return;
      }

      // Just move to next step without submitting
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate payment method data - at least one payment method must have complete data
      const cashHasData = paymentMethodData.cash.jumlahTransaksi && paymentMethodData.cash.revenue;
      const qrisHasData = paymentMethodData.qris.jumlahTransaksi && paymentMethodData.qris.revenue;
      
      if (!cashHasData && !qrisHasData) {
        setError('Please fill in data for at least one payment method');
        return;
      }
      
      // Check for incomplete data in partially filled payment methods
      const cashIncomplete = (paymentMethodData.cash.jumlahTransaksi && !paymentMethodData.cash.revenue) || 
                            (!paymentMethodData.cash.jumlahTransaksi && paymentMethodData.cash.revenue);
      const qrisIncomplete = (paymentMethodData.qris.jumlahTransaksi && !paymentMethodData.qris.revenue) || 
                            (!paymentMethodData.qris.jumlahTransaksi && paymentMethodData.qris.revenue);
      
      if (cashIncomplete || qrisIncomplete) {
        setError('Please complete both Transaction Count and Revenue for payment methods that have data');
        return;
      }
      
      // Just move to next step without submitting
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Validate operational cost data - at least one cost type must have amount
      const costsWithData = operationalCostData.costs.filter(cost => 
        cost.amount && parseFloat(cost.amount) > 0
      );
      
      if (costsWithData.length === 0) {
        setError('Please enter amount for at least one operational cost type');
        return;
      }
      
      // Submit all data at the final step
      submitAllData();
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
          <span className="step-label">Payment Method</span>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Operational Cost</span>
        </div>
      </div>
    </div>
  );const renderTrafficForm = () => {
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
          <p className="shift-note"><strong>Note:</strong> Please fill data for at least one shift. Both Customer Count and Transaction are required for each shift you want to submit.</p>
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
      <div className="current-date-info">
        <p><strong>Date:</strong> {new Date().toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p className="shift-note"><strong>Note:</strong> Please fill data for at least one category. All fields (Qty Terjual, Revenue, HPP) are required for each category you want to submit.</p>
      </div>
      
      {salesCategoryData.categories.map((category, index) => (
        <div key={category.id} className="category-section">
          <h4 className="category-title">
            {category.nameCategory === 'Makanan' ? '🍽️' : '🥤'} {category.nameCategory}
          </h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`qtyTerjual-${category.id}`}>Qty Terjual *</label>
              <input
                type="number"
                id={`qtyTerjual-${category.id}`}
                value={category.qtyTerjual}
                onChange={(e) => updateSalesCategoryData(category.id, 'qtyTerjual', e.target.value)}
                placeholder="Enter quantity sold"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`revenue-${category.id}`}>Revenue (Total Sales) *</label>
              <input
                type="number"
                step="0.01"
                id={`revenue-${category.id}`}
                value={category.revenue}
                onChange={(e) => updateSalesCategoryData(category.id, 'revenue', e.target.value)}
                placeholder="Enter total revenue"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`hpp-${category.id}`}>HPP (Cost of Goods Sold) *</label>
              <input
                type="number"
                step="0.01"
                id={`hpp-${category.id}`}
                value={category.hpp}
                onChange={(e) => updateSalesCategoryData(category.id, 'hpp', e.target.value)}
                placeholder="Enter cost of goods sold"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`margin-${category.id}`}>Margin % (Auto-calculated)</label>
              <input
                type="text"
                id={`margin-${category.id}`}
                value={`${category.margin.toFixed(2)}%`}
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>
        </div>      ))}
    </div>
  );

  const renderPaymentMethodForm = () => {
    // Calculate totals for percentage calculation
    const totalTransactions = (parseInt(paymentMethodData.cash.jumlahTransaksi) || 0) + 
                             (parseInt(paymentMethodData.qris.jumlahTransaksi) || 0);
    
    // Calculate percentages
    const cashPercentage = totalTransactions > 0 
      ? ((parseInt(paymentMethodData.cash.jumlahTransaksi) || 0) / totalTransactions * 100).toFixed(2)
      : 0;
    
    const qrisPercentage = totalTransactions > 0 
      ? ((parseInt(paymentMethodData.qris.jumlahTransaksi) || 0) / totalTransactions * 100).toFixed(2)
      : 0;
    
    // Calculate QRIS fee (0.7% of revenue)
    const qrisFee = (parseFloat(paymentMethodData.qris.revenue) || 0) * 0.007;

    return (
      <div className="form-section">
        <h3>Payment Method Data</h3>
        <div className="current-date-info">
          <p><strong>Date:</strong> {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p className="shift-note"><strong>Note:</strong> Please fill data for at least one payment method. Jumlah Transaksi and Revenue are required for each payment method you want to submit.</p>
        </div>
        
        {/* Cash Payment Method */}
        <div className="category-section">
          <h4 className="category-title">💵 Cash</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cash-transactions">Jumlah Transaksi *</label>
              <input
                type="number"
                id="cash-transactions"
                value={paymentMethodData.cash.jumlahTransaksi}
                onChange={(e) => setPaymentMethodData({
                  ...paymentMethodData,
                  cash: { ...paymentMethodData.cash, jumlahTransaksi: e.target.value }
                })}
                placeholder="Enter number of cash transactions"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cash-percentage">% dari Total (Auto-calculated)</label>
              <input
                type="text"
                id="cash-percentage"
                value={`${cashPercentage}%`}
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cash-revenue">Revenue (Rp) *</label>
              <input
                type="number"
                step="0.01"
                id="cash-revenue"
                value={paymentMethodData.cash.revenue}
                onChange={(e) => setPaymentMethodData({
                  ...paymentMethodData,
                  cash: { ...paymentMethodData.cash, revenue: e.target.value }
                })}
                placeholder="Enter cash revenue"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cash-fee">Fee/Cost (Rp) (Auto-calculated)</label>
              <input
                type="text"
                id="cash-fee"
                value="Rp 0"
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>
        </div>

        {/* QRIS Payment Method */}
        <div className="category-section">
          <h4 className="category-title">📱 QRIS</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="qris-transactions">Jumlah Transaksi *</label>
              <input
                type="number"
                id="qris-transactions"
                value={paymentMethodData.qris.jumlahTransaksi}
                onChange={(e) => setPaymentMethodData({
                  ...paymentMethodData,
                  qris: { ...paymentMethodData.qris, jumlahTransaksi: e.target.value }
                })}
                placeholder="Enter number of QRIS transactions"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="qris-percentage">% dari Total (Auto-calculated)</label>
              <input
                type="text"
                id="qris-percentage"
                value={`${qrisPercentage}%`}
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="qris-revenue">Revenue (Rp) *</label>
              <input
                type="number"
                step="0.01"
                id="qris-revenue"
                value={paymentMethodData.qris.revenue}
                onChange={(e) => setPaymentMethodData({
                  ...paymentMethodData,
                  qris: { ...paymentMethodData.qris, revenue: e.target.value }
                })}
                placeholder="Enter QRIS revenue"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="qris-fee">Fee/Cost (Rp) (Auto-calculated 0.7%)</label>
              <input
                type="text"
                id="qris-fee"
                value={`Rp ${qrisFee.toLocaleString('id-ID')}`}
                disabled
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>
        </div>

        <div className="conversion-note">
          <p><strong>Information:</strong></p>
          <ul>
            <li>Percentage automatically calculated based on total transactions (Cash + QRIS)</li>
            <li>Cash fee is always 0</li>
            <li>QRIS fee is automatically calculated at 0.7% of revenue</li>
          </ul>
        </div>
      </div>
    );
  };
  const renderOperationalCostForm = () => (
    <div className="form-section">
      <h3>Operational Cost Data</h3>
      <div className="current-date-info">
        <p><strong>Date:</strong> {new Date().toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p className="shift-note"><strong>Note:</strong> Please enter amounts for operational cost types. At least one cost type must have an amount to proceed.</p>
      </div>
      
      {operationalCostData.costs.map((cost, index) => (
        <div key={cost.operationalCostTypeId} className="category-section">
          <h4 className="category-title">
            💰 {cost.operationalCostName}
          </h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`amount-${cost.operationalCostTypeId}`}>Amount (Rp) *</label>
              <input
                type="number"
                step="0.01"
                id={`amount-${cost.operationalCostTypeId}`}
                value={cost.amount}
                onChange={(e) => updateOperationalCostData(cost.operationalCostTypeId, 'amount', e.target.value)}
                placeholder="Enter amount"
                min="0"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor={`description-${cost.operationalCostTypeId}`}>Description</label>
              <textarea
                id={`description-${cost.operationalCostTypeId}`}
                value={cost.description}
                onChange={(e) => updateOperationalCostData(cost.operationalCostTypeId, 'description', e.target.value)}
                placeholder="Enter description (optional)"
                rows="2"
              />
            </div>
          </div>
        </div>
      ))}
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
      )}      <div className="form-container">
        {currentStep === 1 && renderTrafficForm()}
        {currentStep === 2 && renderSalesCategoryForm()}
        {currentStep === 3 && renderPaymentMethodForm()}
        {currentStep === 4 && renderOperationalCostForm()}

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
            {loading ? 'Submitting...' : currentStep === 4 ? 'Submit All Data' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportEntryPage;
