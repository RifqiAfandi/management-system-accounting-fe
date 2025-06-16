import React, { useState } from "react";
import Sidebar from "./sidebar/sidebar.jsx";
import MainContent from "./mainContent/mainContent.jsx";
import { navigationItems } from "../constants/navigationConstants.js";
import "./adminPage.css";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState(new Set());

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const toggleSidebar = () => {
    const newSidebarState = !isSidebarVisible;
    setIsSidebarVisible(newSidebarState);
    
    // Close all dropdowns when sidebar is collapsed
    if (!newSidebarState) {
      setOpenDropdowns(new Set());
    }
  };
  const toggleDropdown = (dropdownKey) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dropdownKey)) {
        newSet.delete(dropdownKey);
      } else {
        newSet.add(dropdownKey);
        
        // Auto-navigate to first submenu item when dropdown opens
        const dropdownItem = navigationItems.find(item => item.key === dropdownKey);
        if (dropdownItem && dropdownItem.submenu && dropdownItem.submenu.length > 0) {
          const firstSubmenuItem = dropdownItem.submenu[0];
          setActiveTab(firstSubmenuItem.key);
        }
      }
      return newSet;
    });
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
    <div className="admin-dashboard">      <Sidebar
        activeTab={activeTab}
        isSidebarVisible={isSidebarVisible}
        openDropdowns={openDropdowns}
        onTabClick={handleTabClick}
        onToggleSidebar={toggleSidebar}
        onToggleDropdown={toggleDropdown}
        onLogout={handleLogout}
      />
      <MainContent activeTab={activeTab} user={user} />
    </div>
  );
};

export default AdminDashboard;