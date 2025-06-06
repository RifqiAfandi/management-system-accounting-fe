import React from "react";
import HomePage from "../pages/homePages.jsx";
import {
  LaporanPage,
  StokPage,
  ProdukPage,
  CreateUserPage,
  UserListPage,
  SettingsPage,
  TrafficCustomerPage,
  SalesCategoryPage,
  PaymentBreakdownPage,
  OperationalCostPage,
  PerformanceSummaryPage,
} from "../pages/otherPages.jsx";

const ContentRenderer = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePage />;
      case "TrafficCustomer":
        return <TrafficCustomerPage />;
      case "SalesCategory":
        return <SalesCategoryPage />;
      case "PaymentBreakdown":
        return <PaymentBreakdownPage />;
      case "OperationalCost":
        return <OperationalCostPage />;
      case "PerformanceSummary":
        return <PerformanceSummaryPage />;
      case "Stok":
        return <StokPage />;
      case "Produk":
        return <ProdukPage />;
      case "CreateUser":
        return <CreateUserPage />;
      case "UserList":
        return <UserListPage />;
      case "Settings":
        return <SettingsPage />;
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