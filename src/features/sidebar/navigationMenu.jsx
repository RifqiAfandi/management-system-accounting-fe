import React from "react";
import { renderIcon } from "../../utils/iconUtils.jsx";
import { navigationItems } from "../../constants/navigationConstants.js";

const NavigationMenu = ({
  activeTab,
  openDropdowns,
  onTabClick,
  onToggleDropdown,
}) => {
  // Check if any submenu item is active for a parent dropdown
  const isAnySubmenuActive = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some(subItem => activeTab === subItem.key);
  };

  // Check if dropdown is open
  const isDropdownOpen = (key) => {
    return openDropdowns.has(key);
  };

  // Handle dropdown toggle with auto-navigation to first item
  const handleDropdownToggle = (item) => {
    const isCurrentlyOpen = isDropdownOpen(item.key);
    
    // Toggle the dropdown
    onToggleDropdown(item.key);
    
    // If opening the dropdown and there are submenu items, navigate to the first one
    if (!isCurrentlyOpen && item.submenu && item.submenu.length > 0) {
      onTabClick(item.submenu[0].key);
    }
  };

  return (
    <nav className="sidebar-nav">
      <ul className="nav-list">
        {navigationItems.map((item) => (
          <li key={item.key} className="nav-item">            {item.hasDropdown ? (
              <>                <button
                  className={`nav-button ${
                    isAnySubmenuActive(item) ? "active" : ""
                  }`}
                  onClick={() => handleDropdownToggle(item)}
                >
                  {renderIcon(item.icon)}
                  <span className="nav-text">{item.label}</span>
                  <span
                    className={`dropdown-icon ${
                      isDropdownOpen(item.key) ? "open" : ""
                    }`}
                  >
                    {renderIcon(
                      isDropdownOpen(item.key) ? "chevronDown" : "chevronRight"
                    )}
                  </span>
                </button>

                {/* Dropdown Submenu */}
                <div
                  className={`submenu ${
                    isDropdownOpen(item.key) ? "open" : "closed"
                  }`}
                >
                  {item.submenu?.map((subItem) => (
                    <button
                      key={subItem.key}
                      className={`submenu-button ${
                        activeTab === subItem.key ? "active" : ""
                      }`}
                      onClick={() => onTabClick(subItem.key)}
                    >
                      {renderIcon(subItem.icon)}
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button
                className={`nav-button ${
                  activeTab === item.key ? "active" : ""
                }`}
                onClick={() => onTabClick(item.key)}
              >
                {renderIcon(item.icon)}
                <span className="nav-text">{item.label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;