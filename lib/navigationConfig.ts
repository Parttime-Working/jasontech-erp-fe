// 統一的導航配置
// 這個檔案定義了整個應用的導航結構，nav 和 sidebar 都會從這裡讀取配置

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: string; // Lucide icon name
  requireAuth: boolean;
  roles?: string[];
  showInNav: boolean; // 是否在導航欄顯示
  showInSidebar: boolean; // 是否在側邊欄顯示
  sidebarConfig?: {
    title: string;
    titleIcon: string;
    items: SidebarItem[];
    showOnPaths: string[];
  };
}

export interface SidebarItem {
  href: string;
  label: string;
  icon: string;
  badge?: string | number;
  disabled?: boolean;
}

// 主要導航項目配置
export const navigationConfig: NavItem[] = [
  {
    id: 'home',
    href: '/',
    label: '首頁',
    icon: 'Home',
    requireAuth: false,
    showInNav: true,
    showInSidebar: false,
  },
  {
    id: 'dashboard',
    href: '/dashboard',
    label: '主控台',
    icon: 'BarChart3',
    requireAuth: true,
    showInNav: true,
    showInSidebar: false,
  },
  {
    id: 'system-management',
    href: '/settings/account-management',
    label: '系統管理',
    icon: 'Settings',
    requireAuth: true,
    showInNav: false,  // 移除主選單上的重複按鈕
    showInSidebar: true,
    sidebarConfig: {
      title: '系統管理',
      titleIcon: 'Settings',
      items: [
        {
          href: '/settings/account-management',
          label: '帳號設定',
          icon: 'Users',
        },
        {
          href: '/settings/role-management',
          label: '角色管理',
          icon: 'Settings',
        },
        {
          href: '/settings/permission-management',
          label: '權限管理',
          icon: 'Shield',
        },
      ],
      showOnPaths: [
        '/settings/account-management',
        '/settings/role-management',
        '/settings/permission-management',
      ],
    },
  },
  {
    id: 'business-intelligence',
    href: '/dashboard/analytics',
    label: '商業智慧',
    icon: 'BarChart3',
    requireAuth: true,
    showInNav: false,
    showInSidebar: true,
    sidebarConfig: {
      title: '商業智慧',
      titleIcon: 'BarChart3',
      items: [
        {
          href: '/dashboard/analytics',
          label: '數據分析',
          icon: 'BarChart3',
        },
        {
          href: '/dashboard/reports',
          label: '報表中心',
          icon: 'FileText',
          badge: '新',
        },
        {
          href: '/dashboard/trends',
          label: '趨勢分析',
          icon: 'TrendingUp',
        },
      ],
      showOnPaths: ['/dashboard/analytics', '/dashboard/reports', '/dashboard/trends'],
    },
  },
  {
    id: 'inventory',
    href: '/dashboard/inventory',
    label: '庫存管理',
    icon: 'Package',
    requireAuth: true,
    showInNav: false,
    showInSidebar: true,
    sidebarConfig: {
      title: '庫存管理',
      titleIcon: 'Package',
      items: [
        {
          href: '/dashboard/inventory',
          label: '庫存總覽',
          icon: 'Package',
        },
        {
          href: '/dashboard/products',
          label: '商品管理',
          icon: 'ShoppingCart',
        },
      ],
      showOnPaths: ['/dashboard/inventory', '/dashboard/products'],
    },
  },
];

// 工具函數：獲取導航欄項目
export const getNavItems = () => {
  return navigationConfig.filter(item => item.showInNav);
};

// 工具函數：獲取側邊欄配置
export const getSidebarConfigs = () => {
  return navigationConfig
    .filter(item => item.showInSidebar && item.sidebarConfig)
    .map(item => ({
      key: item.id,
      config: item.sidebarConfig!,
    }));
};

// 工具函數：根據 ID 獲取側邊欄配置
export const getSidebarConfigById = (id: string) => {
  const item = navigationConfig.find(item => item.id === id);
  return item?.sidebarConfig || null;
};

// 工具函數：獲取所有受保護的路徑
export const getProtectedPaths = () => {
  return navigationConfig
    .filter(item => item.requireAuth)
    .flatMap(item => {
      const paths = [item.href];
      if (item.sidebarConfig?.showOnPaths) {
        paths.push(...item.sidebarConfig.showOnPaths);
      }
      return paths;
    });
};
