import React from "react";
import ContentRenderer from "./contentReader.jsx";

const MainContent = ({ activeTab, user }) => {  const getHeaderTitle = (tab) => {
    switch (tab) {
      case "CreateUser":
        return "Create User";
      case "UserList":
        return "User List";
      case "WeeklyReport":
        return "Weekly Report";
      case "MonthlyReport":
        return "Monthly Report";
      default:
        return tab;
    }
  };

  const getUserDisplayName = () => {
    if (user) {
      return user.name || user.email || "Admin";
    }
    return "Admin";
  };

  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <main className="main-content">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <h1 className="header-title">{getHeaderTitle(activeTab)}</h1>          <div className="user-info">
            <span>Welcome, {getUserDisplayName()}</span>
            <div className="user-avatar">{getUserInitial()}</div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="content-area">
        <ContentRenderer activeTab={activeTab} />
      </div>
    </main>
  );
};

export default MainContent;