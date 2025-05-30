import React from "react";
import { renderIcon } from "../../utils/iconUtils.jsx";
import { statsData } from "../../constants/dashboardConstants.js";

const StatsGrid = () => {
  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="card-header">
            <div>
              <div className="card-title">{stat.title}</div>
              <div className="card-value">{stat.value}</div>
            </div>
            <div className={`card-icon ${stat.iconColor}`}>
              {renderIcon(stat.icon)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;