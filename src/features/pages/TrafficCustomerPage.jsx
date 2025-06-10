import React, { useState, useEffect } from "react";

const TrafficCustomerPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customerData, setCustomerData] = useState([]);

  // Generate sample data for demonstration
  const generateSampleData = (date) => {
    const currentDate = new Date(date);
    const sampleData = [
      {
        id: 1,
        time: "08:00",
        customerName: "Ahmad Santoso",
        category: "Walk-in",
        source: "Direct",
        status: "Active"
      },
      {
        id: 2,
        time: "09:15",
        customerName: "Siti Nurhaliza",
        category: "Online",
        source: "Website",
        status: "Active"
      },
      {
        id: 3,
        time: "10:30",
        customerName: "Budi Prasetyo",
        category: "Walk-in",
        source: "Referral",
        status: "Completed"
      },
      {
        id: 4,
        time: "11:45",
        customerName: "Dewi Sartika",
        category: "Phone",
        source: "Call Center",
        status: "Active"
      },
      {
        id: 5,
        time: "13:00",
        customerName: "Reza Firmansyah",
        category: "Online",
        source: "Social Media",
        status: "Pending"
      },
      {
        id: 6,
        time: "14:20",
        customerName: "Maya Sari",
        category: "Walk-in",
        source: "Direct",
        status: "Completed"
      },
      {
        id: 7,
        time: "15:30",
        customerName: "Andi Wijaya",
        category: "Online",
        source: "Website",
        status: "Active"
      },
      {
        id: 8,
        time: "16:45",
        customerName: "Lila Permata",
        category: "Phone",
        source: "Call Center",
        status: "Completed"
      }
    ];

    // Filter data for dates in the future (no data)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    if (currentDate > today) {
      return [];
    }
    
    return sampleData;
  };

  // Check if selected date is future date
  const isFutureDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  // Load data when date changes
  useEffect(() => {
    const data = generateSampleData(selectedDate);
    setCustomerData(data);
  }, [selectedDate]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Handle date input change
  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-active';
      case 'Completed':
        return 'status-badge status-completed';
      case 'Pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="traffic-customer-page">
      {/* Header Section */}
      <div className="page-header">
        <h2 className="page-title">📊 Traffic And Customer Data</h2>
        <p className="page-description">
          Monitor daily customer traffic and activity patterns
        </p>
      </div>

      {/* Date Navigation Section */}
      <div className="date-navigation">
        <div className="date-controls">
          <button 
            className="nav-btn prev-btn" 
            onClick={goToPreviousDay}
            title="Previous Day"
          >
            ← Previous
          </button>
          
          <div className="date-selector">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
              className="date-input"
            />
            <div className="selected-date-display">
              {formatDate(selectedDate)}
            </div>
          </div>
          
          <button 
            className="nav-btn next-btn" 
            onClick={goToNextDay}
            disabled={isFutureDate()}
            title={isFutureDate() ? "Cannot view future dates" : "Next Day"}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div className="data-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">👥</div>
            <div className="summary-content">
              <h3>Total Customers</h3>
              <p className="summary-value">{customerData.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🚶</div>
            <div className="summary-content">
              <h3>Walk-in</h3>
              <p className="summary-value">
                {customerData.filter(item => item.category === 'Walk-in').length}
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💻</div>
            <div className="summary-content">
              <h3>Online</h3>
              <p className="summary-value">
                {customerData.filter(item => item.category === 'Online').length}
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📞</div>
            <div className="summary-content">
              <h3>Phone</h3>
              <p className="summary-value">
                {customerData.filter(item => item.category === 'Phone').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="data-table-container">
        <div className="table-header">
          <h3>Customer Traffic Details</h3>
          {isFutureDate() && (
            <div className="future-date-notice">
              📅 No data available for future dates
            </div>
          )}
        </div>

        {customerData.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Customer Name</th>
                  <th>Category</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer) => (
                  <tr key={customer.id}>
                    <td className="time-cell">{customer.time}</td>
                    <td className="name-cell">{customer.customerName}</td>
                    <td className="category-cell">
                      <span className={`category-badge category-${customer.category.toLowerCase()}`}>
                        {customer.category}
                      </span>
                    </td>
                    <td className="source-cell">{customer.source}</td>
                    <td className="status-cell">
                      <span className={getStatusBadgeClass(customer.status)}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <h3>No Data Available</h3>
            <p>
              {isFutureDate() 
                ? "Cannot display data for future dates" 
                : "No customer traffic data found for this date"
              }
            </p>
          </div>
        )}
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .traffic-customer-page {
          padding: 0;
          max-width: 100%;
        }

        .page-header {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--primary-color);
        }

        .page-title {
          margin: 0 0 0.5rem 0;
          color: var(--neutral-900);
          font-size: 1.5rem;
          font-weight: 600;
        }

        .page-description {
          margin: 0;
          color: var(--neutral-600);
          font-size: 0.95rem;
        }

        .date-navigation {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .date-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          min-width: 100px;
        }

        .nav-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .nav-btn:disabled {
          background: var(--neutral-300);
          cursor: not-allowed;
          transform: none;
        }

        .date-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .date-input {
          padding: 0.75rem;
          border: 2px solid var(--neutral-200);
          border-radius: 0.375rem;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .date-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .selected-date-display {
          font-weight: 600;
          color: var(--neutral-700);
          text-align: center;
          font-size: 0.9rem;
        }

        .data-summary {
          margin-bottom: 1.5rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-card {
          background: white;
          padding: 1.25rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .summary-card:hover {
          transform: translateY(-2px);
        }

        .summary-icon {
          font-size: 2rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--neutral-100);
          border-radius: 0.5rem;
        }

        .summary-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          color: var(--neutral-600);
          font-weight: 500;
        }

        .summary-value {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--neutral-900);
        }

        .data-table-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--neutral-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-header h3 {
          margin: 0;
          color: var(--neutral-900);
          font-size: 1.125rem;
          font-weight: 600;
        }

        .future-date-notice {
          background: var(--warning-light);
          color: var(--warning-dark);
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          border: 1px solid var(--warning-color);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: var(--neutral-50);
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: var(--neutral-700);
          font-size: 0.875rem;
          border-bottom: 1px solid var(--neutral-200);
        }

        .data-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--neutral-200);
          vertical-align: middle;
        }

        .data-table tr:hover {
          background: var(--neutral-50);
        }

        .time-cell {
          font-weight: 600;
          color: var(--neutral-700);
          font-family: var(--font-mono);
        }

        .name-cell {
          font-weight: 500;
          color: var(--neutral-900);
        }

        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .category-walk-in {
          background: var(--info-light);
          color: var(--info-dark);
        }

        .category-online {
          background: var(--success-light);
          color: var(--success-dark);
        }

        .category-phone {
          background: var(--warning-light);
          color: var(--warning-dark);
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-active {
          background: var(--success-light);
          color: var(--success-dark);
        }

        .status-completed {
          background: var(--info-light);
          color: var(--info-dark);
        }

        .status-pending {
          background: var(--warning-light);
          color: var(--warning-dark);
        }

        .no-data {
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--neutral-500);
        }

        .no-data-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-data h3 {
          margin: 0 0 0.5rem 0;
          color: var(--neutral-600);
          font-size: 1.125rem;
        }

        .no-data p {
          margin: 0;
          color: var(--neutral-500);
          font-size: 0.95rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .date-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-btn {
            width: 100%;
            max-width: 200px;
          }

          .summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .data-table th,
          .data-table td {
            padding: 0.75rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }

          .data-table th,
          .data-table td {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }

          .page-header {
            padding: 1rem;
          }

          .date-navigation {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TrafficCustomerPage;
