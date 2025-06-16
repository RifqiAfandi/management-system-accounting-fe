export const navigationItems = [
  {
    key: "Home",
    label: "Home",
    icon: "home",
    hasDropdown: false,
  },
  {
    key: "ReportEntry",
    label: "Report Entry",
    icon: "edit",
    hasDropdown: false,
  },  {
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
        key: "PaymentMethod",
        label: "Payment Method",
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
  },  {
    key: "Laporan",
    label: "Laporan",
    icon: "document",
    hasDropdown: true,
    submenu: [
      {
        key: "LabaRugi",
        label: "Laba Rugi",
        icon: "report",
      },
      {
        key: "Neraca",
        label: "Neraca",
        icon: "report",
      },
    ],
  },
];