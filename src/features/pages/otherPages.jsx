import React from "react";
import TrafficAndCustomerPageComponent from "./TrafficAndCustomerPage.jsx";
import SalesCategoryPageComponent from "./SalesCategoryPage.jsx";

// Traffic and Customer Page
export const TrafficAndCustomerPage = () => <TrafficAndCustomerPageComponent />;

// Sales Category Page
export const SalesCategoryPage = () => <SalesCategoryPageComponent />;

// Laporan Page
export const LaporanPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">📊 Manajemen Laporan</h2>
    <p className="welcome-text">Kelola dan lihat laporan sistem di sini.</p>
  </div>
);

// Stok Page
export const StokPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">📦 Manajemen Stok</h2>
    <p className="welcome-text">Kelola stok barang dan inventori di sini.</p>
  </div>
);

// Produk Page
export const ProdukPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">📋 Manajemen Produk</h2>
    <p className="welcome-text">Kelola produk dan katalog di sini.</p>
  </div>
);

// Create User Page
export const CreateUserPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">👤 Buat User Baru</h2>
    <p className="welcome-text">
      Form untuk membuat user baru akan ditampilkan di sini.
    </p>
  </div>
);

// User List Page
export const UserListPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">👥 Daftar User</h2>
    <p className="welcome-text">
      Daftar semua user sistem akan ditampilkan di sini.
    </p>
  </div>
);

// Settings Page
export const SettingsPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">⚙️ Pengaturan</h2>
    <p className="welcome-text">Kelola pengaturan sistem di sini.</p>
  </div>
);

// Operational Cost Page
export const OperationalCostPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">💰 Daily Operational Cost</h2>
    <p className="welcome-text">Track and analyze daily operational expenses.</p>
  </div>
);

// Performance Summary Page
export const PerformanceSummaryPage = () => (
  <div className="welcome-card">
    <h2 className="welcome-title">📋 Daily Performance Summary</h2>
    <p className="welcome-text">View overall daily performance metrics.</p>
  </div>
);