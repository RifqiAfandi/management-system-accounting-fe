import React from "react";

export const renderIcon = (iconName) => {
  const icons = {
    home: "🏠",
    report: "📊",
    stock: "📦",
    product: "📋",
    users: "👥",
    userPlus: "👤",
    settings: "⚙️",
    logout: "🚪",
    menu: "☰",
    close: "✕",
    chevronRight: "▶",
    chevronDown: "▼",
    alertCircle: "⚠️",
    refreshCw: "🔄",
    eye: "👁️",
    eyeOff: "🙈",
    calendar: "📅",
    calendarMonth: "🗓️",
    edit: "✏️",
  };
  return <span className="nav-icon">{icons[iconName] || "•"}</span>;
};