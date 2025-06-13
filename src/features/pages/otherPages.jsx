import React from "react";
import TrafficAndCustomerPageComponent from "./TrafficAndCustomerPage.jsx";
import SalesCategoryPageComponent from "./SalesCategoryPage.jsx";

// Traffic and Customer Page
export const TrafficAndCustomerPage = () => <TrafficAndCustomerPageComponent />;

// Sales Category Page
export const SalesCategoryPage = () => <SalesCategoryPageComponent />;

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