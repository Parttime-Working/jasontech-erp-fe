"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { sidebarConfigs, SidebarConfigKey } from "./SidebarConfigs";

/**
 * 動態 Sidebar Hook
 * 根據當前路徑自動選擇合適的 sidebar 配置
 */
export function useSidebar() {
  const pathname = usePathname();

  const currentConfig = useMemo(() => {
    // 根據路徑匹配對應的配置
    for (const [key, config] of Object.entries(sidebarConfigs)) {
      const isMatch = config.showOnPaths.some(path =>
        pathname === path || pathname.startsWith(path + '/')
      );

      if (isMatch) {
        return { key: key as SidebarConfigKey, config };
      }
    }

    return null;
  }, [pathname]);

  return {
    currentConfig,
    allConfigs: sidebarConfigs,
    getConfig: (key: SidebarConfigKey) => sidebarConfigs[key],
  };
}

/**
 * 根據模組名稱獲取 sidebar 配置
 */
export function useSidebarByModule(module: SidebarConfigKey) {
  return sidebarConfigs[module];
}

/**
 * 自定義 sidebar 配置 Hook
 * 允許動態修改配置
 */
export function useCustomSidebar(baseConfig: SidebarConfigKey) {
  const base = sidebarConfigs[baseConfig];

  const methods = {
    withCustomItems: (customItems: typeof base.items) => ({
      ...base,
      items: customItems,
    }),
    withBadge: (itemIndex: number, badge: string | number) => ({
      ...base,
      items: base.items.map((item, index) =>
        index === itemIndex ? { ...item, badge } : item
      ),
    }),
    withDisabled: (itemIndex: number, disabled: boolean) => ({
      ...base,
      items: base.items.map((item, index) =>
        index === itemIndex ? { ...item, disabled } : item
      ),
    }),
  };

  return {
    ...base,
    ...methods,
  };
}
