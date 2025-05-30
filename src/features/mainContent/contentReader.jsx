import React from "react";
import HomePage from "../pages/homePages.jsx";
import {
  LaporanPage,
  StokPage,
  ProdukPage,
  CreateUserPage,
  UserListPage,
  SettingsPage,
} from "../pages/otherPages.jsx";

const ContentRenderer = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePage />;
      case "Laporan":
        return <LaporanPage />;
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