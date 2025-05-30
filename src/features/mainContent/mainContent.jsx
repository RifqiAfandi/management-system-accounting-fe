import React from "react";
import ContentRenderer from "./contentReader.jsx";

const MainContent = ({ activeTab }) => {
  const getHeaderTitle = (tab) => {
    switch (tab) {
      case "CreateUser":
        return "Create User";
      case "UserList":
        return "User List";
      default:
        return tab;
    }
  };

  return (
    <main className="main-content">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <h1 className="header-title">{getHeaderTitle(activeTab)}</h1>
          <div className="user-info">
            <span>Welcome, Admin</span>
            <div className="user-avatar">A</div>
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