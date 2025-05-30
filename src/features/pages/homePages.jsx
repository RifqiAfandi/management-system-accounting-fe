import React from "react";
import StatsGrid from "../dashboard/statsGrid.jsx";

const HomePage = () => {
  return (
    <div>
      <StatsGrid />
      <div className="welcome-card">
        <h3 className="welcome-title">Selamat Datang di Admin Dashboard</h3>
        <p className="welcome-text">
          Kelola sistem Anda dengan mudah melalui dashboard ini. Gunakan menu di
          sebelah kiri untuk navigasi ke berbagai fitur yang tersedia.
        </p>
      </div>
    </div>
  );
};

export default HomePage;