import React from "react";
import HomePage from "../pages/homePages.jsx";
import {
  StokPage,
  ProdukPage,
  CreateUserPage,
  UserListPage,
  SettingsPage,
  TrafficAndCustomerPage,
  SalesCategoryPage,
  OperationalCostPage,
  PerformanceSummaryPage,
} from "../pages/otherPages.jsx";

const ContentRenderer = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePage />;
      case "TrafficAndCustomer":
        return <TrafficAndCustomerPage />;
      case "SalesCategory":
        return <SalesCategoryPage />;
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