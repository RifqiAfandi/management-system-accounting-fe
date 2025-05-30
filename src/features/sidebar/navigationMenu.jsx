import React from "react";
import { renderIcon } from "../../utils/iconUtils.jsx";
import { navigationItems } from "../../constants/navigationConstants.js";

const NavigationMenu = ({
  activeTab,
  isUserDropdownOpen,
  onTabClick,
  onToggleUserDropdown,
}) => {
  const isUserTabActive = (tab) => {
    return activeTab === "Users" || activeTab === "CreateUser" || activeTab === "UserList";
  };

  return (
    <nav className="sidebar-nav">
      <ul className="nav-list">
        {navigationItems.map((item) => (
          <li key={item.key} className="nav-item">
            {item.hasDropdown ? (
              <>
                <button
                  className={`nav-button ${isUserTabActive() ? "active" : ""}`}
                  onClick={onToggleUserDropdown}
                >
                  {renderIcon(item.icon)}
                  <span className="nav-text">{item.label}</span>
                  <span
                    className={`dropdown-icon ${
                      isUserDropdownOpen ? "open" : ""
                    }`}
                  >
                    {renderIcon(
                      isUserDropdownOpen ? "chevronDown" : "chevronRight"
                    )}
                  </span>
                </button>

                {/* Dropdown Submenu */}
                <div
                  className={`submenu ${
                    isUserDropdownOpen ? "open" : "closed"
                  }`}
                >
                  {item.submenu.map((subItem) => (
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