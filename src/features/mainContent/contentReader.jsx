import React from "react";
import HomePage from "../pages/homePages.jsx";
import ReportEntryPage from "../pages/ReportEntryPage.jsx";
import {
  TrafficAndCustomerPage,
  SalesCategoryPage,
  PaymentMethodPage,
  OperationalCostPage,
  PerformanceSummaryPage,
} from "../pages/otherPages.jsx";

const ContentRenderer = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePage />;
      case "ReportEntry":
        return <ReportEntryPage />;      case "TrafficAndCustomer":
        return <TrafficAndCustomerPage />;
      case "SalesCategory":
        return <SalesCategoryPage />;
      case "PaymentMethod":
        return <PaymentMethodPage />;
      case "OperationalCost":
        return <OperationalCostPage />;
      case "PerformanceSummary":
        return <PerformanceSummaryPage />;
      case "WeeklyReport":
        return (
          <div className="welcome-card">
            <h2>Weekly Report</h2>
            <p className="welcome-text">Weekly report functionality coming soon...</p>
          </div>
        );
      case "MonthlyReport":
        return (
          <div className="welcome-card">
            <h2>Monthly Report</h2>
            <p className="welcome-text">Monthly report functionality coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="welcome-card">
            <p className="welcome-text">Content for {activeTab} tab.</p>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default ContentRenderer;