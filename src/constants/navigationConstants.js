export const navigationItems = [
  {
    key: "Home",
    label: "Home",
    icon: "home",
    hasDropdown: false,
  },
  {
    key: "DailyReport",
    label: "Daily Report",
    icon: "report",
    hasDropdown: true,
    submenu: [
      {
        key: "TrafficAndCustomer",
        label: "Traffic And Customer",
        icon: "report",
      },
      {
        key: "SalesCategory",
        label: "Sales By Category",
        icon: "report",
      },
      {
        key: "OperationalCost",
        label: "Operational Cost",
        icon: "report",
      },
      {
        key: "PerformanceSummary",
        label: "Performance Summary",
        icon: "report",
      },
    ],
  },
  {
    key: "WeeklyReport",
    label: "Weekly Report",
    icon: "calendar",
    hasDropdown: false,
  },
  {
    key: "MonthlyReport",
    label: "Monthly Report",
    icon: "calendarMonth",
    hasDropdown: false,
  },
];