import React, { useState, useEffect } from 'react';
import AuthError from '../../components/AuthError.jsx';
import './PaymentMethodPage.css';

const PaymentMethodPage = () => {
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

      console.log('Token found:', token ? 'Yes' : 'No'); // Debug log
      console.log('Fetching data for date:', date); // Debug log

      const response = await fetch(`${API_BASE_URL}/payment-method-breakdown/by-date?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorResult = await response.json();
          console.log('Error response:', errorResult); // Debug log
          if (errorResult.message) {
            errorMessage = errorResult.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.message);
        // Set sample data for demonstration if no real data available
        setData([
          {
            id: 1,
            paymentType: { id: 1, paymentName: "Cash" },
            jumlahTransaksi: 45,
            persenDariTotal: 60.5,
            revenue: 2500000,
            fee: 0,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            paymentType: { id: 2, paymentName: "QRIS" },
            jumlahTransaksi: 35,
            persenDariTotal: 39.5,
            revenue: 1800000,
            fee: 18000,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError(err.message || 'Failed to fetch data');
      // Set sample data for demonstration when API is not available
      setData([
        {
          id: 1,
          paymentType: { id: 1, paymentName: "Cash" },
          jumlahTransaksi: 45,
          persenDariTotal: 60.5,
          revenue: 2500000,
          fee: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          paymentType: { id: 2, paymentName: "QRIS" },
          jumlahTransaksi: 35,
          persenDariTotal: 39.5,
          revenue: 1800000,
          fee: 18000,
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

      const response = await fetch(`${API_BASE_URL}/payment-method-breakdown/dates`, {
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
    return availableDates.includes(nextDate) && nextDate <= new Date().toISOString().split('T')[0];
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
    <div className="payment-method-page">
      <div className="page-header">
        <h1 className="page-title">Payment Method Breakdown</h1>
        <p className="page-subtitle">Data breakdown metode pembayaran harian</p>
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
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment method data...</p>
        </div>
      )}

      {/* Error State */}
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
                No payment method data available for {formatDate(selectedDate)}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Jumlah Transaksi</th>
                    <th>Persen dari Total</th>
                    <th>Revenue (IDR)</th>
                    <th>Fee (IDR)</th>
                    <th>Net Revenue (IDR)</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <span className={`payment-method-badge ${item.paymentType?.paymentName?.toLowerCase()}`}>
                          {item.paymentType?.paymentName === 'Cash' ? '💵' : '📱'} {item.paymentType?.paymentName}
                        </span>
                      </td>
                      <td className="number-cell">
                        {formatNumber(item.jumlahTransaksi)}
                      </td>
                      <td className="percentage-cell">
                        {formatPercentage(item.persenDariTotal)}
                      </td>
                      <td className="currency-cell">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="currency-cell">
                        {formatCurrency(item.fee)}
                      </td>
                      <td className="currency-cell net-revenue">
                        {formatCurrency(item.revenue - item.fee)}
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
              <h4>Total Transaksi</h4>
              <p className="stat-value">
                {formatNumber(data.reduce((sum, item) => sum + parseFloat(item.jumlahTransaksi || 0), 0))}
              </p>
            </div>
            <div className="stat-card">
              <h4>Total Revenue</h4>
              <p className="stat-value currency">
                {formatCurrency(data.reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0))}
              </p>
            </div>
            <div className="stat-card">
              <h4>Total Fee</h4>
              <p className="stat-value currency">
                {formatCurrency(data.reduce((sum, item) => sum + parseFloat(item.fee || 0), 0))}
              </p>
            </div>
            <div className="stat-card">
              <h4>Net Revenue</h4>
              <p className="stat-value currency net">
                {formatCurrency(data.reduce((sum, item) => sum + parseFloat(item.revenue || 0) - parseFloat(item.fee || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodPage;
