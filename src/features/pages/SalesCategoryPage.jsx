import React, { useState, useEffect } from "react";

const SalesCategoryPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);

  // Generate sample sales data for demonstration
  const generateSampleData = (date) => {
    const currentDate = new Date(date);
    const sampleData = [
      {
        id: 1,
        category: "Elektronik",
        productName: "Smartphone Samsung A54",
        quantity: 15,
        unitPrice: 4500000,
        totalSales: 67500000,
        percentage: 28.5
      },
      {
        id: 2,
        category: "Fashion",
        productName: "Kemeja Formal Pria",
        quantity: 32,
        unitPrice: 185000,
        totalSales: 5920000,
        percentage: 2.5
      },
      {
        id: 3,
        category: "Elektronik",
        productName: "Laptop ASUS VivoBook",
        quantity: 8,
        unitPrice: 8750000,
        totalSales: 70000000,
        percentage: 29.6
      },
      {
        id: 4,
        category: "Kesehatan",
        productName: "Vitamin C 1000mg",
        quantity: 45,
        unitPrice: 125000,
        totalSales: 5625000,
        percentage: 2.4
      },
      {
        id: 5,
        category: "Fashion",
        productName: "Sepatu Sneakers",
        quantity: 18,
        unitPrice: 850000,
        totalSales: 15300000,
        percentage: 6.5
      },
      {
        id: 6,
        category: "Makanan",
        productName: "Cokelat Premium",
        quantity: 67,
        unitPrice: 85000,
        totalSales: 5695000,
        percentage: 2.4
      },
      {
        id: 7,
        category: "Elektronik",
        productName: "Headphone Wireless",
        quantity: 22,
        unitPrice: 950000,
        totalSales: 20900000,
        percentage: 8.8
      },
      {
        id: 8,
        category: "Olahraga",
        productName: "Sepeda Gunung MTB",
        quantity: 12,
        unitPrice: 3800000,
        totalSales: 45600000,
        percentage: 19.3
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
    setSalesData(data);
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

  // Calculate category summaries
  const getCategorySummary = () => {
    const categories = {};
    salesData.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = {
          totalSales: 0,
          totalQuantity: 0,
          products: 0
        };
      }
      categories[item.category].totalSales += item.totalSales;
      categories[item.category].totalQuantity += item.quantity;
      categories[item.category].products += 1;
    });
    return categories;
  };

  // Get category badge class
  const getCategoryBadgeClass = (category) => {
    const classes = {
      'Elektronik': 'category-elektronik',
      'Fashion': 'category-fashion',
      'Kesehatan': 'category-kesehatan',
      'Makanan': 'category-makanan',
      'Olahraga': 'category-olahraga'
    };
    return `category-badge ${classes[category] || 'category-other'}`;
  };

  const categorySummary = getCategorySummary();
  const totalSales = salesData.reduce((sum, item) => sum + item.totalSales, 0);

  return (
    <div className="sales-category-page">
      {/* Header Section */}
      <div className="page-header">
        <h2 className="page-title">📈 Sales By Category</h2>
        <p className="page-description">
          Analyze daily sales performance by product categories
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
              <h3>Total Sales</h3>
              <p className="summary-value">{formatCurrency(totalSales)}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📦</div>
            <div className="summary-content">
              <h3>Total Products</h3>
              <p className="summary-value">{salesData.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h3>Categories</h3>
              <p className="summary-value">{Object.keys(categorySummary).length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🎯</div>
            <div className="summary-content">
              <h3>Total Quantity</h3>
              <p className="summary-value">
                {salesData.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Summary Cards */}
      {Object.keys(categorySummary).length > 0 && (
        <div className="category-summary">
          <h3 className="section-title">Category Performance</h3>
          <div className="category-cards">
            {Object.entries(categorySummary).map(([category, data]) => (
              <div key={category} className="category-card">
                <div className="category-header">
                  <span className={getCategoryBadgeClass(category)}>
                    {category}
                  </span>
                  <span className="category-percentage">
                    {((data.totalSales / totalSales) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="category-stats">
                  <div className="stat-item">
                    <span className="stat-label">Sales:</span>
                    <span className="stat-value">{formatCurrency(data.totalSales)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Products:</span>
                    <span className="stat-value">{data.products}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Quantity:</span>
                    <span className="stat-value">{data.totalQuantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Data Table */}
      <div className="data-table-container">
        <div className="table-header">
          <h3>Sales Details by Category</h3>
          {isFutureDate() && (
            <div className="future-date-notice">
              📅 No data available for future dates
            </div>
          )}
        </div>

        {salesData.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Sales</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale.id}>
                    <td className="category-cell">
                      <span className={getCategoryBadgeClass(sale.category)}>
                        {sale.category}
                      </span>
                    </td>
                    <td className="product-cell">{sale.productName}</td>
                    <td className="quantity-cell">{sale.quantity}</td>
                    <td className="price-cell">{formatCurrency(sale.unitPrice)}</td>
                    <td className="sales-cell">{formatCurrency(sale.totalSales)}</td>
                    <td className="percentage-cell">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${sale.percentage}%` }}
                        ></div>
                        <span className="percentage-text">{sale.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📈</div>
            <h3>No Data Available</h3>
            <p>
              {isFutureDate() 
                ? "Cannot display data for future dates" 
                : "No sales data found for this date"
              }
            </p>
          </div>
        )}
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .sales-category-page {
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

        .category-summary {
          margin-bottom: 1.5rem;
        }

        .section-title {
          margin: 0 0 1rem 0;
          color: var(--neutral-900);
          font-size: 1.125rem;
          font-weight: 600;
        }

        .category-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .category-card {
          background: white;
          padding: 1.25rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .category-card:hover {
          transform: translateY(-2px);
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .category-percentage {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--success-color);
        }

        .category-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-item {
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

        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .category-elektronik {
          background: var(--info-light);
          color: var(--info-dark);
        }

        .category-fashion {
          background: #fdf2f8;
          color: #be185d;
        }

        .category-kesehatan {
          background: var(--success-light);
          color: var(--success-dark);
        }

        .category-makanan {
          background: var(--warning-light);
          color: var(--warning-dark);
        }

        .category-olahraga {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .category-other {
          background: var(--neutral-100);
          color: var(--neutral-700);
        }

        .product-cell {
          font-weight: 500;
          color: var(--neutral-900);
        }

        .quantity-cell {
          text-align: center;
          font-weight: 600;
          color: var(--neutral-700);
        }

        .price-cell {
          text-align: right;
          font-weight: 500;
          color: var(--neutral-700);
          font-family: var(--font-mono);
        }

        .sales-cell {
          text-align: right;
          font-weight: 700;
          color: var(--success-color);
          font-family: var(--font-mono);
        }

        .percentage-cell {
          width: 150px;
        }

        .percentage-bar {
          position: relative;
          height: 20px;
          background: var(--neutral-200);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .percentage-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--success-color), var(--success-light));
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .percentage-text {
          position: relative;
          z-index: 1;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neutral-700);
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

          .category-cards {
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

          .percentage-cell {
            width: 120px;
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

          .percentage-cell {
            width: 100px;
          }

          .percentage-bar {
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesCategoryPage;
