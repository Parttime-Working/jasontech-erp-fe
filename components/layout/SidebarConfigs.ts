// 圖標名稱類型定義
export type IconName = "Users" | "Shield" | "Settings" | "BarChart3" | "FileText" | "TrendingUp" | "Package" | "ShoppingCart";

// 系統管理模組配置
export const systemManagementConfig = {
  title: "系統管理",
  titleIcon: "Settings" as IconName,
  items: [
    {
      href: "/dashboard/account-management",
      label: "帳號設定",
      icon: "Users" as IconName,
    },
    {
      href: "/dashboard/role-management",
      label: "角色管理",
      icon: "Settings" as IconName,
    },
    {
      href: "/dashboard/permission-management",
      label: "權限管理",
      icon: "Shield" as IconName,
    },
  ],
  showOnPaths: [
    "/dashboard/account-management",
    "/dashboard/role-management",
    "/dashboard/permission-management"
  ],
};

// 商業智慧模組配置
export const businessIntelligenceConfig = {
  title: "商業智慧",
  titleIcon: "BarChart3" as IconName,
  items: [
    {
      href: "/dashboard/analytics",
      label: "數據分析",
      icon: "BarChart3" as IconName,
    },
    {
      href: "/dashboard/reports",
      label: "報表中心",
      icon: "FileText" as IconName,
      badge: "新",
    },
    {
      href: "/dashboard/trends",
      label: "趨勢分析",
      icon: "TrendingUp" as IconName,
    },
  ],
  showOnPaths: ["/dashboard/analytics", "/dashboard/reports", "/dashboard/trends"],
};

// 庫存管理模組配置
export const inventoryConfig = {
  title: "庫存管理",
  titleIcon: "Package" as IconName,
  items: [
    {
      href: "/dashboard/inventory",
      label: "庫存總覽",
      icon: "Package" as IconName,
    },
    {
      href: "/dashboard/products",
      label: "商品管理",
      icon: "ShoppingCart" as IconName,
    },
  ],
  showOnPaths: ["/dashboard/inventory", "/dashboard/products"],
};

// 配置集合
export const sidebarConfigs = {
  systemManagement: systemManagementConfig,
  businessIntelligence: businessIntelligenceConfig,
  inventory: inventoryConfig,
};

// 配置鍵類型
export type SidebarConfigKey = keyof typeof sidebarConfigs;
