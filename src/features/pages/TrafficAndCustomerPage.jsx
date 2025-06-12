import React, { useState, useEffect } from 'react';
import AuthError from '../../components/AuthError.jsx';
import './TrafficAndCustomerPage.css';

const TrafficAndCustomerPage = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL - adjust according to your backend URL
  const API_BASE_URL = 'http://localhost:3000/api';
  // Fetch data by date
  const fetchDataByDate = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch(`${API_BASE_URL}/traffic-and-customer/by-date?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
        if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
        // Set sample data for demonstration if no real data available
        setData([
          {
            id: 1,
            timeShift: "Morning",
            customerCount: 130,
            transaction: 100,
            conversionRate: 76.92,
            description: "Morning shift yesterday",
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            timeShift: "Evening",
            customerCount: 180,
            transaction: 150,
            conversionRate: 83.33,
            description: "Evening shift yesterday",
            createdAt: new Date().toISOString()
          }
        ]);
      }    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      // Set sample data for demonstration when API is not available
      setData([
        {
          id: 1,
          timeShift: "Morning",
          customerCount: 130,
          transaction: 100,
          conversionRate: 76.92,
          description: "Morning shift yesterday",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          timeShift: "Evening",
          customerCount: 180,
          transaction: 150,
          conversionRate: 83.33,
          description: "Evening shift yesterday",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch available dates
  const fetchAvailableDates = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No token found for fetching dates');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/traffic-and-customer/dates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAvailableDates(result.data);
        }
      } else if (response.status === 401) {
        console.error('Authentication failed when fetching dates');
      }
    } catch (err) {
      console.error('Failed to fetch available dates:', err);
    }
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
  };

  // Check if previous day has data
  const hasPreviousData = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDate = currentDate.toISOString().split('T')[0];
    return availableDates.includes(prevDate);
  };

  // Check if next day has data
  const hasNextData = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDate = currentDate.toISOString().split('T')[0];
    return availableDates.includes(nextDate);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format number with thousand separator
  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  // Format percentage
  const formatPercentage = (percentage) => {
    return `${parseFloat(percentage).toFixed(2)}%`;
  };
  // Effect to fetch data when date changes
  useEffect(() => {
    fetchDataByDate(selectedDate);
  }, [selectedDate]);

  // Effect to fetch available dates on component mount
  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const handleLoginRedirect = () => {
    // Clear invalid tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Trigger app re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('auth-logout'));
  };

  const handleRetry = () => {
    setError(null);
    fetchDataByDate(selectedDate);
  };
  return (
    <div className="traffic-customer-page">
      <div className="page-header">
        <h1 className="page-title">Traffic & Customer Data</h1>
        <p className="page-subtitle">Data lalu lintas dan pelanggan per shift</p>
      </div>

      {/* Date Navigation */}
      <div className="date-navigation">
        <div className="date-controls">
          <button 
            className="btn btn-secondary"
            onClick={goToPreviousDay}
            disabled={!hasPreviousData()}
          >
            ← Previous Day
          </button>
          
          <div className="date-display">
            <h3>{formatDate(selectedDate)}</h3>
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={goToNextDay}
            disabled={!hasNextData()}
          >
            Next Day →
          </button>
        </div>

        <div className="date-picker-container">
          <label htmlFor="date-picker">Select Date:</label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )}      {/* Error State */}
      {error && (
        <AuthError 
          error={error}
          onRetry={handleRetry}
          onLoginRedirect={handleLoginRedirect}
        />
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="data-table-container">
          {data.length === 0 ? (
            <div className="no-data-container">
              <p className="no-data-message">
                No traffic and customer data available for {formatDate(selectedDate)}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time Shift</th>
                    <th>Customer Count</th>
                    <th>Transaction</th>
                    <th>Conversion Rate</th>
                    <th>Description</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <span className="time-shift-badge">
                          {item.timeShift}
                        </span>
                      </td>
                      <td className="number-cell">
                        {formatNumber(item.customerCount)}
                      </td>
                      <td className="number-cell">
                        {formatNumber(item.transaction)}
                      </td>
                      <td className="percentage-cell">
                        {formatPercentage(item.conversionRate)}
                      </td>
                      <td className="description-cell">
                        {item.description || '-'}
                      </td>
                      <td className="date-cell">
                        {new Date(item.createdAt).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Summary Statistics */}
      {!loading && !error && data.length > 0 && (
        <div className="summary-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Customers</h4>
              <p className="stat-value">
                {formatNumber(data.reduce((sum, item) => sum + parseFloat(item.customerCount), 0))}
              </p>
            </div>
            <div className="stat-card">
              <h4>Total Transactions</h4>
              <p className="stat-value">
                {formatNumber(data.reduce((sum, item) => sum + parseFloat(item.transaction), 0))}
              </p>
            </div>
            <div className="stat-card">
              <h4>Average Conversion Rate</h4>
              <p className="stat-value">
                {formatPercentage(
                  data.reduce((sum, item) => sum + parseFloat(item.conversionRate), 0) / data.length
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficAndCustomerPage;
