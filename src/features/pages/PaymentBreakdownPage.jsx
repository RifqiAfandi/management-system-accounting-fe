import React, { useState, useEffect } from "react";

const PaymentBreakdownPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [paymentData, setPaymentData] = useState([]);

  // Generate sample payment data for demonstration
  const generateSampleData = (date) => {
    const currentDate = new Date(date);
    const sampleData = [
      {
        id: 1,
        paymentMethod: "Cash",
        icon: "💵",
        transactions: 125,
        totalAmount: 45750000,
        percentage: 32.8,
        averageTransaction: 366000,
        description: "Pembayaran tunai"
      },
      {
        id: 2,
        paymentMethod: "Credit Card",
        icon: "💳",
        transactions: 89,
        totalAmount: 38900000,
        percentage: 27.9,
        averageTransaction: 437079,
        description: "Kartu kredit (Visa, MasterCard)"
      },
      {
        id: 3,
        paymentMethod: "Debit Card",
        icon: "💴",
        transactions: 76,
        totalAmount: 22800000,
        percentage: 16.4,
        averageTransaction: 300000,
        description: "Kartu debit"
      },
      {
        id: 4,
        paymentMethod: "E-Wallet",
        icon: "📱",
        transactions: 94,
        totalAmount: 18800000,
        percentage: 13.5,
        averageTransaction: 200000,
        description: "OVO, GoPay, DANA, ShopeePay"
      },
      {
        id: 5,
        paymentMethod: "Bank Transfer",
        icon: "🏦",
        transactions: 32,
        totalAmount: 9600000,
        percentage: 6.9,
        averageTransaction: 300000,
        description: "Transfer bank online"
      },
      {
        id: 6,
        paymentMethod: "QRIS",
        icon: "📊",
        transactions: 45,
        totalAmount: 3600000,
        percentage: 2.5,
        averageTransaction: 80000,
        description: "Quick Response Code Indonesian Standard"
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
    setPaymentData(data);
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

  // Format currency (Indonesian Rupiah)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get payment method badge class
  const getPaymentBadgeClass = (method) => {
    const classes = {
      'Cash': 'payment-cash',
      'Credit Card': 'payment-credit',
      'Debit Card': 'payment-debit',
      'E-Wallet': 'payment-ewallet',
      'Bank Transfer': 'payment-transfer',
      'QRIS': 'payment-qris'
    };
    return `payment-badge ${classes[method] || 'payment-other'}`;
  };

  const totalAmount = paymentData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalTransactions = paymentData.reduce((sum, item) => sum + item.transactions, 0);

  return (
    <div className="payment-breakdown-page">
      {/* Header Section */}
      <div className="page-header">
        <h2 className="page-title">💳 Payment Method Breakdown</h2>
        <p className="page-description">
          Analyze daily payment method distribution and transaction patterns
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
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h3>Total Revenue</h3>
              <p className="summary-value">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🧾</div>
            <div className="summary-content">
              <h3>Total Transactions</h3>
              <p className="summary-value">{totalTransactions.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💳</div>
            <div className="summary-content">
              <h3>Payment Methods</h3>
              <p className="summary-value">{paymentData.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h3>Avg. Transaction</h3>
              <p className="summary-value">
                {totalTransactions > 0 ? formatCurrency(totalAmount / totalTransactions) : 'Rp 0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Cards */}
      {paymentData.length > 0 && (
        <div className="payment-cards-section">
          <h3 className="section-title">Payment Method Overview</h3>
          <div className="payment-cards">
            {paymentData.map((payment) => (
              <div key={payment.id} className="payment-card">
                <div className="payment-header">
                  <div className="payment-method-info">
                    <span className="payment-icon">{payment.icon}</span>
                    <div className="payment-details">
                      <h4 className="payment-name">{payment.paymentMethod}</h4>
                      <p className="payment-description">{payment.description}</p>
                    </div>
                  </div>
                  <div className="payment-percentage">
                    {payment.percentage}%
                  </div>
                </div>
                <div className="payment-stats">
                  <div className="stat-row">
                    <span className="stat-label">Revenue:</span>
                    <span className="stat-value revenue">{formatCurrency(payment.totalAmount)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Transactions:</span>
                    <span className="stat-value">{payment.transactions.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Avg. Amount:</span>
                    <span className="stat-value">{formatCurrency(payment.averageTransaction)}</span>
                  </div>
                </div>
                <div className="payment-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${payment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Data Table */}
      <div className="data-table-container">
        <div className="table-header">
          <h3>Payment Method Details</h3>
          {isFutureDate() && (
            <div className="future-date-notice">
              📅 No data available for future dates
            </div>
          )}
        </div>

        {paymentData.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Transactions</th>
                  <th>Total Amount</th>
                  <th>Avg. Transaction</th>
                  <th>Percentage</th>
                  <th>Market Share</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((payment) => (
                  <tr key={payment.id}>
                    <td className="method-cell">
                      <div className="method-info">
                        <span className="method-icon">{payment.icon}</span>
                        <div className="method-details">
                          <span className={getPaymentBadgeClass(payment.paymentMethod)}>
                            {payment.paymentMethod}
                          </span>
                          <small className="method-description">{payment.description}</small>
                        </div>
                      </div>
                    </td>
                    <td className="transactions-cell">{payment.transactions.toLocaleString('id-ID')}</td>
                    <td className="amount-cell">{formatCurrency(payment.totalAmount)}</td>
                    <td className="avg-cell">{formatCurrency(payment.averageTransaction)}</td>
                    <td className="percentage-cell">
                      <div className="percentage-display">
                        <span className="percentage-text">{payment.percentage}%</span>
                        <div className="mini-progress">
                          <div 
                            className="mini-progress-fill"
                            style={{ width: `${payment.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="share-cell">
                      <div className="market-share">
                        <div className="share-bar">
                          <div 
                            className="share-fill"
                            style={{ width: `${(payment.percentage / 35) * 100}%` }}
                          ></div>
                        </div>
                        <span className="share-label">
                          {payment.percentage > 25 ? 'High' : payment.percentage > 15 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">💳</div>
            <h3>No Data Available</h3>
            <p>
              {isFutureDate() 
                ? "Cannot display data for future dates" 
                : "No payment data found for this date"
              }
            </p>
          </div>
        )}
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .payment-breakdown-page {
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

        .payment-cards-section {
          margin-bottom: 1.5rem;
        }

        .section-title {
          margin: 0 0 1rem 0;
          color: var(--neutral-900);
          font-size: 1.125rem;
          font-weight: 600;
        }

        .payment-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1rem;
        }

        .payment-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
          border: 1px solid var(--neutral-200);
        }

        .payment-card:hover {
          transform: translateY(-2px);
        }

        .payment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .payment-method-info {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .payment-icon {
          font-size: 1.5rem;
          padding: 0.5rem;
          background: var(--neutral-100);
          border-radius: 0.375rem;
        }

        .payment-details h4 {
          margin: 0 0 0.25rem 0;
          color: var(--neutral-900);
          font-size: 1rem;
          font-weight: 600;
        }

        .payment-description {
          margin: 0;
          color: var(--neutral-600);
          font-size: 0.8rem;
        }

        .payment-percentage {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .payment-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--neutral-600);
        }

        .stat-value {
          font-weight: 600;
          color: var(--neutral-900);
        }

        .stat-value.revenue {
          color: var(--success-color);
        }

        .payment-progress {
          margin-top: 1rem;
        }

        .progress-bar {
          height: 8px;
          background: var(--neutral-200);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
          transition: width 0.3s ease;
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

        .method-cell {
          min-width: 250px;
        }

        .method-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .method-icon {
          font-size: 1.25rem;
        }

        .method-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .method-description {
          color: var(--neutral-500);
          font-size: 0.75rem;
        }

        .payment-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .payment-cash {
          background: var(--success-light);
          color: var(--success-dark);
        }

        .payment-credit {
          background: var(--info-light);
          color: var(--info-dark);
        }

        .payment-debit {
          background: var(--primary-light);
          color: var(--primary-dark);
        }

        .payment-ewallet {
          background: #fdf2f8;
          color: #be185d;
        }

        .payment-transfer {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .payment-qris {
          background: var(--warning-light);
          color: var(--warning-dark);
        }

        .payment-other {
          background: var(--neutral-100);
          color: var(--neutral-700);
        }

        .transactions-cell {
          text-align: center;
          font-weight: 600;
          color: var(--neutral-700);
        }

        .amount-cell {
          text-align: right;
          font-weight: 700;
          color: var(--success-color);
          font-family: var(--font-mono);
        }

        .avg-cell {
          text-align: right;
          font-weight: 500;
          color: var(--neutral-700);
          font-family: var(--font-mono);
        }

        .percentage-cell {
          width: 120px;
        }

        .percentage-display {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .percentage-text {
          font-weight: 600;
          color: var(--neutral-900);
        }

        .mini-progress {
          height: 4px;
          background: var(--neutral-200);
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          background: var(--primary-color);
          transition: width 0.3s ease;
        }

        .share-cell {
          width: 150px;
        }

        .market-share {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .share-bar {
          height: 6px;
          background: var(--neutral-200);
          border-radius: 3px;
          overflow: hidden;
        }

        .share-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--warning-color), var(--success-color));
          transition: width 0.3s ease;
        }

        .share-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
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

          .payment-cards {
            grid-template-columns: 1fr;
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .data-table th,
          .data-table td {
            padding: 0.75rem 1rem;
          }

          .method-cell {
            min-width: 200px;
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

          .payment-card {
            padding: 1rem;
          }

          .payment-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentBreakdownPage;
