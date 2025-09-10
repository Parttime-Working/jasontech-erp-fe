// 圖標名稱類型定義
export type IconName = "Users" | "Shield" | "Settings" | "BarChart3" | "FileText" | "TrendingUp" | "Package" | "ShoppingCart";

// 從統一配置生成側邊欄配置
import { getSidebarConfigs } from "@/lib/navigationConfig";

// 生成側邊欄配置
const sidebarConfigsData = getSidebarConfigs();

// 系統管理模組配置 - 從統一配置生成
export const systemManagementConfig = sidebarConfigsData.find(item => item.key === 'system-management')?.config || {
  title: "系統管理",
  titleIcon: "Settings" as IconName,
  items: [],
  showOnPaths: [],
};

// 商業智慧模組配置 - 從統一配置生成
export const businessIntelligenceConfig = sidebarConfigsData.find(item => item.key === 'business-intelligence')?.config || {
  title: "商業智慧",
  titleIcon: "BarChart3" as IconName,
  items: [],
  showOnPaths: [],
};

// 庫存管理模組配置 - 從統一配置生成
export const inventoryConfig = sidebarConfigsData.find(item => item.key === 'inventory')?.config || {
  title: "庫存管理",
  titleIcon: "Package" as IconName,
  items: [],
  showOnPaths: [],
};

// 配置集合
export const sidebarConfigs = {
  systemManagement: systemManagementConfig,
  businessIntelligence: businessIntelligenceConfig,
  inventory: inventoryConfig,
};

// 配置鍵類型
export type SidebarConfigKey = keyof typeof sidebarConfigs;
