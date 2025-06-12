import React, { useState } from "react";
import Sidebar from "./sidebar/sidebar.jsx";
import MainContent from "./mainContent/mainContent.jsx";
import "./adminPage.css";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab !== "Users") {
      setIsUserDropdownOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setActiveTab("Users");
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback untuk backward compatibility
      window.location.href = "/login";
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        activeTab={activeTab}
        isSidebarVisible={isSidebarVisible}
        isUserDropdownOpen={isUserDropdownOpen}
        onTabClick={handleTabClick}
        onToggleSidebar={toggleSidebar}
        onToggleUserDropdown={toggleUserDropdown}
        onLogout={handleLogout}
      />
      <MainContent activeTab={activeTab} user={user} />
    </div>
  );
};

export default AdminDashboard;