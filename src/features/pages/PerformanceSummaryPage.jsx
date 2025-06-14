import React, { useState, useEffect } from 'react';
import AuthError from '../../components/AuthError.jsx';
import './PerformanceSummaryPage.css';

const PerformanceSummaryPage = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [targets, setTargets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL - adjust according to your backend URL
  const API_BASE_URL = 'http://localhost:3000/api';
  // Fetch performance summary data
  const fetchDataByDate = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch(`${API_BASE_URL}/daily-performance-summary/by-date?date=${date}`, {
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
        setData(result.data || []);
      } else {
        setError(result.message);
        setData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch performance summary data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch performance metrics
  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No token found for fetching metrics');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/daily-performance-summary-metric`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
        if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMetrics(result.data);
        }
      } else if (response.status === 401) {
        console.error('Authentication failed when fetching metrics');
      }
    } catch (err) {
      console.error('Failed to fetch performance metrics:', err);
    }
  };

  // Fetch performance targets
  const fetchTargets = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No token found for fetching targets');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/daily-performance-summary-target`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
        if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTargets(result.data);
        }
      } else if (response.status === 401) {
        console.error('Authentication failed when fetching targets');
      }
    } catch (err) {
      console.error('Failed to fetch performance targets:', err);
    }
  };

  // Fetch available dates
  const fetchAvailableDates = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No token found for fetching dates');
        return;
      }      // The dates endpoint is now available in the controller
      const response = await fetch(`${API_BASE_URL}/daily-performance-summary/dates`, {
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
    if (percentage === null || percentage === undefined || percentage === '') {
      return '0.00%';
    }
    return `${parseFloat(percentage).toFixed(2)}%`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'exceeded':
        return 'status-badge-exceeded';
      case 'on track':
        return 'status-badge-on-track';
      case 'below target':
        return 'status-badge-below';
      default:
        return 'status-badge-default';
    }
  };

  // Effect to fetch data when date changes
  useEffect(() => {
    fetchDataByDate(selectedDate);
  }, [selectedDate]);

  // Effect to fetch metrics, targets and available dates on component mount
  useEffect(() => {
    fetchMetrics();
    fetchTargets();
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
    <div className="performance-summary-page">
      <div className="page-header">
        <h1 className="page-title">Daily Performance Summary</h1>
        <p className="page-subtitle">Ringkasan performa harian dan pencapaian target</p>
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
          <p>Loading performance summary data...</p>
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
                No performance summary data available for {formatDate(selectedDate)}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Target</th>
                    <th>Actual</th>
                    <th>Achievement</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <span className="metric-badge">
                          {item.metric?.metricName || 'Unknown'}
                        </span>
                      </td>
                      <td className="target-cell">
                        {formatNumber(item.target?.dailyTargetValue || 0)}
                      </td>
                      <td className="actual-cell">
                        {formatNumber(item.actual || 0)}
                      </td>
                      <td className="achievement-cell">
                        {formatPercentage(item.achivement)}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                          {item.status || 'Unknown'}
                        </span>
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
              <h4>Total Metrics</h4>
              <p className="stat-value">
                {data.length}
              </p>
            </div>
            <div className="stat-card">
              <h4>Average Achievement</h4>
              <p className="stat-value">
                {formatPercentage(
                  data.reduce((sum, item) => sum + parseFloat(item.achivement || 0), 0) / data.length
                )}
              </p>
            </div>
            <div className="stat-card">
              <h4>Targets Met</h4>
              <p className="stat-value">
                {data.filter(item => (item.achivement || 0) >= 100).length} / {data.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Breakdown by Status */}
      {!loading && !error && data.length > 0 && (
        <div className="performance-breakdown">
          <h3>Performance Breakdown</h3>
          <div className="status-grid">
            {['Exceeded', 'On Track', 'Below Target'].map(status => {
              const statusData = data.filter(item => 
                item.status?.toLowerCase() === status.toLowerCase()
              );
              
              if (statusData.length > 0) {
                return (
                  <div key={status} className="status-card">
                    <h5 className={getStatusBadgeClass(status)}>{status}</h5>
                    <p className="status-count">{statusData.length} metrics</p>
                    <p className="status-percentage">
                      {formatPercentage((statusData.length / data.length) * 100)}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceSummaryPage;
