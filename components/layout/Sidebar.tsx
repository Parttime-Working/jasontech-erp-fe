"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Users, Shield, Settings, BarChart3, FileText, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { IconName } from "./SidebarConfigs";

// 圖標映射
const iconMap: Record<IconName, LucideIcon> = {
  Users,
  Shield,
  Settings,
  BarChart3,
  FileText,
  TrendingUp,
  Package,
  ShoppingCart,
};

export interface SidebarItem {
  href: string;
  label: string;
  icon: IconName;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps {
  className?: string;
  title?: string;
  titleIcon?: IconName;
  items: SidebarItem[];
  showOnPaths?: string[]; // 指定在哪些路徑下顯示 sidebar
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function Sidebar({
  className,
  title,
  titleIcon,
  items,
  showOnPaths,
  collapsible = false,
  defaultCollapsed = false
}: SidebarProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    setIsClient(true);

    // 響應式邏輯：當螢幕寬度小於 1024px 時自動收合
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024 && !defaultCollapsed) {
        setIsCollapsed(false);
      }
    };

    // 初始檢查
    handleResize();

    // 添加事件監聽
    window.addEventListener('resize', handleResize);

    // 清理事件監聽
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultCollapsed]);

  // 檢查是否應該顯示 sidebar
  const shouldShowSidebar = () => {
    if (!showOnPaths || showOnPaths.length === 0) {
      // 如果沒有指定路徑，檢查是否在 items 中的任何一個路徑
      return items.some(item =>
        pathname === item.href || pathname.startsWith(item.href + '/')
      );
    }

    // 檢查當前路徑是否在指定的顯示路徑中
    return showOnPaths.some(path =>
      pathname === path || pathname.startsWith(path + '/')
    );
  };

  // 在服務器端或不應該顯示時不渲染
  if (!isClient || !shouldShowSidebar()) {
    return null;
  }

  // 獲取標題圖標組件
  const TitleIcon = titleIcon ? iconMap[titleIcon] : null;

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 shadow-sm transition-all duration-300 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-40",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      {(title || TitleIcon) && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-2",
              isCollapsed && "justify-center"
            )}>
              {TitleIcon && <TitleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />}
              {!isCollapsed && title && (
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h2>
              )}
            </div>
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform",
                    isCollapsed ? "rotate-180" : ""
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "",
                isActive && !isCollapsed
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                  : "",
                !isActive && !isDisabled
                  ? "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                  : "",
                isDisabled
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "",
                isCollapsed && isActive ? "bg-blue-100" : ""
              )}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                }
              }}
            >
              <Icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      typeof item.badge === 'number'
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// 預設導出 Sidebar 作為主要組件
export default Sidebar;
