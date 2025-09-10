# 通用 Sidebar 系統

這是一個配置驅動的通用側邊欄系統，採用零重複代碼的設計理念。

## 📁 架構

```
components/layout/
├── Sidebar.tsx              # ⭐ 通用組件 (唯一的核心組件)
├── SidebarConfigs.ts        # ⚙️ 配置中心 (所有模組配置)
├── useSidebar.ts           # 🎣 自定義 Hook
└── README.md               # 📖 文檔
```

## 🚀 快速開始

### 1. 基本用法

```tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { systemManagementConfig } from "@/components/layout/SidebarConfigs";

export default function MyLayout() {
  return (
    <div className="flex">
      <Sidebar {...systemManagementConfig} />
      <main>{children}</main>
    </div>
  );
}
```

### 2. 使用 Hook

```tsx
import { useSidebar } from "@/components/layout/useSidebar";

export default function SmartLayout() {
  const { currentConfig } = useSidebar();

  if (!currentConfig) return <div>{children}</div>;

  return (
    <div className="flex">
      <Sidebar {...currentConfig.config} />
      <main>{children}</main>
    </div>
  );
}
```

### 3. 自定義配置

```tsx
import { useCustomSidebar } from "@/components/layout/useSidebar";

export default function CustomLayout() {
  const customConfig = useCustomSidebar('systemManagement')
    .withBadge(0, 3)      // 帳號設定顯示 3 個未讀
    .withDisabled(1, true); // 禁用角色管理

  return (
    <div className="flex">
      <Sidebar {...customConfig} />
      <main>{children}</main>
    </div>
  );
}
```

## ⚙️ 配置系統

### 添加新模組

```tsx
// SidebarConfigs.ts
export const newModuleConfig = {
  title: "新模組",
  titleIcon: Star,
  items: [
    { href: "/new/feature1", label: "功能1", icon: Icon1 },
    { href: "/new/feature2", label: "功能2", icon: Icon2 },
  ],
  showOnPaths: ["/new"],
};

// 添加到配置集合
export const sidebarConfigs = {
  // ... 現有配置
  newModule: newModuleConfig,
};
```

## 🎣 Hook 系統

### useSidebar()
```tsx
const { currentConfig, allConfigs, getConfig } = useSidebar();

// 自動檢測當前頁面對應的配置
if (currentConfig) {
  <Sidebar {...currentConfig.config} />
}
```

### useSidebarByModule()
```tsx
const config = useSidebarByModule('businessIntelligence');
<Sidebar {...config} />
```

### useCustomSidebar()
```tsx
const custom = useCustomSidebar('systemManagement')
  .withBadge(0, '新')
  .withDisabled(1, false);
```

## 🎨 自定義選項

### 樣式定制
```tsx
<Sidebar
  className="bg-gradient-to-b from-blue-50 to-white border-blue-200"
  {...config}
/>
```

### 折疊功能
```tsx
<Sidebar
  collapsible={true}
  defaultCollapsed={false}
  {...config}
/>
```

## 🚀 高級用法示例

### 智能佈局（自動檢測模組）
```tsx
export function AdvancedDashboardLayout({ children }) {
  // 方法 1: 自動檢測當前模組
  const { currentConfig } = useSidebar();

  // 方法 2: 自定義配置
  const customConfig = useCustomSidebar('systemManagement')
    .withBadge(2, 5) // 給權限管理添加徽章
    .withDisabled(1, false); // 確保角色管理啟用

  // 如果有當前配置，使用它；否則使用自定義配置
  const sidebarConfig = currentConfig?.config || customConfig;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar {...sidebarConfig} />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### 商業智慧佈局
```tsx
export function BusinessIntelligenceLayout({ children }) {
  const { getConfig } = useSidebar();
  const biConfig = getConfig('businessIntelligence');

  return (
    <div className="flex min-h-screen">
      <Sidebar {...biConfig} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

### 動態權限控制
```tsx
export function PermissionBasedLayout({ children }) {
  const config = useCustomSidebar('systemManagement')
    .withDisabled(2, !hasPermission('manage_permissions')) // 根據權限禁用項目
    .withBadge(0, unreadNotifications); // 實時更新徽章

  return (
    <div className="flex">
      <Sidebar {...config} />
      <main>{children}</main>
    </div>
  );
}
```

## 🔧 最佳實踐

### 1. 配置組織
```tsx
// ✅ 好的實踐
export const configs = {
  admin: adminConfig,
  user: userConfig,
  guest: guestConfig,
};

// ❌ 不好的實踐
const adminItems = [...];
const userItems = [...];
const guestItems = [...];
```

### 2. 路徑匹配
```tsx
// ✅ 精確匹配
showOnPaths: ["/dashboard/users", "/dashboard/settings"]

// ❌ 過於寬泛
showOnPaths: ["/dashboard"] // 可能會在不需要的地方顯示
```

## 🎉 特性

- ✅ **零重複代碼**：一個通用組件搞定所有需求
- ✅ **配置驅動**：通過配置控制行為，無需修改組件
- ✅ **高度靈活**：支持動態配置、權限控制、自定義樣式
- ✅ **易於維護**：集中管理所有配置，修改一處生效全域
- ✅ **強類型支持**：完整的 TypeScript 支持
