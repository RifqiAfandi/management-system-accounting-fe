import React from "react";
import NavigationMenu from "./navigationMenu.jsx";
import { renderIcon } from "../../utils/iconUtils.jsx";

const Sidebar = ({
  activeTab,
  isSidebarVisible,
  openDropdowns,
  onTabClick,
  onToggleSidebar,
  onToggleDropdown,
  onLogout,
}) => {
  return (
    <aside
      className={`admin-sidebar ${isSidebarVisible ? "visible" : "hidden"}`}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <button className="toggle-btn" onClick={onToggleSidebar}>
          {renderIcon(isSidebarVisible ? "close" : "menu")}
        </button>
      </div>

      {/* Navigation Menu */}      <NavigationMenu
        activeTab={activeTab}
        openDropdowns={openDropdowns}
        onTabClick={onTabClick}
        onToggleDropdown={onToggleDropdown}
      />

      {/* Logout Section */}
      <div className="logout-section">
        <button className="logout-button" onClick={onLogout}>
          {renderIcon("logout")}
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;