export const navigationItems = [
  {
    key: "Home",
    label: "Home",
    icon: "home",
    hasDropdown: false,
  },
  {
    key: "Laporan",
    label: "Laporan",
    icon: "report",
    hasDropdown: false,
  },
  {
    key: "Stok",
    label: "Stok",
    icon: "stock",
    hasDropdown: false,
  },
  {
    key: "Produk",
    label: "Produk",
    icon: "product",
    hasDropdown: false,
  },
  {
    key: "Users",
    label: "Users",
    icon: "users",
    hasDropdown: true,
    submenu: [
      {
        key: "CreateUser",
        label: "Create User",
        icon: "userPlus",
      },
      {
        key: "UserList",
        label: "User List",
        icon: "users",
      },
    ],
  },
  {
    key: "Settings",
    label: "Settings",
    icon: "settings",
    hasDropdown: false,
  },
];