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
        return <OperationalCostPage />;      case "PerformanceSummary":
        return <PerformanceSummaryPage />;
      case "LabaRugi":
        return (
          <div className="welcome-card">
            <h2>Laba Rugi</h2>
            <p className="welcome-text">Laporan Laba Rugi functionality coming soon...</p>
          </div>
        );
      case "Neraca":
        return (
          <div className="welcome-card">
            <h2>Neraca</h2>
            <p className="welcome-text">Laporan Neraca functionality coming soon...</p>
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